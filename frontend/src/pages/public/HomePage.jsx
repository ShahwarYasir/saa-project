import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../../components/layout/PublicNavbar';
import Footer from '../../components/layout/Footer';

/* ─── Animated Counter Hook ─── */
function useCountUp(target, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const numTarget = parseInt(target.replace(/[^0-9]/g, ''), 10);
          const animate = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * numTarget));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  const suffix = target.includes('+') ? '+' : target.includes('%') ? '%' : '';
  return { ref, display: count.toLocaleString() + suffix };
}

/* ─── Stat Item ─── */
function StatItem({ value, label }) {
  const { ref, display } = useCountUp(value);
  return (
    <div ref={ref} style={{ textAlign: 'center', flex: '1 1 0' }}>
      <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--saa-gold)', fontFamily: "'Clash Display', sans-serif" }}>
        {display}
      </div>
      <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>{label}</div>
    </div>
  );
}

/* ─── Features Data ─── */
const features = [
  { emoji: '🔍', title: 'University Search', desc: '500+ universities across 50 countries with advanced filters', color: '#0EA5E9' },
  { emoji: '🎓', title: 'Scholarship Finder', desc: 'Full & partial funding opportunities matched to your profile', color: '#10B981' },
  { emoji: '✍️', title: 'AI Writing Assistant', desc: 'SOP, personal statement, cover letter generation with AI', color: '#8B5CF6' },
  { emoji: '🗺️', title: 'Application Roadmap', desc: 'Never miss a deadline with smart milestone tracking', color: '#F59E0B' },
  { emoji: '👤', title: 'Profile Builder', desc: 'Smart profile that matches you to the right universities', color: '#EC4899' },
  { emoji: '📄', title: 'Expert Templates', desc: 'CV, SOP, motivation letter templates from successful students', color: '#06B6D4' },
];

