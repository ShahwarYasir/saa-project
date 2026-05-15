import { useState, useContext, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useApi } from '../../hooks/useApi';
import { getRoadmap, generateRoadmap, updateMilestoneStatus } from '../../services/roadmapService';
import { ToastContext } from '../../context/ToastContext';

const STATUS_COLORS = {
  'Not Started': { bg: '#F3F4F6', color: '#6B7280', dot: '#9CA3AF' },
  'In Progress':  { bg: '#EFF6FF', color: '#1D4ED8', dot: '#3B82F6' },
  'Done':         { bg: '#F0FDF4', color: '#15803D', dot: '#22C55E' },
};

function Shimmer() {
  return (
    <div style={{ marginBottom: 32, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%)', backgroundSize: '400% 100%', animation: 'shimmer 1.4s infinite', flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ height: 20, borderRadius: 8, background: 'linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%)', backgroundSize: '400% 100%', animation: 'shimmer 1.4s infinite', marginBottom: 10 }} />
        <div style={{ height: 60, borderRadius: 10, background: 'linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%)', backgroundSize: '400% 100%', animation: 'shimmer 1.4s infinite' }} />
      </div>
    </div>
  );
}

function CircularProgress({ pct, size = 180 }) {
  const r = (size - 24) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', filter: 'drop-shadow(0 4px 12px rgba(245,166,35,0.3))' }}>
      <defs>
        <linearGradient id="pgr" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F5A623" />
          <stop offset="100%" stopColor="#FFD166" />
        </linearGradient>
      </defs>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#E2E8F0" strokeWidth={12} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="url(#pgr)" strokeWidth={12}
        strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }} />
      <text x="50%" y="46%" textAnchor="middle" dominantBaseline="central"
        style={{ transform: 'rotate(90deg)', transformOrigin: 'center', fill: 'var(--saa-navy)', fontWeight: 800, fontSize: 28 }}>{pct}%</text>
      <text x="50%" y="60%" textAnchor="middle" dominantBaseline="central"
        style={{ transform: 'rotate(90deg)', transformOrigin: 'center', fill: 'var(--saa-text-muted)', fontSize: 12 }}>Complete</text>
    </svg>
  );
}

