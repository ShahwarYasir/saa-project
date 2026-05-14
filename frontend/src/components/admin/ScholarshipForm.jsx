import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { scholarshipFormSchema } from '../../utils/validators';
import { COUNTRIES, COVERAGE_TYPES } from '../../utils/constants';
import FormInput from '../forms/FormInput';
import FormSelect from '../forms/FormSelect';
import FormTextarea from '../forms/FormTextarea';
import Button from '../common/Button';

export default function ScholarshipForm({ initial = null, onSubmit, loading = false }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(scholarshipFormSchema),
    defaultValues: initial || {}
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormInput label="Scholarship Name" name="name" register={register} error={errors.name} />
      <FormInput label="Provider" name="provider" register={register} error={errors.provider} />
      <div className="row">
        <div className="col-md-6"><FormSelect label="Funding Country" name="funding_country" register={register} error={errors.funding_country} options={COUNTRIES} /></div>
        <div className="col-md-6"><FormSelect label="Coverage Type" name="coverage" register={register} error={errors.coverage} options={COVERAGE_TYPES} /></div>
      </div>
      <FormInput label="Deadline" name="deadline" register={register} error={errors.deadline} type="date" />
      <FormTextarea label="Eligibility Summary" name="eligibility_summary" register={register} error={errors.eligibility_summary} rows={3} />
      <Button type="submit" loading={loading} className="w-100">{initial ? 'Update Scholarship' : 'Add Scholarship'}</Button>
    </form>
  );
}
