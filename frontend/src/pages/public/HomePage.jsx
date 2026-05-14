import { Link } from 'react-router-dom';
import PublicNavbar from '../../components/layout/PublicNavbar';
import Footer from '../../components/layout/Footer';

const features = [
  { icon: 'bi-building', title: 'University Matching', desc: 'Get AI-powered university recommendations based on your GPA, budget, and preferences.' },
  { icon: 'bi-award-fill', title: 'Scholarship Finder', desc: 'Discover fully funded scholarships matched to your profile and eligibility.' },
  { icon: 'bi-pen-fill', title: 'AI Writing Assistant', desc: 'Generate SOPs, personal statements, and motivation letters with AI guidance.' },
  { icon: 'bi-map-fill', title: 'Application Roadmap', desc: 'Track your application journey with smart milestones and deadline reminders.' }
];

export default function HomePage() {
  return (
    <>
      <PublicNavbar />
      <section className="saa-hero">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <h1 style={{ animation: 'slideUp 0.6s ease forwards' }}>Your Gateway to<br /><span style={{ color: 'var(--saa-gold)' }}>Global Education</span></h1>
              <p className="mb-4" style={{ animation: 'slideUp 0.6s ease 0.15s forwards', opacity: 0, animationFillMode: 'forwards' }}>
                AI-powered university recommendations, scholarship matching, and application guidance — all in one platform.
              </p>
              <div className="d-flex gap-3 flex-wrap" style={{ animation: 'slideUp 0.6s ease 0.3s forwards', opacity: 0, animationFillMode: 'forwards' }}>
                <Link to="/register" className="btn btn-saa-gold btn-lg"><i className="bi bi-rocket-takeoff me-2"></i>Get Started Free</Link>
                <Link to="/login" className="btn btn-outline-light btn-lg">Sign In</Link>
              </div>
            </div>
            <div className="col-lg-5 d-none d-lg-flex justify-content-center" style={{ animation: 'fadeIn 1s ease 0.5s forwards', opacity: 0, animationFillMode: 'forwards' }}>
              <div style={{ fontSize: '10rem', opacity: 0.15 }}>🎓</div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: 'var(--saa-space-20) 0' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2>Everything You Need to Study Abroad</h2>
            <p style={{ color: 'var(--saa-gray-500)', maxWidth: 600, margin: '0 auto' }}>Our AI-powered platform guides you through every step of your international education journey.</p>
          </div>
          <div className="row g-4">
            {features.map((f, i) => (
              <div key={i} className="col-md-6 col-lg-3">
                <div className="saa-feature-card h-100" style={{ animation: `slideUp 0.5s ease ${0.1 * i}s forwards`, opacity: 0, animationFillMode: 'forwards' }}>
                  <div className="feature-icon"><i className={`bi ${f.icon}`}></i></div>
                  <h5>{f.title}</h5>
                  <p style={{ color: 'var(--saa-gray-500)', fontSize: 'var(--saa-font-size-sm)' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--saa-navy-50)', padding: 'var(--saa-space-16) 0' }}>
        <div className="container text-center">
          <h3 className="mb-3">Ready to Start Your Journey?</h3>
          <p style={{ color: 'var(--saa-gray-500)', marginBottom: 'var(--saa-space-6)' }}>Join thousands of students who found their dream university and scholarship.</p>
          <Link to="/register" className="btn btn-saa-primary btn-lg"><i className="bi bi-person-plus me-2"></i>Create Free Account</Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
