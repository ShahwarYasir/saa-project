import { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate } from 'react-router-dom';
import { registerSchema } from '../../utils/validators';
import { register as registerUser } from '../../services/authService';
import { ToastContext } from '../../context/ToastContext';
import FormInput from '../../components/forms/FormInput';
import Button from '../../components/common/Button';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useContext(ToastContext);
  const { register, handleSubmit, formState: { errors }, setError } = useForm({ resolver: yupResolver(registerSchema) });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerUser(data);
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err) {
      if (err.errors) Object.keys(err.errors).forEach(k => setError(k, { message: err.errors[k][0] }));
      else toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="saa-auth-page">
      <div className="saa-auth-card" style={{ maxWidth: 520 }}>
        <div className="text-center mb-2">
          <span style={{ background: 'var(--saa-gold)', color: 'var(--saa-navy-dark)', padding: '6px 16px', borderRadius: 'var(--saa-radius-md)', fontWeight: 800, fontSize: 'var(--saa-font-size-lg)' }}>SAA</span>
        </div>
        <h2>Create Account</h2>
        <p className="auth-subtitle">Start your journey to international education</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormInput label="Full Name" name="full_name" register={register} error={errors.full_name} placeholder="Hasana Zahid" />
          <FormInput label="Email Address" name="email" register={register} error={errors.email} type="email" placeholder="you@example.com" />
          <FormInput label="Phone Number" name="phone" register={register} error={errors.phone} placeholder="+92 300 1234567" />
          <FormInput label="Password" name="password" register={register} error={errors.password} type="password" placeholder="Min 8 chars, 1 uppercase, 1 number, 1 special" />
          <FormInput label="Confirm Password" name="password_confirmation" register={register} error={errors.password_confirmation} type="password" placeholder="Re-enter password" />

          <Button type="submit" loading={loading} className="w-100 mb-3 mt-2">Create Account</Button>
        </form>

        <p className="text-center" style={{ fontSize: 'var(--saa-font-size-sm)', color: 'var(--saa-gray-500)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--saa-gold)', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
