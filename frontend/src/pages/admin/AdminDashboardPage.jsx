import { useState, useEffect, useContext, useRef } from 'react';
import { useApi } from '../../hooks/useApi';
import { getAdminDashboard } from '../../services/adminService';
import AdminLayout from '../../components/layout/AdminLayout';
import { ToastContext } from '../../context/ToastContext';

/* ── count-up hook ── */
function useCountUp(target, duration = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target) return;
    const start = performance.now();
    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(ease * target));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [target, duration]);
  return val;
}

/* ── Stat Card ── */
function StatCard({ icon, label, value, color, delay = 0 }) {
  const count = useCountUp(value);
  return (
    <div
      className="saa-stat-card"
      style={{
        animation: `fadeInUp 0.5s ease both`,
        animationDelay: `${delay}ms`,
        borderTop: `4px solid ${color}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div className="stat-label" style={{ marginBottom: '0.5rem' }}>{label}</div>
          <div className="stat-value" style={{ color: 'var(--saa-navy)' }}>{count.toLocaleString()}</div>
        </div>
        <div style={{
          width: 52, height: 52, borderRadius: 'var(--saa-radius-md)',
          background: `${color}18`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.5rem', color,
        }}>
          <i className={`bi ${icon}`} />
        </div>
      </div>
    </div>
  );
}

/* ── Skeleton card ── */
function SkeletonStat() {
  return (
    <div style={{
      background: '#fff', borderRadius: 'var(--saa-radius-lg)',
      padding: '1.25rem', border: '1px solid var(--saa-border)',
    }}>
      <div className="skeleton skeleton-stat" style={{ height: 110 }} />
    </div>
  );
}

/* ── Bar chart — last 7 days mock data ── */
const BAR_DATA = [
  { day: 'Mon', val: 5 },
  { day: 'Tue', val: 8 },
  { day: 'Wed', val: 12 },
  { day: 'Thu', val: 6 },
  { day: 'Fri', val: 15 },
  { day: 'Sat', val: 9 },
  { day: 'Sun', val: 11 },
];
const MAX_VAL = Math.max(...BAR_DATA.map(d => d.val));

function BarChart() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.625rem', height: 120, padding: '0 0.5rem' }}>
      {BAR_DATA.map((d, i) => (
        <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem' }}>
          <span style={{ fontSize: '0.6875rem', color: 'var(--saa-text-muted)', fontWeight: 600 }}>{d.val}</span>
          <div style={{
            width: '100%',
            height: `${(d.val / MAX_VAL) * 90}px`,
            background: i === BAR_DATA.length - 1
              ? 'linear-gradient(180deg, #F5A623 0%, #D48B0E 100%)'
              : 'linear-gradient(180deg, #1E3A5F 0%, #0A1628 100%)',
            borderRadius: '4px 4px 0 0',
            transition: 'height 0.5s ease',
            animation: `fadeInUp 0.4s ease both`,
            animationDelay: `${i * 60}ms`,
            cursor: 'default',
          }} />
          <span style={{ fontSize: '0.6875rem', color: 'var(--saa-text-muted)' }}>{d.day}</span>
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboardPage() {
  const { data, loading, error } = useApi(
    () => getAdminDashboard().then(r => r.data),
    [], true
  );
  const toast = useContext(ToastContext);

  const stats = data ? [
    { icon: 'bi-people-fill',    label: 'Total Students',      value: data.total_students,      color: '#0EA5E9', delay: 0   },
    { icon: 'bi-building-fill',  label: 'Total Universities',  value: data.total_universities,  color: '#F5A623', delay: 60  },
    { icon: 'bi-award-fill',     label: 'Total Scholarships',  value: data.total_scholarships,  color: '#8B5CF6', delay: 120 },
    { icon: 'bi-lightning-fill', label: 'Active This Week',    value: data.active_sessions,     color: '#10B981', delay: 180 },
  ] : [];

  return (
    <AdminLayout pageTitle="Dashboard">
      {/* Stats */}
      <div className="row g-3 mb-4">
        {loading
          ? [0,1,2,3].map(i => <div key={i} className="col-sm-6 col-xl-3"><SkeletonStat /></div>)
          : stats.map(s => (
            <div key={s.label} className="col-sm-6 col-xl-3">
              <StatCard {...s} />
            </div>
          ))
        }
      </div>

      {error && (
        <div className="saa-error-alert mb-4">
          <i className="bi bi-exclamation-triangle-fill" />
          <div>
            <strong>Failed to load dashboard data</strong>
            <div>{error}</div>
          </div>
        </div>
      )}

      <div className="row g-4 mb-4">
        {/* Recent Registrations */}
        <div className="col-xl-8">
          <div className="saa-card" style={{ animation: 'fadeInUp 0.5s ease 0.2s both' }}>
            <div className="saa-card-header" style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span>
                <i className="bi bi-person-plus-fill" style={{ color: 'var(--saa-gold)', marginRight: '0.5rem' }} />
                Recent Registrations
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--saa-text-muted)', fontWeight: 400 }}>
                Last 5 students
              </span>
            </div>
            <div className="saa-card-body p-0">
              <div style={{ overflowX: 'auto' }}>
                <table className="table saa-admin-table mb-0">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Registered</th>
                      <th>Profile %</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      [1,2,3,4,5].map(i => (
                        <tr key={i}>
                          {[1,2,3,4,5].map(j => (
                            <td key={j}><div className="skeleton skeleton-text" style={{ height: 12 }} /></td>
                          ))}
                        </tr>
                      ))
                    ) : (data?.recent_registrations || []).map((reg, idx) => {
                      const pct = [72, 85, 60, 45, 91][idx] ?? 70;
                      return (
                        <tr key={reg.id} style={{ background: idx % 2 === 0 ? '#FAFBFC' : '#fff' }}>
                          <td style={{ fontWeight: 600, color: 'var(--saa-navy)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <div style={{
                                width: 30, height: 30, borderRadius: '50%',
                                background: 'var(--saa-gradient-primary)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.6875rem', fontWeight: 700, color: '#fff', flexShrink: 0,
                              }}>
                                {reg.full_name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
                              </div>
                              {reg.full_name}
                            </div>
                          </td>
                          <td style={{ color: 'var(--saa-text-muted)' }}>{reg.email}</td>
                          <td style={{ color: 'var(--saa-text-muted)' }}>{reg.registered_at}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <div style={{ flex: 1, height: 6, background: '#E2E8F0', borderRadius: 9999, overflow: 'hidden', minWidth: 60 }}>
                                <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #0A1628, #F5A623)', borderRadius: 9999 }} />
                              </div>
                              <span style={{ fontSize: '0.75rem', color: 'var(--saa-text-muted)', whiteSpace: 'nowrap' }}>{pct}%</span>
                            </div>
                          </td>
                          <td>
                            <span style={{
                              display: 'inline-block', padding: '2px 10px',
                              borderRadius: 9999, fontSize: '0.75rem', fontWeight: 600,
                              background: reg.status === 'active' ? 'rgba(16,185,129,0.12)' : 'rgba(100,116,139,0.1)',
                              color: reg.status === 'active' ? '#059669' : '#64748B',
                            }}>
                              {reg.status === 'active' ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="col-xl-4">
          <div className="saa-card h-100" style={{ animation: 'fadeInUp 0.5s ease 0.25s both' }}>
            <div className="saa-card-header">
              <i className="bi bi-bar-chart-fill" style={{ color: 'var(--saa-gold)', marginRight: '0.5rem' }} />
              Registrations This Month
            </div>
            <div className="saa-card-body">
              <BarChart />
              <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--saa-text-muted)', marginTop: '0.75rem', marginBottom: 0 }}>
                Last 7 days — mock data
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="saa-card" style={{ animation: 'fadeInUp 0.5s ease 0.3s both' }}>
        <div className="saa-card-header">
          <i className="bi bi-lightning-charge-fill" style={{ color: 'var(--saa-gold)', marginRight: '0.5rem' }} />
          Quick Actions
        </div>
        <div className="saa-card-body">
          <div className="d-flex flex-wrap gap-3">
            <a
              href="/admin/universities"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.625rem 1.25rem',
                background: 'linear-gradient(135deg, #0A1628 0%, #1E3A5F 100%)',
                color: '#fff', borderRadius: 'var(--saa-radius-md)',
                fontWeight: 600, fontSize: '0.875rem',
                textDecoration: 'none', transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(10,22,40,0.25)',
              }}
            >
              <i className="bi bi-building-add" />
              Add University
            </a>
            <a
              href="/admin/scholarships"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.625rem 1.25rem',
                background: 'linear-gradient(135deg, #F5A623 0%, #D48B0E 100%)',
                color: 'var(--saa-navy)', borderRadius: 'var(--saa-radius-md)',
                fontWeight: 600, fontSize: '0.875rem',
                textDecoration: 'none', transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(245,166,35,0.3)',
              }}
            >
              <i className="bi bi-award" />
              Add Scholarship
            </a>
            <button
              onClick={() => toast?.info('CSV export coming soon!')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.625rem 1.25rem',
                background: 'rgba(14,165,233,0.1)',
                color: 'var(--saa-teal-dark)', border: '1.5px solid rgba(14,165,233,0.3)',
                borderRadius: 'var(--saa-radius-md)',
                fontWeight: 600, fontSize: '0.875rem',
                cursor: 'pointer', transition: 'all 0.2s ease',
              }}
            >
              <i className="bi bi-download" />
              Export Students CSV
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
