import { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { loginSchema } from '../../utils/validators';
import { adminLogin } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';
import { ToastContext } from '../../context/ToastContext';

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useContext(ToastContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(loginSchema) });

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
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #060D1E 0%, #0A1628 50%, #0D1A35 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative bg circles */}
      <div style={{
        position: 'absolute', top: '-10%', right: '-5%',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(239,68,68,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-15%', left: '-8%',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,166,35,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%',
        maxWidth: 400,
        background: '#fff',
        borderRadius: 'var(--saa-radius-xl)',
        boxShadow: '0 24px 80px rgba(0,0,0,0.45)',
        padding: '2.5rem 2.25rem',
        position: 'relative',
        animation: 'scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        {/* Shield icon */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
          <div style={{
            width: 72, height: 72,
            background: 'linear-gradient(135deg, #0A1628 0%, #1E3A5F 100%)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(10,22,40,0.35)',
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2L3 7V13C3 17.42 7.03 21.58 12 23C16.97 21.58 21 17.42 21 13V7L12 2Z"
                fill="none"
                stroke="#F5A623"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <path
                d="M9 12L11 14L15 10"
                stroke="#F5A623"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* SAA badge */}
        <div style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
          <span style={{
            display: 'inline-block',
            background: 'rgba(10,22,40,0.08)',
            color: 'var(--saa-navy)',
            border: '1px solid rgba(10,22,40,0.15)',
            borderRadius: '9999px',
            fontSize: '0.6875rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            padding: '3px 12px',
            textTransform: 'uppercase',
          }}>
            SAA
          </span>
        </div>

        <h3 style={{
          textAlign: 'center',
          color: 'var(--saa-navy)',
          fontFamily: "'Clash Display', 'Segoe UI', system-ui, sans-serif",
          fontWeight: 800,
          fontSize: '1.5rem',
          marginBottom: '0.375rem',
        }}>
          Admin Portal
        </h3>
        <p style={{
          textAlign: 'center',
          color: 'var(--saa-text-muted)',
          fontSize: '0.875rem',
          marginBottom: '1.75rem',
        }}>
          Authorized personnel only
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Email */}
          <div className="saa-form-group">
            <label htmlFor="admin-email">Admin Email</label>
            <input
              id="admin-email"
              type="email"
              className={`form-control${errors.email ? ' is-invalid' : ''}`}
              placeholder="admin@saa.local"
              {...register('email')}
            />
            {errors.email && (
              <div className="invalid-feedback d-block" style={{ fontSize: '0.75rem', color: 'var(--saa-danger)' }}>
                {errors.email.message}
              </div>
            )}
          </div>

          {/* Password */}
          <div className="saa-form-group">
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              className={`form-control${errors.password ? ' is-invalid' : ''}`}
              placeholder="••••••••"
              {...register('password')}
            />
            {errors.password && (
              <div className="invalid-feedback d-block" style={{ fontSize: '0.75rem', color: 'var(--saa-danger)' }}>
                {errors.password.message}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: loading
                ? '#94A3B8'
                : 'linear-gradient(135deg, #0A1628 0%, #1E3A5F 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--saa-radius-md)',
              padding: '0.75rem 1.5rem',
              fontWeight: 700,
              fontSize: '0.9375rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '0.5rem',
              boxShadow: loading ? 'none' : '0 4px 16px rgba(10,22,40,0.3)',
            }}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                Signing in…
              </>
            ) : (
              <>
                <i className="bi bi-shield-lock-fill" />
                Sign In to Admin
              </>
            )}
          </button>
        </form>

        {/* Disclaimer */}
        <p style={{
          textAlign: 'center',
          fontSize: '0.75rem',
          color: '#94A3B8',
          marginTop: '1.5rem',
          lineHeight: 1.6,
          marginBottom: 0,
        }}>
          <i className="bi bi-lock-fill" style={{ marginRight: 4 }} />
          This area is restricted to authorized SAA administrators
        </p>

        <p style={{ textAlign: 'center', marginTop: '1rem', marginBottom: 0 }}>
          <a href="/login" style={{
            fontSize: '0.8125rem',
            color: 'var(--saa-teal)',
            textDecoration: 'none',
          }}>
            ← Back to Student Login
          </a>
        </p>
      </div>
    </div>
  );
}
