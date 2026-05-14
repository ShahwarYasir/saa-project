import { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { profileSchema } from '../../utils/validators';
import { COUNTRIES, DEGREE_LEVELS, FIELDS_OF_INTEREST, QUALIFICATION_LEVELS, RANKING_PREFERENCES, INTAKE_SEASONS } from '../../utils/constants';
import { getProfile, updateProfile } from '../../services/profileService';
import { useProfileCompletion } from '../../hooks/useProfileCompletion';
import { ToastContext } from '../../context/ToastContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import FormInput from '../../components/forms/FormInput';
import FormSelect from '../../components/forms/FormSelect';
import MultiSelect from '../../components/forms/MultiSelect';
import ProgressBar from '../../components/common/ProgressBar';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';

export default function ProfileBuilderPage() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [preferredCountries, setPreferredCountries] = useState([]);
  const toast = useContext(ToastContext);

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({ resolver: yupResolver(profileSchema) });
  const watched = watch();
  const { percentage } = useProfileCompletion({ ...watched, preferred_countries: preferredCountries });

  useEffect(() => {
    getProfile().then(res => {
      setProfileData(res.data);
      reset(res.data);
      setPreferredCountries(res.data.preferred_countries || []);
    }).catch(err => setError(err.message)).finally(() => setLoading(false));
  }, [reset]);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      await updateProfile({ ...data, preferred_countries: preferredCountries });
      toast.success('Profile saved successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="page-container">
        <div className="page-header">
          <h1>Profile Builder</h1>
          <p>Complete your profile to get personalized university and scholarship recommendations</p>
        </div>

        <ProgressBar value={percentage} label="Profile Completion" className="mb-5" />

        {loading && <LoadingSpinner />}
        {error && <ErrorAlert message={error} />}

        {!loading && !error && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="saa-card mb-4">
              <div className="saa-card-header"><i className="bi bi-person me-2"></i>Personal Information</div>
              <div className="saa-card-body">
                <div className="row">
                  <div className="col-md-6"><FormSelect label="Nationality" name="nationality" register={register} error={errors.nationality} options={COUNTRIES} /></div>
                  <div className="col-md-6"><FormSelect label="Current Country" name="current_country" register={register} error={errors.current_country} options={COUNTRIES} /></div>
                </div>
              </div>
            </div>

            <div className="saa-card mb-4">
              <div className="saa-card-header"><i className="bi bi-mortarboard me-2"></i>Academic Background</div>
              <div className="saa-card-body">
                <div className="row">
                  <div className="col-md-6"><FormSelect label="Current Qualification" name="current_qualification" register={register} error={errors.current_qualification} options={QUALIFICATION_LEVELS} /></div>
                  <div className="col-md-6"><FormInput label="GPA (out of 4.0)" name="gpa" register={register} error={errors.gpa} type="number" step="0.01" placeholder="3.45" /></div>
                </div>
                <div className="row">
                  <div className="col-md-6"><FormSelect label="Field of Interest" name="field_of_interest" register={register} error={errors.field_of_interest} options={FIELDS_OF_INTEREST} /></div>
                  <div className="col-md-6"><FormSelect label="Target Degree Level" name="degree_level" register={register} error={errors.degree_level} options={DEGREE_LEVELS} /></div>
                </div>
              </div>
            </div>

            <div className="saa-card mb-4">
              <div className="saa-card-header"><i className="bi bi-gear me-2"></i>Preferences</div>
              <div className="saa-card-body">
                <MultiSelect label="Preferred Countries" options={COUNTRIES.slice(0, 12)} selected={preferredCountries} onChange={setPreferredCountries} />
                <div className="row mt-3">
                  <div className="col-md-4"><FormInput label="Annual Budget (USD)" name="annual_budget_usd" register={register} error={errors.annual_budget_usd} type="number" placeholder="12000" /></div>
                  <div className="col-md-4"><FormInput label="IELTS Score" name="ielts_score" register={register} error={errors.ielts_score} type="number" step="0.5" placeholder="7.0" /></div>
                  <div className="col-md-4"><FormInput label="TOEFL Score" name="toefl_score" register={register} error={errors.toefl_score} type="number" placeholder="100" /></div>
                </div>
                <div className="row">
                  <div className="col-md-4"><FormSelect label="Target Intake" name="target_intake" register={register} error={errors.target_intake} options={INTAKE_SEASONS} /></div>
                  <div className="col-md-4"><FormSelect label="Ranking Preference" name="ranking_preference" register={register} error={errors.ranking_preference} options={RANKING_PREFERENCES} /></div>
                  <div className="col-md-4">
                    <div className="saa-form-group">
                      <label>Needs Scholarship?</label>
                      <div className="form-check form-switch mt-2">
                        <input className="form-check-input" type="checkbox" id="needs_scholarship" {...register('needs_scholarship')} />
                        <label className="form-check-label" htmlFor="needs_scholarship">Yes, I need financial aid</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button type="submit" loading={saving} className="px-5"><i className="bi bi-check-lg me-2"></i>Save Profile</Button>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}
