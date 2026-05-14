import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup.string().email('Enter a valid email address').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required')
});

export const registerSchema = yup.object({
  full_name: yup.string().min(2, 'Name must be at least 2 characters').required('Full name is required'),
  email: yup.string().email('Enter a valid email address').required('Email is required'),
  phone: yup.string().matches(/^[+]?[\d\s()-]{7,15}$/, 'Enter a valid phone number').required('Phone number is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').matches(/[A-Z]/, 'Must contain at least one uppercase letter').matches(/[0-9]/, 'Must contain at least one number').matches(/[^A-Za-z0-9]/, 'Must contain at least one special character').required('Password is required'),
  password_confirmation: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Confirm your password')
});

export const profileSchema = yup.object({
  nationality: yup.string().required('Nationality is required'),
  current_country: yup.string().required('Current country is required'),
  current_qualification: yup.string().required('Current qualification is required'),
  gpa: yup.number().min(0, 'GPA cannot be negative').max(4, 'GPA cannot exceed 4.0').required('GPA is required').typeError('Enter a valid GPA'),
  field_of_interest: yup.string().required('Field of interest is required'),
  degree_level: yup.string().required('Target degree level is required'),
  annual_budget_usd: yup.number().min(0).typeError('Enter a valid amount').nullable(),
  ielts_score: yup.number().min(0).max(9).typeError('Enter a valid IELTS score').nullable(),
  toefl_score: yup.number().min(0).max(120).typeError('Enter a valid TOEFL score').nullable(),
  target_intake: yup.string().nullable()
});

export const universityFormSchema = yup.object({
  name: yup.string().required('University name is required'),
  country: yup.string().required('Country is required'),
  city: yup.string().required('City is required'),
  ranking: yup.number().min(1).typeError('Enter a valid ranking').required('Ranking is required'),
  tuition_fee_usd: yup.number().min(0).typeError('Enter a valid fee').required('Tuition fee is required'),
  gpa_requirement: yup.number().min(0).max(4).typeError('Enter a valid GPA').required('GPA requirement is required'),
  ielts_requirement: yup.number().min(0).max(9).typeError('Enter a valid score').required('IELTS requirement is required'),
  application_deadline: yup.string().required('Application deadline is required')
});

export const scholarshipFormSchema = yup.object({
  name: yup.string().required('Scholarship name is required'),
  provider: yup.string().required('Provider is required'),
  funding_country: yup.string().required('Funding country is required'),
  coverage: yup.string().required('Coverage type is required'),
  deadline: yup.string().required('Deadline is required')
});

export const writingContextSchema = yup.object({
  target_university: yup.string().required('Target university is required'),
  target_program: yup.string().required('Target program is required'),
  achievements: yup.string().required('Describe your achievements'),
  background: yup.string().required('Provide your background'),
  word_limit: yup.number().min(100).max(2000).typeError('Enter a valid word limit').required('Word limit is required')
});
