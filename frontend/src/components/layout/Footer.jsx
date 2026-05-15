import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--saa-navy)', color: 'rgba(255,255,255,0.7)', padding: '80px 0 32px' }}>
      <div className="container">
        <div className="row g-4 mb-5">
          {/* Column 1: Brand */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <span
                style={{
                  background: 'var(--saa-gradient-gold)',
                  color: 'var(--saa-navy)',
                  padding: '6px 14px',
                  borderRadius: '50px',
                  fontWeight: 800,
                  fontSize: '0.75rem',
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
                  fontSize: '1rem',
                }}
              >
                Study Abroad Assistant
              </span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', lineHeight: 1.7, maxWidth: '300px', marginBottom: '20px' }}>
              Your AI-powered gateway to global education. Find the perfect university, secure scholarships, and navigate your application journey.
            </p>
            {/* Socials */}
            <div className="d-flex gap-3">
              {['twitter', 'linkedin', 'instagram', 'youtube'].map((social) => (
                <a
                  key={social}
                  href="#"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: '1px solid rgba(255,255,255,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '0.875rem',
                    transition: 'var(--saa-transition)',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--saa-gold)';
                    e.currentTarget.style.color = 'var(--saa-gold)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                  }}
                >
                  <i className={`bi bi-${social}`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6
              style={{
                color: 'var(--saa-white)',
                fontSize: '0.8125rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontFamily: "'Clash Display', sans-serif",
                marginBottom: '16px',
                fontWeight: 600,
              }}
            >
              Quick Links
            </h6>
            <ul className="list-unstyled" style={{ fontSize: '0.875rem' }}>
              {[
                { label: 'Home', to: '/' },
                { label: 'Universities', to: '/universities' },
                { label: 'Scholarships', to: '/scholarships' },
                { label: 'Dashboard', to: '/dashboard' },
              ].map((link) => (
                <li key={link.label} className="mb-2">
                  <Link
                    to={link.to}
                    style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'color 0.15s ease' }}
                    onMouseEnter={(e) => (e.target.style.color = 'var(--saa-gold)')}
                    onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.5)')}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6
              style={{
                color: 'var(--saa-white)',
                fontSize: '0.8125rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontFamily: "'Clash Display', sans-serif",
                marginBottom: '16px',
                fontWeight: 600,
              }}
            >
              Resources
            </h6>
            <ul className="list-unstyled" style={{ fontSize: '0.875rem' }}>
              {['How It Works', 'Writing Assistant', 'Templates', 'Country Guides', 'FAQ'].map((label) => (
                <li key={label} className="mb-2">
                  <a
                    href="#"
                    style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'color 0.15s ease' }}
                    onMouseEnter={(e) => (e.target.style.color = 'var(--saa-gold)')}
                    onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.5)')}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="col-lg-4 col-md-6">
            <h6
              style={{
                color: 'var(--saa-white)',
                fontSize: '0.8125rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontFamily: "'Clash Display', sans-serif",
                marginBottom: '16px',
                fontWeight: 600,
              }}
            >
              Contact
            </h6>
            <ul className="list-unstyled" style={{ fontSize: '0.875rem' }}>
              <li className="mb-3 d-flex align-items-center gap-2">
                <i className="bi bi-envelope" style={{ color: 'var(--saa-gold)', fontSize: '0.875rem' }}></i>
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>support@saa.edu</span>
              </li>
              <li className="mb-3 d-flex align-items-center gap-2">
                <i className="bi bi-geo-alt" style={{ color: 'var(--saa-gold)', fontSize: '0.875rem' }}></i>
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>Islamabad, Pakistan</span>
              </li>
              <li className="mb-3 d-flex align-items-center gap-2">
                <i className="bi bi-telephone" style={{ color: 'var(--saa-gold)', fontSize: '0.875rem' }}></i>
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>+92 51 123 4567</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '0 0 24px' }} />
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
          <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.4)' }}>
            © 2026 Study Abroad Assistant. All rights reserved.
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.4)' }}>
            Made with ❤️ for students
          </div>
        </div>
      </div>
    </footer>
  );
}
