import { useParams, Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { mockUniversities } from '../../mocks/mockUniversities';
import { mockScholarships } from '../../mocks/mockScholarships';

const COUNTRY_FLAGS = {
  Germany: '🇩🇪', Canada: '🇨🇦', 'United Kingdom': '🇬🇧',
  'United States': '🇺🇸', Australia: '🇦🇺', Turkey: '🇹🇷', Netherlands: '🇳🇱',
};

const TIMELINE_STEPS = [
  { num: 1, title: 'Check Eligibility Requirements', desc: 'Review the official eligibility criteria, including GPA minimums, language scores, nationality requirements, and any work experience conditions.' },
  { num: 2, title: 'Prepare Required Documents', desc: 'Gather all required documents well in advance. Get official translations, notarizations, and certifications as needed.' },
  { num: 3, title: 'Create Online Application Account', desc: 'Register on the official application portal. Save your credentials securely and familiarise yourself with the portal layout.' },
  { num: 4, title: 'Submit Application & Pay Fee', desc: 'Complete all required sections of the application form. Attach documents, pay any applicable application fee, and submit before the deadline.' },
  { num: 5, title: 'Track Application Status', desc: 'Monitor your application status through the portal. Respond promptly to any additional document requests or interview invitations.' },
];

const DOCUMENTS = [
  { icon: '📄', label: 'Academic Transcripts' },
  { icon: '📝', label: 'Personal Statement / SOP' },
  { icon: '🌐', label: 'Language Test Results' },
  { icon: '📷', label: 'Passport Copy' },
  { icon: '📬', label: 'Reference Letters' },
  { icon: '💰', label: 'Financial Proof' },
];

const TIPS_DO = [
  'Start your application at least 3 months early',
  'Tailor your SOP for each university',
  'Get your documents notarised and translated',
  'Request reference letters 6–8 weeks in advance',
  'Keep copies of all submitted documents',
];

const TIPS_DONT = [
  'Do not miss the application deadline',
  "Do not copy someone else's SOP or essays",
  'Do not provide false or exaggerated information',
  'Do not ignore follow-up emails from the university',
  'Do not wait until the last minute to gather documents',
];

export default function HowToApplyPage() {
  const { type, id } = useParams();
  const numId = parseInt(id, 10);

  const item = type === 'university'
    ? mockUniversities.find(u => u.id === numId)
    : mockScholarships.find(s => s.id === numId);

  const flag = item ? (COUNTRY_FLAGS[item.country || item.funding_country] || '🌍') : '';
  const name = item?.name || 'Item Not Found';
  const country = item?.country || item?.funding_country || '';
  const link = item?.website || item?.link || '#';

  const dates = type === 'university'
    ? [
        { label: 'Application Deadline', date: item?.application_deadline, color: 'var(--saa-danger)' },
        { label: 'Document Deadline', date: item?.application_deadline ? new Date(new Date(item.application_deadline).getTime() - 7*24*60*60*1000).toISOString().slice(0,10) : 'N/A', color: 'var(--saa-warning)' },
        { label: 'Result Announcement', date: item?.application_deadline ? new Date(new Date(item.application_deadline).getTime() + 60*24*60*60*1000).toISOString().slice(0,10) : 'N/A', color: 'var(--saa-success)' },
      ]
    : [
        { label: 'Application Deadline', date: item?.deadline, color: 'var(--saa-danger)' },
        { label: 'Document Deadline', date: item?.deadline ? new Date(new Date(item.deadline).getTime() - 7*24*60*60*1000).toISOString().slice(0,10) : 'N/A', color: 'var(--saa-warning)' },
        { label: 'Result Announcement', date: item?.deadline ? new Date(new Date(item.deadline).getTime() + 60*24*60*60*1000).toISOString().slice(0,10) : 'N/A', color: 'var(--saa-success)' },
      ];

  const navigate = useNavigate();

  return (
    <DashboardLayout pageTitle="How to Apply">
      <button onClick={() => navigate(-1)} style={{
        background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 10, padding: '8px 16px', fontSize: 14, fontWeight: 600, color: '#1E293B', marginBottom: 16, cursor: 'pointer'
      }} onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--saa-gold, #F5A623)'; e.currentTarget.style.color = 'var(--saa-gold, #F5A623)'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.color = '#1E293B'; }}>
        ← Back
      </button>
      {!item ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--saa-text-muted)' }}>
          <div style={{ fontSize: 64 }}>🔍</div>
          <h4>Item not found</h4>
          <Link to="/universities" style={{ color: 'var(--saa-teal)' }}>← Back to Universities</Link>
        </div>
      ) : (
        <>
          {/* Hero */}
          <div style={{ background: 'var(--saa-gradient-primary)', borderRadius: 'var(--saa-radius-xl)', padding: '2.5rem', marginBottom: 32, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'radial-gradient(circle,#fff 1px,transparent 1px)', backgroundSize: '24px 24px', pointerEvents: 'none' }} />
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 8, position: 'relative' }}>
              {flag} {country} &nbsp;·&nbsp; Application Guide
            </div>
            <h1 style={{ color: '#fff', fontWeight: 800, fontSize: 'clamp(1.4rem,4vw,2.2rem)', margin: 0, position: 'relative' }}>{name}</h1>
            {type === 'university' && item.ranking && (
              <div style={{ display: 'inline-block', marginTop: 12, background: 'var(--saa-gradient-gold)', borderRadius: 99, padding: '4px 16px', fontSize: 13, fontWeight: 700, color: 'var(--saa-navy)', position: 'relative' }}>
                Ranked #{item.ranking} globally
              </div>
            )}
            {type === 'scholarship' && (
              <div style={{ display: 'inline-block', marginTop: 12, background: 'var(--saa-gradient-gold)', borderRadius: 99, padding: '4px 16px', fontSize: 13, fontWeight: 700, color: 'var(--saa-navy)', position: 'relative' }}>
                {item.coverage}
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="saa-card" style={{ padding: '2rem', marginBottom: 24 }}>
            <h4 style={{ fontWeight: 700, color: 'var(--saa-navy)', marginBottom: 28 }}>Application Timeline</h4>
            <div style={{ position: 'relative' }}>
              {TIMELINE_STEPS.map((s, i) => (
                <div key={s.num} style={{ display: 'flex', gap: 20, marginBottom: i < TIMELINE_STEPS.length - 1 ? 0 : 0, position: 'relative' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--saa-gradient-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 15, color: 'var(--saa-navy)', flexShrink: 0, zIndex: 1 }}>
                      {s.num}
                    </div>
                    {i < TIMELINE_STEPS.length - 1 && (
                      <div style={{ width: 2, flex: 1, background: 'var(--saa-border)', marginTop: 4, marginBottom: 0, minHeight: 32 }} />
                    )}
                  </div>
                  <div style={{ paddingBottom: 28 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--saa-navy)', marginBottom: 4 }}>{s.title}</div>
                    <div style={{ fontSize: 13, color: 'var(--saa-text-muted)', lineHeight: 1.6 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Documents */}
          <div className="saa-card" style={{ padding: '2rem', marginBottom: 24 }}>
            <h4 style={{ fontWeight: 700, color: 'var(--saa-navy)', marginBottom: 20 }}>Required Documents</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12 }}>
              {DOCUMENTS.map(d => (
                <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0.75rem 1rem', background: '#F8FAFC', borderRadius: 10, border: '1.5px solid var(--saa-border)' }}>
                  <span style={{ fontSize: 20 }}>{d.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--saa-text)' }}>{d.label}</span>
                  <i className="bi bi-check-circle-fill" style={{ color: 'var(--saa-success)', marginLeft: 'auto', fontSize: 14 }} />
                </div>
              ))}
            </div>
          </div>

          {/* Important Dates */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16, marginBottom: 24 }}>
            {dates.map(d => (
              <div key={d.label} className="saa-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                <i className="bi bi-calendar3" style={{ fontSize: 28, color: d.color, marginBottom: 10, display: 'block' }} />
                <div style={{ fontWeight: 600, fontSize: 12, color: 'var(--saa-text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>{d.label}</div>
                <div style={{ fontWeight: 800, fontSize: 16, color: d.color }}>{d.date || 'TBA'}</div>
              </div>
            ))}
          </div>

          {/* Tips */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
            <div className="saa-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--saa-success)' }}>
              <h5 style={{ fontWeight: 700, color: 'var(--saa-success)', marginBottom: 14 }}>✅ Do's</h5>
              {TIPS_DO.map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 10 }}>
                  <i className="bi bi-check-circle-fill" style={{ color: 'var(--saa-success)', fontSize: 13, marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: 'var(--saa-text)', lineHeight: 1.5 }}>{t}</span>
                </div>
              ))}
            </div>
            <div className="saa-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--saa-danger)' }}>
              <h5 style={{ fontWeight: 700, color: 'var(--saa-danger)', marginBottom: 14 }}>❌ Don'ts</h5>
              {TIPS_DONT.map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 10 }}>
                  <i className="bi bi-x-circle-fill" style={{ color: 'var(--saa-danger)', fontSize: 13, marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: 'var(--saa-text)', lineHeight: 1.5 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <a href={link} target="_blank" rel="noopener noreferrer" style={{ display: 'block', textAlign: 'center', width: '100%', padding: '1rem', background: 'var(--saa-gradient-gold)', color: 'var(--saa-navy)', fontWeight: 800, fontSize: 16, borderRadius: 14, textDecoration: 'none', boxShadow: 'var(--saa-shadow-gold)' }}>
            Visit Official Portal ↗
          </a>
        </>
      )}
    </DashboardLayout>
  );
}
