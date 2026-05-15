import { Link } from 'react-router-dom';

export default function NotFoundPage() {
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
        position: 'absolute', top: '-10%', left: '-5%',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(14,165,233,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
        animation: 'float 6s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute', bottom: '-15%', right: '-8%',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,166,35,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
        animation: 'float 8s ease-in-out infinite reverse'
      }} />

      <div style={{
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
        animation: 'scaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        <h1 style={{
          fontFamily: "'Clash Display', 'Segoe UI', system-ui, sans-serif",
          fontSize: '120px',
          fontWeight: 800,
          margin: 0,
          lineHeight: 1,
          background: 'linear-gradient(135deg, #F5A623 0%, #FFD166 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 8px 16px rgba(245,166,35,0.2))'
        }}>
          404
        </h1>
        
        <h2 style={{
          color: '#fff',
          fontFamily: "'Clash Display', 'Segoe UI', system-ui, sans-serif",
          fontSize: '2rem',
          fontWeight: 700,
          marginTop: '1rem',
          marginBottom: '0.5rem'
        }}>
          Oops! Page not found
        </h2>
        
        <p style={{
          color: 'var(--saa-text-muted)',
          fontSize: '1.125rem',
          maxWidth: '400px',
          margin: '0 auto 2rem',
          lineHeight: 1.6
        }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Link 
          to="/" 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'linear-gradient(135deg, #F5A623 0%, #D48B0E 100%)',
            color: 'var(--saa-navy)',
            padding: '0.875rem 2rem',
            borderRadius: 'var(--saa-radius-md)',
            fontWeight: 700,
            fontSize: '1rem',
            textDecoration: 'none',
            boxShadow: '0 8px 24px rgba(245,166,35,0.3)',
            transition: 'all 0.2s ease',
          }}
          className="hover-lift"
        >
          ← Go Home
        </Link>
      </div>
    </div>
  );
}
