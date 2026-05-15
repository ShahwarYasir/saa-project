import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function PublicNavbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = location.pathname === '/';

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Universities', to: isHome ? '#countries' : '/#countries' },
    { label: 'Scholarships', to: isHome ? '#features' : '/#features' },
    { label: 'How It Works', to: isHome ? '#how-it-works' : '/#how-it-works' },
  ];

  return (
    <nav
      className={`saa-public-navbar ${scrolled ? 'scrolled' : ''}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1030,
        padding: scrolled ? '10px 0' : '16px 0',
        background: scrolled ? 'rgba(10,22,40,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        transition: 'var(--saa-transition)',
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.15)' : 'none',
      }}
    >
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          {/* Logo */}
          <Link to="/" className="text-decoration-none d-flex align-items-center gap-2">
            <span
              style={{
                background: 'var(--saa-gradient-gold)',
                color: 'var(--saa-navy)',
                padding: '6px 14px',
                borderRadius: '50px',
                fontWeight: 800,
                fontSize: '0.8125rem',
                fontFamily: "'Clash Display', sans-serif",
                letterSpacing: '0.05em',
              }}
            >
              SAA
            </span>
            <span
              style={{
                color: 'var(--saa-white)',
                fontFamily: "'Clash Display', sans-serif",
                fontWeight: 600,
                fontSize: '1.0625rem',
                letterSpacing: '-0.02em',
              }}
              className="d-none d-md-inline"
            >
              Study Abroad Assistant
            </span>
          </Link>

          {/* Center Nav Links - Desktop */}
          <div className="d-none d-lg-flex align-items-center gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.to.startsWith('#') ? link.to : undefined}
                onClick={(e) => {
                  if (link.to.startsWith('#')) {
                    e.preventDefault();
                    const el = document.querySelector(link.to);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                style={{
                  color: 'rgba(255,255,255,0.8)',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  transition: 'color 0.15s ease',
                  position: 'relative',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => (e.target.style.color = '#FFFFFF')}
                onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.8)')}
              >
                {link.to.startsWith('#') || link.to.startsWith('/#') ? (
                  link.label
                ) : (
                  <Link to={link.to} style={{ color: 'inherit', textDecoration: 'none' }}>
                    {link.label}
                  </Link>
                )}
              </a>
            ))}
          </div>

          {/* Right Actions - Desktop */}
          <div className="d-none d-lg-flex align-items-center gap-3">
            <Link
              to="/login"
              style={{
                padding: '8px 22px',
                borderRadius: 'var(--saa-radius-sm)',
                color: 'var(--saa-white)',
                border: '1.5px solid rgba(255,255,255,0.3)',
                background: 'transparent',
                fontSize: '0.875rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'var(--saa-transition)',
                fontFamily: "'Clash Display', sans-serif",
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#FFFFFF';
                e.target.style.background = 'rgba(255,255,255,0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = 'rgba(255,255,255,0.3)';
                e.target.style.background = 'transparent';
              }}
            >
              Login
            </Link>
            <Link
              to="/register"
              style={{
                padding: '8px 22px',
                borderRadius: 'var(--saa-radius-sm)',
                background: 'var(--saa-gradient-gold)',
                color: 'var(--saa-navy)',
                border: 'none',
                fontSize: '0.875rem',
                fontWeight: 700,
                textDecoration: 'none',
                transition: 'var(--saa-transition)',
                fontFamily: "'Clash Display', sans-serif",
                boxShadow: '0 2px 12px rgba(245,166,35,0.3)',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 20px rgba(245,166,35,0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 12px rgba(245,166,35,0.3)';
              }}
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="d-lg-none"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--saa-white)',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '0.5rem',
            }}
            aria-label="Toggle navigation"
          >
            <i className={`bi ${mobileOpen ? 'bi-x-lg' : 'bi-list'}`}></i>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div
            className="d-lg-none"
            style={{
              marginTop: '1rem',
              padding: '1.5rem',
              background: 'rgba(10,22,40,0.98)',
              borderRadius: 'var(--saa-radius-md)',
              animation: 'slideDown 0.2s ease',
            }}
          >
            <div className="d-flex flex-column gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.to.startsWith('#') ? link.to : undefined}
                  onClick={(e) => {
                    if (link.to.startsWith('#')) {
                      e.preventDefault();
                      const el = document.querySelector(link.to);
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }
                    setMobileOpen(false);
                  }}
                  style={{
                    color: 'rgba(255,255,255,0.8)',
                    fontWeight: 500,
                    fontSize: '1rem',
                    textDecoration: 'none',
                    padding: '8px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  {link.to.startsWith('#') || link.to.startsWith('/#') ? (
                    link.label
                  ) : (
                    <Link
                      to={link.to}
                      style={{ color: 'inherit', textDecoration: 'none' }}
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  )}
                </a>
              ))}
              <div className="d-flex flex-column gap-2 mt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    padding: '10px',
                    borderRadius: 'var(--saa-radius-sm)',
                    color: 'var(--saa-white)',
                    border: '1.5px solid rgba(255,255,255,0.3)',
                    background: 'transparent',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    textAlign: 'center',
                  }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    padding: '10px',
                    borderRadius: 'var(--saa-radius-sm)',
                    background: 'var(--saa-gradient-gold)',
                    color: 'var(--saa-navy)',
                    border: 'none',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    textAlign: 'center',
                  }}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