/* ─── Countries Data ─── */
const countries = [
  { name: 'Germany', flag: '🇩🇪', unis: 85, img: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&q=80' },
  { name: 'Canada', flag: '🇨🇦', unis: 72, img: 'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=400&q=80' },
  { name: 'United Kingdom', flag: '🇬🇧', unis: 96, img: 'https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?w=400&q=80' },
  { name: 'United States', flag: '🇺🇸', unis: 120, img: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=400&q=80' },
  { name: 'Australia', flag: '🇦🇺', unis: 48, img: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=400&q=80' },
  { name: 'Turkey', flag: '🇹🇷', unis: 65, img: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400&q=80' },
];

/* ─── Steps Data ─── */
const steps = [
  { num: '01', title: 'Build Your Profile', desc: 'Fill in your academic details, test scores, and preferences', icon: 'bi-person-badge' },
  { num: '02', title: 'Discover Matches', desc: 'AI finds your best-fit universities and scholarships', icon: 'bi-search' },
  { num: '03', title: 'Prepare Documents', desc: 'Use our writing assistant & expert templates', icon: 'bi-file-earmark-text' },
  { num: '04', title: 'Apply with Confidence', desc: 'Track deadlines and milestones on your roadmap', icon: 'bi-rocket-takeoff' },
];

/* ─── Testimonials Data ─── */
const testimonials = [
  {
    text: 'Getting into TU Munich felt impossible until I found SAA. The roadmap feature kept me on track the whole time.',
    name: 'Fatima A.',
    uni: 'TU Munich 🇩🇪',
    initials: 'FA',
    color: '#8B5CF6',
  },
  {
    text: 'The AI writing assistant helped me write an SOP that actually sounded like me. Got a scholarship too!',
    name: 'Ahmed K.',
    uni: 'University of Toronto 🇨🇦',
    initials: 'AK',
    color: '#0EA5E9',
  },
  {
    text: "From zero knowledge to full admission in 4 months. SAA's step-by-step guidance made it possible.",
    name: 'Sara M.',
    uni: 'University of Edinburgh 🇬🇧',
    initials: 'SM',
    color: '#10B981',
  },
];

export default function HomePage() {
  return (
    <>
      <PublicNavbar />

      {/* ═══════ SECTION 1: HERO ═══════ */}
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          background: `url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1920&q=80') center/cover no-repeat`,
        }}
      >
        {/* Dark gradient overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'var(--saa-gradient-hero)',
            zIndex: 1,
          }}
        />
        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '120px 16px 80px' }}>
          {/* Badge */}
          <div style={{ animation: 'fadeInUp 0.6s ease forwards', opacity: 0, animationFillMode: 'forwards' }}>
            <span className="section-badge" style={{ background: 'rgba(245,166,35,0.12)', marginBottom: '24px' }}>
              🌍 Trusted by 10,000+ Students
            </span>
          </div>

          {/* H1 */}
          <h1
            style={{
              fontFamily: "'Clash Display', sans-serif",
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              fontWeight: 700,
              color: 'var(--saa-white)',
              lineHeight: 1.1,
              marginBottom: '24px',
              animation: 'fadeInUp 0.6s ease 0.15s forwards',
              opacity: 0,
              animationFillMode: 'forwards',
            }}
          >
            Find Your Dream<br />
            <span className="gradient-text">University Abroad</span>
          </h1>

          {/* Subtext */}
          <p
            style={{
              color: 'rgba(255,255,255,0.8)',
              maxWidth: '560px',
              margin: '0 auto 36px',
              fontSize: '1.125rem',
              lineHeight: 1.7,
              animation: 'fadeInUp 0.6s ease 0.3s forwards',
              opacity: 0,
              animationFillMode: 'forwards',
            }}
          >
            AI-powered guidance to help you find the perfect university, secure scholarships, and navigate your application journey — all in one place.
          </p>

          {/* Buttons */}
          <div
            className="d-flex flex-wrap justify-content-center gap-3"
            style={{ animation: 'fadeInUp 0.6s ease 0.45s forwards', opacity: 0, animationFillMode: 'forwards' }}
          >
            <Link
              to="/register"
              className="hover-lift"
              style={{
                padding: '14px 36px',
                borderRadius: 'var(--saa-radius-sm)',
                background: 'var(--saa-gradient-gold)',
                color: 'var(--saa-navy)',
                fontWeight: 700,
                fontSize: '1rem',
                textDecoration: 'none',
                fontFamily: "'Clash Display', sans-serif",
                boxShadow: 'var(--saa-shadow-gold)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              Start For Free <span style={{ fontSize: '1.1rem' }}>→</span>
            </Link>
            <a
              href="#how-it-works"
              className="glass-card hover-lift"
              style={{
                padding: '14px 36px',
                borderRadius: 'var(--saa-radius-sm)',
                color: 'var(--saa-white)',
                fontWeight: 600,
                fontSize: '1rem',
                textDecoration: 'none',
                fontFamily: "'Clash Display', sans-serif",
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Watch How It Works <span style={{ fontSize: '1.1rem' }}>▶</span>
            </a>
          </div>

          {/* Floating Stats Bar */}
          <div
            className="glass-card"
            style={{
              marginTop: '60px',
              padding: '28px 32px',
              borderRadius: 'var(--saa-radius-lg)',
              display: 'flex',
              justifyContent: 'center',
              gap: '0',
              maxWidth: '700px',
              margin: '60px auto 0',
              animation: 'fadeInUp 0.6s ease 0.6s forwards',
              opacity: 0,
              animationFillMode: 'forwards',
            }}
          >
            <StatItem value="10000+" label="Students" />
            <div style={{ width: '1px', background: 'rgba(255,255,255,0.15)', margin: '0 16px' }} />
            <StatItem value="500+" label="Universities" />
            <div style={{ width: '1px', background: 'rgba(255,255,255,0.15)', margin: '0 16px' }} />
            <StatItem value="50+" label="Countries" />
            <div style={{ width: '1px', background: 'rgba(255,255,255,0.15)', margin: '0 16px' }} />
            <StatItem value="95%" label="Success Rate" />
          </div>
        </div>
      </section>

      {/* ═══════ SECTION 2: HOW IT WORKS ═══════ */}
      <section id="how-it-works" style={{ padding: '100px 0', background: 'var(--saa-white)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-badge">Simple Process</span>
            <h2 style={{ color: 'var(--saa-navy)', marginBottom: '16px' }}>Your Journey in 4 Steps</h2>
          </div>
          <div className="row g-4 justify-content-center">
            {steps.map((step, i) => (
              <div key={i} className="col-12 col-sm-6 col-lg-3">
                <div
                  className="hover-lift text-center h-100"
                  style={{
                    background: 'var(--saa-white)',
                    border: '1px solid var(--saa-border)',
                    borderRadius: 'var(--saa-radius-lg)',
                    padding: '40px 24px 32px',
                    position: 'relative',
                  }}
                >
                  {/* Step number */}
                  <div
                    style={{
                      fontFamily: "'Clash Display', sans-serif",
                      fontSize: '3.5rem',
                      fontWeight: 700,
                      color: 'var(--saa-gold)',
                      opacity: 0.25,
                      lineHeight: 1,
                      marginBottom: '12px',
                    }}
                  >
                    {step.num}
                  </div>
                  {/* Icon */}
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: 'var(--saa-radius-md)',
                      background: 'rgba(245,166,35,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                      fontSize: '1.4rem',
                      color: 'var(--saa-gold)',
                    }}
                  >
                    <i className={`bi ${step.icon}`}></i>
                  </div>
                  <h5 style={{ color: 'var(--saa-navy)', marginBottom: '8px', fontSize: '1.1rem' }}>{step.title}</h5>
                  <p style={{ color: 'var(--saa-text-muted)', fontSize: '0.875rem', marginBottom: 0, lineHeight: 1.6 }}>
                    {step.desc}
                  </p>
                  {/* Connecting arrow (desktop only) */}
                  {i < 3 && (
                    <div
                      className="d-none d-lg-block"
                      style={{
                        position: 'absolute',
                        right: '-28px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--saa-gold)',
                        fontSize: '1.5rem',
                        opacity: 0.4,
                        zIndex: 5,
                      }}
                    >
                      →
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ SECTION 3: FEATURES ═══════ */}
      <section id="features" style={{ padding: '100px 0', background: 'var(--saa-bg)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-badge">Everything You Need</span>
            <h2 style={{ color: 'var(--saa-navy)', marginBottom: '16px' }}>One Platform, Complete Journey</h2>
          </div>
          <div className="row g-4">
            {features.map((f, i) => (
              <div key={i} className="col-md-6 col-lg-4">
                <div
                  className="hover-lift h-100"
                  style={{
                    background: 'var(--saa-white)',
                    borderRadius: 'var(--saa-radius-lg)',
                    padding: '32px 28px',
                    border: '1px solid var(--saa-border)',
                  }}
                >
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: 'var(--saa-radius-md)',
                      background: `${f.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      marginBottom: '20px',
                    }}
                  >
                    {f.emoji}
                  </div>
                  <h5 style={{ color: 'var(--saa-navy)', marginBottom: '8px', fontSize: '1.1rem' }}>{f.title}</h5>
                  <p style={{ color: 'var(--saa-text-muted)', fontSize: '0.875rem', marginBottom: 0, lineHeight: 1.6 }}>
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ SECTION 4: COUNTRIES ═══════ */}
      <section id="countries" style={{ padding: '100px 0', background: 'var(--saa-white)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-badge">Study Destinations</span>
            <h2 style={{ color: 'var(--saa-navy)', marginBottom: '16px' }}>Top Study Destinations</h2>
          </div>
          <div className="row g-4">
            {countries.map((c, i) => (
              <div key={i} className="col-6 col-md-4 col-lg-2">
                <div
                  className="hover-lift"
                  style={{
                    borderRadius: 'var(--saa-radius-lg)',
                    overflow: 'hidden',
                    position: 'relative',
                    height: '220px',
                    cursor: 'pointer',
                  }}
                >
                  <img
                    src={c.img}
                    alt={c.name}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, rgba(10,22,40,0.1) 0%, rgba(10,22,40,0.85) 100%)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      padding: '16px',
                    }}
                  >
                    <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{c.flag}</div>
                    <div style={{ color: 'var(--saa-white)', fontWeight: 600, fontSize: '0.9375rem', fontFamily: "'Clash Display', sans-serif" }}>
                      {c.name}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }}>
                      {c.unis} Universities
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ SECTION 5: TESTIMONIALS ═══════ */}
      <section style={{ padding: '100px 0', background: 'var(--saa-bg)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-badge">Student Stories</span>
            <h2 style={{ color: 'var(--saa-navy)', marginBottom: '16px' }}>Real Students, Real Results</h2>
          </div>
          <div className="row g-4">
            {testimonials.map((t, i) => (
              <div key={i} className="col-md-4">
                <div
                  className="hover-lift h-100"
                  style={{
                    background: 'var(--saa-white)',
                    borderRadius: 'var(--saa-radius-lg)',
                    padding: '32px 28px',
                    border: '1px solid var(--saa-border)',
                    position: 'relative',
                  }}
                >
                  {/* Quote icon */}
                  <div style={{ fontSize: '2.5rem', color: 'var(--saa-gold)', lineHeight: 1, marginBottom: '16px', opacity: 0.6 }}>
                    ❝
                  </div>
                  {/* Stars */}
                  <div style={{ marginBottom: '16px', color: '#F59E0B', fontSize: '0.875rem', letterSpacing: '2px' }}>
                    ★★★★★
                  </div>
                  {/* Text */}
                  <p style={{ color: 'var(--saa-text)', fontSize: '0.9375rem', lineHeight: 1.7, marginBottom: '24px', fontStyle: 'italic' }}>
                    "{t.text}"
                  </p>
                  {/* Avatar + Name */}
                  <div className="d-flex align-items-center gap-3">
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: t.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--saa-white)',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        fontFamily: "'Clash Display', sans-serif",
                      }}
                    >
                      {t.initials}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--saa-navy)', fontSize: '0.9375rem' }}>{t.name}</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--saa-text-muted)' }}>{t.uni}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ SECTION 6: CTA BANNER ═══════ */}
      <section
        style={{
          padding: '100px 0',
          background: 'var(--saa-gradient-primary)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Mesh overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 20% 30%, rgba(245,166,35,0.12) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(14,165,233,0.12) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div className="container text-center" style={{ position: 'relative', zIndex: 2 }}>
          <h2
            style={{
              color: 'var(--saa-white)',
              fontFamily: "'Clash Display', sans-serif",
              fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
              marginBottom: '16px',
            }}
          >
            Ready to Start Your Journey?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '500px', margin: '0 auto 36px', fontSize: '1.0625rem' }}>
            Join thousands of students who found their dream university with SAA
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <Link
              to="/register"
              className="hover-lift"
              style={{
                padding: '14px 36px',
                borderRadius: 'var(--saa-radius-sm)',
                background: 'var(--saa-gradient-gold)',
                color: 'var(--saa-navy)',
                fontWeight: 700,
                fontSize: '1rem',
                textDecoration: 'none',
                fontFamily: "'Clash Display', sans-serif",
                boxShadow: 'var(--saa-shadow-gold)',
              }}
            >
              Create Free Account
            </Link>
            <Link
              to="/universities"
              className="hover-lift glass-card"
              style={{
                padding: '14px 36px',
                borderRadius: 'var(--saa-radius-sm)',
                color: 'var(--saa-white)',
                fontWeight: 600,
                fontSize: '1rem',
                textDecoration: 'none',
                fontFamily: "'Clash Display', sans-serif",
              }}
            >
              View Universities
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════ SECTION 7: FOOTER ═══════ */}
      <Footer />
    </>
  );
}
