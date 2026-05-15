import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../hooks/useAuth';
import { useApi } from '../../hooks/useApi';
import { useProfileCompletion } from '../../hooks/useProfileCompletion';
import { getDashboard, getProfile } from '../../services/profileService';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function todayLabel() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function Shimmer({ h = 20, r = 8 }) {
  return (
    <div style={{
      height: h, borderRadius: r,
      background: 'linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%)',
      backgroundSize: '400% 100%', animation: 'shimmer 1.4s infinite',
    }} />
  );
}

function ProgressRing({ pct = 0, size = 140 }) {
  const r = (size - 20) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <defs>
        <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F5A623" /><stop offset="100%" stopColor="#FFD166" />
        </linearGradient>
      </defs>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={10} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="url(#rg)" strokeWidth={10}
        strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 1s ease' }} />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central"
        style={{ transform: 'rotate(90deg)', transformOrigin: 'center', fill: '#fff', fontWeight: 700, fontSize: 24 }}>
        {pct}%
      </text>
    </svg>
  );
}

function StatCard({ icon, label, value, trend, bg }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let i = 0; const target = Number(value) || 0; const step = Math.max(1, Math.ceil(target / 25));
    const t = setInterval(() => { i = Math.min(i + step, target); setN(i); if (i >= target) clearInterval(t); }, 40);
    return () => clearInterval(t);
  }, [value]);
  return (
    <div className="saa-card" style={{ flex: '1 1 150px', padding: '1.5rem' }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, fontSize: 22 }}>{icon}</div>
      <div style={{ fontSize: 30, fontWeight: 800, color: 'var(--saa-navy)', lineHeight: 1 }}>
        {label === 'Profile Score' ? `${n}%` : n}
      </div>
      <div style={{ fontSize: 13, color: 'var(--saa-text-muted)', marginTop: 4 }}>{label}</div>
      {trend && <div style={{ fontSize: 11, color: 'var(--saa-success)', marginTop: 4, fontWeight: 600 }}>{trend}</div>}
    </div>
  );
}

