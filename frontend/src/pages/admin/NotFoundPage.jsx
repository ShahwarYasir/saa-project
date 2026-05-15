import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #060D1E 0%, #0A1628 60%, #0D1A35 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Floating decorative circles */}
      <div style={{
        position: 'absolute', top: '8%', left: '5%',
        width: 320, height: 320, borderRadius: '50%',
        border: '1px solid rgba(245,166,35,0.08)',
        animation: 'float 6s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '15%', left: '8%',
        width: 180, height: 180, borderRadius: '50%',
        border: '1px solid rgba(245,166,35,0.12)',
        animation: 'float 8s ease-in-out infinite reverse',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', right: '6%',
        width: 400, height: 400, borderRadius: '50%',
        border: '1px solid rgba(14,165,233,0.07)',
        animation: 'float 7s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '18%', right: '10%',
        width: 220, height: 220, borderRadius: '50%',
        border: '1px solid rgba(14,165,233,0.1)',
        animation: 'float 9s ease-in-out infinite reverse',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,166,35,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1, animation: 'fadeInUp 0.6s ease both' }}>
        {/* 404 */}
        <div style={{
          fontSize: '9rem',
          fontFamily: "'Clash Display', 'Segoe UI', system-ui, sans-serif",
          fontWeight: 800,
          lineHeight: 1,
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, #F5A623 0%, #FFD166 50%, #F5A623 100%)',
          backgroundSize: '200% 100%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          animation: 'gradientShift 3s ease infinite',
          letterSpacing: '-0.04em',
        }}>
          404
        </div>

        {/* Icon */}
        <div style={{ marginBottom: '1.5rem' }}>
          <i className="bi bi-compass" style={{
            fontSize: '3rem',
            color: 'rgba(255,255,255,0.25)',
          }} />
        </div>

        <h2 style={{
          color: '#fff',
          fontFamily: "'Clash Display', 'Segoe UI', system-ui, sans-serif",
          fontSize: '2rem',
          fontWeight: 700,
          marginBottom: '1rem',
        }}>
          Oops! Page not found
        </h2>

        <p style={{
          color: 'rgba(255,255,255,0.55)',
          fontSize: '1.0625rem',
          maxWidth: 480,
          margin: '0 auto 2.5rem',
          lineHeight: 1.7,
        }}>
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>

        <button
          onClick={() => navigate('/')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.875rem 2rem',
            background: 'linear-gradient(135deg, #F5A623 0%, #D48B0E 100%)',
            color: 'var(--saa-navy)',
            border: 'none',
            borderRadius: 'var(--saa-radius-lg)',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(245,166,35,0.4)',
            transition: 'all 0.2s ease',
            fontFamily: "'Clash Display', 'Segoe UI', system-ui, sans-serif",
          }}
          onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(245,166,35,0.5)'; }}
          onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(245,166,35,0.4)'; }}
        >
          <i className="bi bi-arrow-left" />
          Go Home
        </button>

        <p style={{
          marginTop: '3rem',
          color: 'rgba(255,255,255,0.2)',
          fontSize: '0.8125rem',
        }}>
          Study Abroad Assistant &copy; 2026
        </p>
      </div>
    </div>
  );
}
