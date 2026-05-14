import { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { loginSchema } from '../../utils/validators';
import { adminLogin } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';
import { ToastContext } from '../../context/ToastContext';
import FormInput from '../../components/forms/FormInput';
import Button from '../../components/common/Button';

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useContext(ToastContext);
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(loginSchema) });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await adminLogin(data);
      login(res.data.token, res.data.user);
      toast.success('Admin login successful');
      navigate('/admin');
    } catch (err) {
      toast.error(err.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="saa-auth-page">
      <div className="saa-auth-card">
        <div className="text-center mb-3">
          <span style={{ background: 'var(--saa-navy)', color: 'white', padding: '6px 16px', borderRadius: 'var(--saa-radius-md)', fontWeight: 800, fontSize: 'var(--saa-font-size-sm)' }}>ADMIN</span>
        </div>
        <h2>Admin Panel</h2>
        <p className="auth-subtitle">Sign in to the administration dashboard</p>

        <div style={{ background: 'var(--saa-info-light)', padding: 'var(--saa-space-3)', borderRadius: 'var(--saa-radius-md)', fontSize: 'var(--saa-font-size-xs)', marginBottom: 'var(--saa-space-6)', color: '#1e40af' }}>
          <strong>Default credentials:</strong><br />
          Email: admin@saa.local<br />
          Password: Admin@12345
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormInput label="Admin Email" name="email" register={register} error={errors.email} type="email" placeholder="admin@saa.local" />
          <FormInput label="Password" name="password" register={register} error={errors.password} type="password" placeholder="••••••••" />
          <Button type="submit" loading={loading} className="w-100 mb-3">Sign In as Admin</Button>
        </form>

        <p className="text-center" style={{ fontSize: 'var(--saa-font-size-xs)', color: 'var(--saa-gray-400)' }}>
          <a href="/login">← Back to Student Login</a>
        </p>
      </div>
    </div>
  );
}