function QuickAction({ icon, label, sub, to, color }) {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate(to)} style={{
      flex: '1 1 150px', background: '#fff', border: '1.5px solid var(--saa-border)',
      borderRadius: 'var(--saa-radius-md)', padding: '1.5rem', cursor: 'pointer', textAlign: 'left',
      transition: 'var(--saa-transition)', boxShadow: 'var(--saa-shadow-sm)',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--saa-shadow-md)'; e.currentTarget.style.borderColor = color; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'var(--saa-shadow-sm)'; e.currentTarget.style.borderColor = 'var(--saa-border)'; }}
    >
      <div style={{ fontSize: 30, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--saa-navy)' }}>{label}</div>
      <div style={{ fontSize: 12, color: 'var(--saa-text-muted)', marginTop: 2 }}>{sub}</div>
      <div style={{ marginTop: 10, color, fontWeight: 600, fontSize: 13 }}>Open →</div>
    </button>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: dashData, loading: dashLoading } = useApi(getDashboard);
  const { data: profileData, loading: profileLoading } = useApi(getProfile);
  const profile = profileData?.data || null;
  const dash = dashData?.data || null;
  const { percentage: profilePct } = useProfileCompletion(profile);
  const loading = dashLoading || profileLoading;

  return (
    <DashboardLayout pageTitle="Dashboard">
      <style>{`@keyframes shimmer{0%{background-position:100% 0}100%{background-position:-100% 0}}`}</style>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Shimmer h={180} r={16} /><Shimmer h={120} r={12} /><Shimmer h={200} r={12} />
        </div>
      ) : (
        <>
          {/* Welcome Banner */}
          <div style={{
            background: 'var(--saa-gradient-primary)', borderRadius: 'var(--saa-radius-xl)',
            padding: '2rem 2.5rem', marginBottom: 24, display: 'flex',
            alignItems: 'center', justifyContent: 'space-between', gap: 24, position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', inset: 0, opacity: 0.04, pointerEvents: 'none',
              backgroundImage: 'radial-gradient(circle,#fff 1px,transparent 1px)',
              backgroundSize: '24px 24px',
            }} />
            <div style={{ flex: 1, position: 'relative' }}>
              <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 'clamp(1.3rem,3vw,1.9rem)', margin: 0 }}>
                {getGreeting()}, {user?.full_name?.split(' ')[0] || 'Student'} 👋
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.55)', margin: '6px 0 20px', fontSize: 13 }}>{todayLabel()}</p>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 8 }}>
                Profile is <strong style={{ color: 'var(--saa-gold)' }}>{profilePct}%</strong> complete
              </div>
              <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 99, height: 8, maxWidth: 320 }}>
                <div style={{ height: '100%', borderRadius: 99, width: `${profilePct}%`, background: 'var(--saa-gradient-gold)', transition: 'width 1s ease' }} />
              </div>
            </div>
            <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <ProgressRing pct={profilePct} size={130} />
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 4 }}>Profile Score</div>
            </div>
          </div>

          {/* Profile Alert */}
          {profilePct < 70 && (
            <div style={{
              background: 'linear-gradient(135deg,#FEF3C7,#FDE68A)', border: '1.5px solid #F59E0B',
              borderRadius: 'var(--saa-radius-md)', padding: '1rem 1.5rem', marginBottom: 24,
              display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
            }}>
              <span style={{ fontSize: 20 }}>⚠️</span>
              <div style={{ flex: 1 }}>
                <strong style={{ color: '#92400E', fontSize: 13 }}>Complete your profile to get better matches!</strong>
                <div style={{ background: 'rgba(0,0,0,0.1)', borderRadius: 99, height: 6, marginTop: 6 }}>
                  <div style={{ width: `${profilePct}%`, height: '100%', borderRadius: 99, background: '#F59E0B', transition: 'width 1s ease' }} />
                </div>
              </div>
              <Link to="/profile" style={{
                background: 'var(--saa-gold)', color: 'var(--saa-navy)', fontWeight: 700, fontSize: 13,
                padding: '0.5rem 1.2rem', borderRadius: 8, textDecoration: 'none', whiteSpace: 'nowrap',
              }}>Complete Profile →</Link>
            </div>
          )}

          {/* Stat Cards */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
            <StatCard icon="🏛️" label="Saved Universities" value={dash?.saved_universities ?? 0} trend="↑ 2 this week" bg="rgba(14,165,233,0.12)" />
            <StatCard icon="🎓" label="Saved Scholarships" value={dash?.saved_scholarships ?? 0} trend="↑ 1 this week" bg="rgba(245,166,35,0.12)" />
            <StatCard icon="📊" label="Roadmap Progress" value={dash?.roadmap_progress ?? 0} trend="On track" bg="rgba(139,92,246,0.12)" />
            <StatCard icon="👤" label="Profile Score" value={profilePct} trend="Keep going!" bg="rgba(16,185,129,0.12)" />
          </div>

          {/* Quick Actions */}
          <div style={{ marginBottom: 24 }}>
            <h5 style={{ fontWeight: 700, color: 'var(--saa-navy)', marginBottom: 12 }}>Quick Actions</h5>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <QuickAction icon="🏛️" label="Find Universities" sub="Browse matched programs" to="/universities" color="var(--saa-teal)" />
              <QuickAction icon="🎓" label="Find Scholarships" sub="Explore funding options" to="/scholarships" color="var(--saa-gold)" />
              <QuickAction icon="✍️" label="Write my SOP" sub="AI-assisted writing" to="/writing-assistant" color="#8B5CF6" />
              <QuickAction icon="🗺️" label="View Roadmap" sub="Track milestones" to="/roadmap" color="var(--saa-success)" />
            </div>
          </div>

          {/* Recent Activity */}
          <div className="saa-card" style={{ padding: '1.5rem' }}>
            <h5 style={{ fontWeight: 700, color: 'var(--saa-navy)', marginBottom: 16 }}>Recent Activity</h5>
            {!(dash?.recent_activity?.length) ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--saa-text-muted)' }}>
                <div style={{ fontSize: 36 }}>📋</div><p>No recent activity yet</p>
              </div>
            ) : (
              dash.recent_activity.map((act, i) => (
                <div key={act.id} style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '0.875rem 0',
                  borderBottom: i < dash.recent_activity.length - 1 ? '1px solid var(--saa-border)' : 'none',
                }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#F0F4F8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <i className={`bi ${act.icon}`} style={{ color: 'var(--saa-navy)', fontSize: 14 }} />
                  </div>
                  <div style={{ flex: 1, fontSize: 13, color: 'var(--saa-text)', fontWeight: 500 }}>{act.action}</div>
                  <div style={{ fontSize: 12, color: 'var(--saa-text-muted)', whiteSpace: 'nowrap' }}>{act.time}</div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
