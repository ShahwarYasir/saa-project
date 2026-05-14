import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { universityFormSchema } from '../../utils/validators';
import { COUNTRIES, DEGREE_LEVELS } from '../../utils/constants';
import FormInput from '../forms/FormInput';
import FormSelect from '../forms/FormSelect';
import Button from '../common/Button';

export default function UniversityForm({ initial = null, onSubmit, loading = false }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(universityFormSchema),
    defaultValues: initial || {}
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormInput label="University Name" name="name" register={register} error={errors.name} />
      <div className="row">
        <div className="col-md-6"><FormSelect label="Country" name="country" register={register} error={errors.country} options={COUNTRIES} /></div>
        <div className="col-md-6"><FormInput label="City" name="city" register={register} error={errors.city} /></div>
      </div>
      <div className="row">
        <div className="col-md-4"><FormInput label="Ranking" name="ranking" register={register} error={errors.ranking} type="number" /></div>
        <div className="col-md-4"><FormInput label="Tuition (USD)" name="tuition_fee_usd" register={register} error={errors.tuition_fee_usd} type="number" /></div>
        <div className="col-md-4"><FormInput label="GPA Requirement" name="gpa_requirement" register={register} error={errors.gpa_requirement} type="number" step="0.1" /></div>
      </div>
      <div className="row">
        <div className="col-md-6"><FormInput label="IELTS Requirement" name="ielts_requirement" register={register} error={errors.ielts_requirement} type="number" step="0.5" /></div>
        <div className="col-md-6"><FormInput label="Application Deadline" name="application_deadline" register={register} error={errors.application_deadline} type="date" /></div>
      </div>
      <Button type="submit" loading={loading} className="w-100">{initial ? 'Update University' : 'Add University'}</Button>
    </form>
  );
}
