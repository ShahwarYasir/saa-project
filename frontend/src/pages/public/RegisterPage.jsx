import { useState, useContext, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate } from 'react-router-dom';
import { registerSchema } from '../../utils/validators';
import { register as registerUser } from '../../services/authService';
import { ToastContext } from '../../context/ToastContext';
import FormInput from '../../components/forms/FormInput';

/* ─── Password Strength Calculator ─── */
function getPasswordStrength(password) {
  if (!password) return { level: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (password.length >= 12) score++;

  if (score <= 1) return { level: 1, label: 'Weak', color: '#EF4444' };
  if (score <= 3) return { level: 2, label: 'Medium', color: '#F59E0B' };
  return { level: 3, label: 'Strong', color: '#10B981' };
}

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();
  const toast = useContext(ToastContext);
  const { register, handleSubmit, formState: { errors }, setError, watch } = useForm({ resolver: yupResolver(registerSchema) });

  const passwordValue = watch('password', '');
  const strength = useMemo(() => getPasswordStrength(passwordValue), [passwordValue]);

  const onSubmit = async (data) => {
    if (!agreed) {
      toast.error('Please agree to the Terms & Privacy Policy');
      return;
    }
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
          src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80"
          alt="Library"
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
            Join 10,000+ Students Studying Abroad
          </h2>
          <div style={{ maxWidth: '340px' }}>
            {[
              'Free personalized university matching',
              'AI-powered SOP & cover letter writing',
              'Step-by-step application roadmap',
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
          overflowY: 'auto',
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
            Create Account
          </h3>
          <p style={{ textAlign: 'center', color: 'var(--saa-text-muted)', marginBottom: '32px', fontSize: '0.9375rem' }}>
            Start your journey to international education
          </p>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Full Name */}
            <div className="saa-form-group">
              <label htmlFor="full_name">Full Name</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--saa-text-muted)', fontSize: '0.875rem' }}>
                  <i className="bi bi-person"></i>
                </span>
                <input
                  id="full_name"
                  type="text"
                  className={`form-control ${errors.full_name ? 'is-invalid' : ''}`}
                  placeholder="Hasana Zahid"
                  style={{ paddingLeft: '40px' }}
                  {...register('full_name')}
                />
                {errors.full_name && <div className="invalid-feedback">{errors.full_name.message}</div>}
              </div>
            </div>

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
                  placeholder="you@example.com"
                  style={{ paddingLeft: '40px' }}
                  {...register('email')}
                />
                {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
              </div>
            </div>

            {/* Phone */}
            <div className="saa-form-group">
              <label htmlFor="phone">Phone Number</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--saa-text-muted)', fontSize: '0.875rem' }}>
                  <i className="bi bi-phone"></i>
                </span>
                <input
                  id="phone"
                  type="text"
                  className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                  placeholder="+92 300 1234567"
                  style={{ paddingLeft: '40px' }}
                  {...register('phone')}
                />
                {errors.phone && <div className="invalid-feedback">{errors.phone.message}</div>}
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
                  placeholder="Min 8 chars, 1 uppercase, 1 number, 1 special"
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
              {/* Password strength bar */}
              {passwordValue && (
                <div style={{ marginTop: '8px' }}>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                    {[1, 2, 3].map((lvl) => (
                      <div
                        key={lvl}
                        style={{
                          flex: 1,
                          height: '4px',
                          borderRadius: '2px',
                          background: strength.level >= lvl ? strength.color : '#E2E8F0',
                          transition: 'background 0.3s ease',
                        }}
                      />
                    ))}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: strength.color, fontWeight: 600 }}>
                    {strength.label}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="saa-form-group">
              <label htmlFor="password_confirmation">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--saa-text-muted)', fontSize: '0.875rem' }}>
                  <i className="bi bi-lock"></i>
                </span>
                <input
                  id="password_confirmation"
                  type={showConfirm ? 'text' : 'password'}
                  className={`form-control ${errors.password_confirmation ? 'is-invalid' : ''}`}
                  placeholder="Re-enter password"
                  style={{ paddingLeft: '40px', paddingRight: '44px' }}
                  {...register('password_confirmation')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
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
                  <i className={`bi ${showConfirm ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
                {errors.password_confirmation && <div className="invalid-feedback">{errors.password_confirmation.message}</div>}
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="form-check" style={{ marginBottom: '24px' }}>
              <input
                className="form-check-input"
                type="checkbox"
                id="terms"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="terms" style={{ fontSize: '0.8125rem', color: 'var(--saa-text-muted)' }}>
                I agree to the{' '}
                <a href="#" style={{ color: 'var(--saa-teal)', fontWeight: 500 }}>Terms</a>
                {' & '}
                <a href="#" style={{ color: 'var(--saa-teal)', fontWeight: 500 }}>Privacy Policy</a>
              </label>
            </div>

            {/* Create Account Button */}
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
                <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Creating Account...</>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Bottom Link */}
          <p style={{ textAlign: 'center', fontSize: '0.9375rem', color: 'var(--saa-text-muted)', marginBottom: 0 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--saa-gold)', fontWeight: 600 }}>
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
