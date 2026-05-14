import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { writingContextSchema } from '../../utils/validators';
import FormInput from '../forms/FormInput';
import FormTextarea from '../forms/FormTextarea';
import Button from '../common/Button';

export default function PromptContextForm({ onSubmit, loading = false }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(writingContextSchema), defaultValues: { word_limit: 500 } });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        <div className="col-md-6">
          <FormInput label="Target University" name="target_university" register={register} error={errors.target_university} placeholder="e.g. TU Munich" />
        </div>
        <div className="col-md-6">
          <FormInput label="Target Program" name="target_program" register={register} error={errors.target_program} placeholder="e.g. MSc Computer Science" />
        </div>
      </div>
      <FormTextarea label="Key Achievements" name="achievements" register={register} error={errors.achievements} placeholder="List your major achievements, projects, and skills..." rows={3} />
      <FormTextarea label="Background & Motivation" name="background" register={register} error={errors.background} placeholder="Describe your educational background and why you chose this field..." rows={3} />
      <FormInput label="Word Limit" name="word_limit" register={register} error={errors.word_limit} type="number" placeholder="500" />
      <Button type="submit" loading={loading} className="w-100 mt-2">
        <i className="bi bi-magic me-2"></i>Generate Document
      </Button>
    </form>
  );
}
