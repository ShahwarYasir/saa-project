export default function Footer() {
  return (
    <footer className="saa-footer">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4">
            <h6><span style={{ color: 'var(--saa-gold)' }}>SAA</span> Study Abroad Assistant</h6>
            <p style={{ fontSize: 'var(--saa-font-size-sm)' }}>Your gateway to global education. AI-powered university and scholarship guidance for international students.</p>
          </div>
          <div className="col-md-2 mb-4">
            <h6>Platform</h6>
            <ul className="list-unstyled" style={{ fontSize: 'var(--saa-font-size-sm)' }}>
              <li className="mb-2"><a href="/universities">Universities</a></li>
              <li className="mb-2"><a href="/scholarships">Scholarships</a></li>
              <li className="mb-2"><a href="/writing-assistant">Writing Assistant</a></li>
              <li className="mb-2"><a href="/templates">Templates</a></li>
            </ul>
          </div>
          <div className="col-md-3 mb-4">
            <h6>Resources</h6>
            <ul className="list-unstyled" style={{ fontSize: 'var(--saa-font-size-sm)' }}>
              <li className="mb-2"><a href="#">How It Works</a></li>
              <li className="mb-2"><a href="#">Country Guides</a></li>
              <li className="mb-2"><a href="#">FAQ</a></li>
            </ul>
          </div>
          <div className="col-md-3 mb-4">
            <h6>Contact</h6>
            <ul className="list-unstyled" style={{ fontSize: 'var(--saa-font-size-sm)' }}>
              <li className="mb-2"><i className="bi bi-envelope me-2"></i>support@saa.edu</li>
              <li className="mb-2"><i className="bi bi-geo-alt me-2"></i>Islamabad, Pakistan</li>
            </ul>
          </div>
        </div>
        <hr style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
        <div className="text-center" style={{ fontSize: 'var(--saa-font-size-xs)', opacity: 0.6 }}>
          © 2026 Study Abroad Assistant. Built by Hasana Zahid & Dur-e-Shahwar.
        </div>
      </div>
    </footer>
  );
}