export default function RoadmapPage() {
  const toast = useContext(ToastContext);
  const { data, loading, execute } = useApi(getRoadmap);
  const [milestones, setMilestones] = useState([]);
  const [season, setSeason] = useState('Fall');
  const [year, setYear] = useState('2027');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (data?.data?.milestones) {
      setMilestones(data.data.milestones.map(m => ({ ...m })));
      const [s, y] = (data.data.target_intake || 'Fall 2027').split(' ');
      setSeason(s); setYear(y);
    }
  }, [data]);

  const doneCount = milestones.filter(m => m.status === 'Done').length;
  const totalCount = milestones.length;
  const pct = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;

  async function handleStatusChange(id, status) {
    setMilestones(prev => prev.map(m => m.id === id ? { ...m, status } : m));
    await updateMilestoneStatus(id, status);
  }

  async function handleGenerate() {
    setGenerating(true);
    try {
      const res = await generateRoadmap(`${season} ${year}`);
      setMilestones(res.data.milestones.map(m => ({ ...m, status: 'Not Started' })));
      toast?.success('Roadmap generated! All milestones reset.');
    } catch { toast?.error('Failed to generate roadmap'); }
    finally { setGenerating(false); }
  }

  return (
    <DashboardLayout pageTitle="Roadmap">
      <style>{`@keyframes shimmer{0%{background-position:100% 0}100%{background-position:-100% 0}}`}</style>

      {/* Top Section */}
      <div className="saa-card" style={{ padding: '2rem', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <h2 style={{ fontWeight: 800, color: 'var(--saa-navy)', margin: '0 0 8px' }}>Your Application Roadmap</h2>
          <p style={{ color: 'var(--saa-text-muted)', fontSize: 14, margin: '0 0 20px' }}>Track every milestone on your journey to studying abroad</p>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--saa-text)' }}>Target Intake:</label>
            <select value={season} onChange={e => setSeason(e.target.value)} style={{ padding: '0.4rem 0.75rem', border: '1.5px solid var(--saa-border)', borderRadius: 8, fontSize: 13, background: '#fff' }}>
              <option>Spring</option><option>Fall</option>
            </select>
            <select value={year} onChange={e => setYear(e.target.value)} style={{ padding: '0.4rem 0.75rem', border: '1.5px solid var(--saa-border)', borderRadius: 8, fontSize: 13, background: '#fff' }}>
              {['2025','2026','2027','2028'].map(y => <option key={y}>{y}</option>)}
            </select>
          </div>
          <div style={{ marginTop: 16, display: 'flex', gap: 16 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--saa-success)' }}>{doneCount}</div>
              <div style={{ fontSize: 12, color: 'var(--saa-text-muted)' }}>Completed</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--saa-teal)' }}>{milestones.filter(m => m.status === 'In Progress').length}</div>
              <div style={{ fontSize: 12, color: 'var(--saa-text-muted)' }}>In Progress</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--saa-text-muted)' }}>{milestones.filter(m => m.status === 'Not Started').length}</div>
              <div style={{ fontSize: 12, color: 'var(--saa-text-muted)' }}>Not Started</div>
            </div>
          </div>
        </div>
        <CircularProgress pct={pct} size={180} />
      </div>

      {/* Timeline */}
      {loading ? (
        <div>{[1,2,3].map(i => <Shimmer key={i} />)}</div>
      ) : milestones.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--saa-text-muted)' }}>
          <div style={{ fontSize: 64 }}>🗺️</div>
          <h5>No roadmap yet</h5>
          <button onClick={handleGenerate} style={{ marginTop: 16, background: 'var(--saa-gradient-gold)', color: 'var(--saa-navy)', border: 'none', borderRadius: 10, padding: '0.75rem 2rem', fontWeight: 700, cursor: 'pointer' }}>Generate Roadmap</button>
        </div>
      ) : (
        <div style={{ position: 'relative', paddingLeft: 32 }}>
          {/* Vertical center line */}
          <div style={{ position: 'absolute', left: 19, top: 0, bottom: 0, width: 2, background: 'var(--saa-border)', borderRadius: 99 }} />

          {milestones.map((m, i) => {
            const sc = STATUS_COLORS[m.status] || STATUS_COLORS['Not Started'];
            return (
              <div key={m.id} style={{ position: 'relative', marginBottom: 24 }}>
                {/* Status dot on timeline */}
                <div style={{
                  position: 'absolute', left: -32, top: 18, width: 16, height: 16, borderRadius: '50%',
                  background: sc.dot, border: '3px solid #fff', boxShadow: `0 0 0 2px ${sc.dot}44`,
                  zIndex: 1, transition: 'background 0.3s',
                }} />
                <div className="saa-card" style={{ padding: '1.25rem 1.5rem', borderLeft: `3px solid ${sc.dot}`, transition: 'border-color 0.3s' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontWeight: 800, fontSize: 15, color: 'var(--saa-navy)' }}>{m.title}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: sc.bg, color: sc.color }}>{m.status}</span>
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--saa-text-muted)', lineHeight: 1.5, marginBottom: 8 }}>{m.description}</div>
                      <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--saa-text-muted)' }}>
                        <span>📅 Suggested: {m.suggested_date}</span>
                        <span style={{ color: m.status === 'Done' ? 'var(--saa-success)' : 'var(--saa-danger)' }}>⏰ Deadline: {m.deadline}</span>
                      </div>
                    </div>
                    <select
                      value={m.status}
                      onChange={e => handleStatusChange(m.id, e.target.value)}
                      style={{ padding: '0.4rem 0.75rem', border: `1.5px solid ${sc.dot}`, borderRadius: 8, fontSize: 12, fontWeight: 700, background: sc.bg, color: sc.color, cursor: 'pointer', minWidth: 130 }}>
                      <option>Not Started</option>
                      <option>In Progress</option>
                      <option>Done</option>
                    </select>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Generate button */}
      {milestones.length > 0 && (
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <button onClick={handleGenerate} disabled={generating} style={{ background: 'var(--saa-gradient-primary)', color: '#fff', fontWeight: 700, padding: '0.875rem 2.5rem', border: 'none', borderRadius: 12, cursor: 'pointer', fontSize: 14, opacity: generating ? 0.7 : 1 }}>
            {generating ? 'Generating...' : '🔄 Generate New Roadmap'}
          </button>
        </div>
      )}
    </DashboardLayout>
  );
}
