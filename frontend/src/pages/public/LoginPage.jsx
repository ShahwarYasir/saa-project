import { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate } from 'react-router-dom';
import { loginSchema } from '../../utils/validators';
import { login } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';
import { ToastContext } from '../../context/ToastContext';
import FormInput from '../../components/forms/FormInput';
import Button from '../../components/common/Button';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();
  const toast = useContext(ToastContext);
  const { register, handleSubmit, formState: { errors }, setError } = useForm({ resolver: yupResolver(loginSchema) });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await login(data);
      authLogin(res.data.token, res.data.user);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      if (err.errors) Object.keys(err.errors).forEach(k => setError(k, { message: err.errors[k][0] }));
      else toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="saa-auth-page">
      <div className="saa-auth-card">
        <div className="text-center mb-2">
          <span style={{ background: 'var(--saa-gold)', color: 'var(--saa-navy-dark)', padding: '6px 16px', borderRadius: 'var(--saa-radius-md)', fontWeight: 800, fontSize: 'var(--saa-font-size-lg)' }}>SAA</span>
        </div>
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Sign in to continue your study abroad journey</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormInput label="Email Address" name="email" register={register} error={errors.email} type="email" placeholder="student@test.com" />
          <FormInput label="Password" name="password" register={register} error={errors.password} type="password" placeholder="••••••••" />

          <div className="form-check mb-4">
            <input className="form-check-input" type="checkbox" id="remember" />
            <label className="form-check-label" htmlFor="remember" style={{ fontSize: 'var(--saa-font-size-sm)' }}>Remember me</label>
          </div>

          <Button type="submit" loading={loading} className="w-100 mb-3">Sign In</Button>
        </form>

        <p className="text-center" style={{ fontSize: 'var(--saa-font-size-sm)', color: 'var(--saa-gray-500)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--saa-gold)', fontWeight: 600 }}>Create one</Link>
        </p>
        <p className="text-center mt-2" style={{ fontSize: 'var(--saa-font-size-xs)', color: 'var(--saa-gray-400)' }}>
          <Link to="/admin/login">Admin Login →</Link>
        </p>
      </div>
    </div>
  );
}
