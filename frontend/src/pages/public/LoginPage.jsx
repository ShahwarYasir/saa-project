import { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate } from 'react-router-dom';
import { loginSchema } from '../../utils/validators';
import { login } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';
import { ToastContext } from '../../context/ToastContext';
import FormInput from '../../components/forms/FormInput';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

  /* Google G SVG */
  const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
      <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
    </svg>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {/* ── LEFT PANEL (Image) ── */}
      <div
        className="d-none d-lg-flex"
        style={{
          flex: '0 0 50%',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80"
          alt="Campus"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(10,22,40,0.75)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px',
          }}
        >
          {/* SAA Logo */}
          <span
            style={{
              background: 'var(--saa-gradient-gold)',
              color: 'var(--saa-navy)',
              padding: '8px 20px',
              borderRadius: '50px',
              fontWeight: 800,
              fontSize: '1rem',
              fontFamily: "'Clash Display', sans-serif",
              letterSpacing: '0.05em',
              marginBottom: '32px',
            }}
          >
            SAA
          </span>
          <h2
            style={{
              color: 'var(--saa-white)',
              fontFamily: "'Clash Display', sans-serif",
              fontSize: '2rem',
              textAlign: 'center',
              marginBottom: '32px',
              maxWidth: '400px',
              lineHeight: 1.3,
            }}
          >
            Start Your Global Education Journey
          </h2>
          <div style={{ maxWidth: '340px' }}>
            {[
              'Access 500+ universities worldwide',
              'AI-powered document writing',
              'Free scholarship matching',
            ].map((item, i) => (
              <div
                key={i}
                className="d-flex align-items-start gap-3"
                style={{ marginBottom: '16px', animation: `fadeInUp 0.4s ease ${0.2 + i * 0.15}s forwards`, opacity: 0, animationFillMode: 'forwards' }}
              >
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'rgba(16,185,129,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                >
                  <span style={{ color: '#10B981', fontSize: '0.75rem', fontWeight: 700 }}>✓</span>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9375rem' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL (Form) ── */}
      <div
        style={{
          flex: '1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--saa-white)',
          padding: '40px 24px',
        }}
      >
        <div style={{ width: '100%', maxWidth: '420px' }}>
          {/* Logo */}
          <div className="text-center mb-4">
            <span
              style={{
                background: 'var(--saa-gradient-gold)',
                color: 'var(--saa-navy)',
                padding: '8px 20px',
                borderRadius: '50px',
                fontWeight: 800,
                fontSize: '1rem',
                fontFamily: "'Clash Display', sans-serif",
                letterSpacing: '0.05em',
              }}
            >
              SAA
            </span>
          </div>

          <h3
            style={{
              textAlign: 'center',
              fontFamily: "'Clash Display', sans-serif",
              color: 'var(--saa-navy)',
              marginBottom: '8px',
              fontSize: '1.75rem',
            }}
          >
            Welcome Back
          </h3>
          <p style={{ textAlign: 'center', color: 'var(--saa-text-muted)', marginBottom: '32px', fontSize: '0.9375rem' }}>
            Sign in to continue your journey
          </p>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <div className="saa-form-group">
              <label htmlFor="email">Email Address</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--saa-text-muted)', fontSize: '0.875rem' }}>
                  <i className="bi bi-envelope"></i>
                </span>
                <input
                  id="email"
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="student@test.com"
                  style={{ paddingLeft: '40px' }}
                  {...register('email')}
                />
                {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
              </div>
            </div>

            {/* Password */}
            <div className="saa-form-group">
              <label htmlFor="password">Password</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--saa-text-muted)', fontSize: '0.875rem' }}>
                  <i className="bi bi-lock"></i>
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="••••••••"
                  style={{ paddingLeft: '40px', paddingRight: '44px' }}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--saa-text-muted)',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    padding: '2px',
                  }}
                  tabIndex={-1}
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
                {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="d-flex justify-content-between align-items-center" style={{ marginBottom: '24px' }}>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="remember" />
                <label className="form-check-label" htmlFor="remember" style={{ fontSize: '0.8125rem', color: 'var(--saa-text-muted)' }}>
                  Remember me
                </label>
              </div>
              <a href="#" style={{ fontSize: '0.8125rem', color: 'var(--saa-teal)', fontWeight: 500 }}>
                Forgot password?
              </a>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 'var(--saa-radius-sm)',
                background: 'var(--saa-gradient-gold)',
                color: 'var(--saa-navy)',
                fontWeight: 700,
                fontSize: '1rem',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: "'Clash Display', sans-serif",
                boxShadow: 'var(--saa-shadow-gold)',
                transition: 'var(--saa-transition)',
                marginBottom: '24px',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Signing in...</>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="d-flex align-items-center gap-3" style={{ marginBottom: '24px' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--saa-border)' }} />
            <span style={{ color: 'var(--saa-text-muted)', fontSize: '0.8125rem' }}>or continue with</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--saa-border)' }} />
          </div>

          {/* Google Button */}
          <button
            type="button"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 'var(--saa-radius-sm)',
              background: 'var(--saa-white)',
              color: 'var(--saa-text)',
              fontWeight: 600,
              fontSize: '0.9375rem',
              border: '1.5px solid var(--saa-border)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'var(--saa-transition)',
              marginBottom: '28px',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--saa-white)')}
          >
            <GoogleIcon />
            Continue with Google
          </button>

          {/* Bottom Link */}
          <p style={{ textAlign: 'center', fontSize: '0.9375rem', color: 'var(--saa-text-muted)', marginBottom: '12px' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--saa-gold)', fontWeight: 600 }}>
              Create one →
            </Link>
          </p>
          <p className="text-center" style={{ fontSize: '0.8125rem' }}>
            <Link to="/admin/login" style={{ color: 'var(--saa-text-muted)' }}>Admin Login →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
