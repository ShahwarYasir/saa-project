import { Link, useLocation } from 'react-router-dom';

export default function PublicNavbar() {
  const location = useLocation();
  return (
    <nav className="saa-public-navbar">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          <Link to="/" className="navbar-brand">
            <span style={{ background: 'var(--saa-gold)', color: 'var(--saa-navy-dark)', padding: '4px 10px', borderRadius: 'var(--saa-radius-md)', fontWeight: 800, fontSize: 'var(--saa-font-size-sm)', marginRight: '8px' }}>SAA</span>
            Study Abroad Assistant
          </Link>
          <div className="d-flex align-items-center gap-2">
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
            <Link to="/login" className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}>Login</Link>
            <Link to="/register" className="btn btn-saa-gold btn-sm">Get Started</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
