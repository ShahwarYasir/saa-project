import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="saa-auth-page">
      <div className="text-center">
        <div style={{ fontSize: '8rem', fontWeight: 800, color: 'var(--saa-navy)', lineHeight: 1, opacity: 0.15 }}>404</div>
        <h2 className="mb-3">Page Not Found</h2>
        <p style={{ color: 'var(--saa-gray-500)', maxWidth: 400, margin: '0 auto var(--saa-space-6)' }}>The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn btn-saa-primary"><i className="bi bi-house me-2"></i>Back to Home</Link>
      </div>
    </div>
  );
}
