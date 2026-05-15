import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useContext } from 'react';
import { ToastContext } from '../../context/ToastContext';

const NAV_ITEMS = [
  { to: '/admin',               label: 'Dashboard',     icon: 'bi-speedometer2',   exact: true },
  { to: '/admin/universities',  label: 'Universities',  icon: 'bi-building-fill' },
  { to: '/admin/scholarships',  label: 'Scholarships',  icon: 'bi-award-fill' },
  { to: '/admin/students',      label: 'Students',      icon: 'bi-people-fill' },
];

export default function AdminLayout({ children, pageTitle }) {
  const { user, logout } = useAuth();
  const toast = useContext(ToastContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropOpen, setProfileDropOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const dropRef = useRef(null);

  const derivedTitle =
    pageTitle ||
    NAV_ITEMS.find(n =>
      n.exact ? location.pathname === n.to : location.pathname.startsWith(n.to)
    )?.label ||
    'Admin';

  useEffect(() => {
    function handleClick(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setProfileDropOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleLogout() {
    logout();
    toast?.success('Logged out successfully');
    navigate('/login');
  }

  return (
    <div className="saa-dashboard">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="saa-sidebar-overlay show"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ===== SIDEBAR ===== */}
      <aside
        className={`saa-sidebar${sidebarOpen ? ' open' : ''}`}
        style={{ background: 'linear-gradient(180deg, #0A0F1E 0%, #0D1530 50%, #0F1A38 100%)' }}
      >
        {/* Brand */}
        <div className="saa-sidebar-brand" style={{ borderBottomColor: 'rgba(255,255,255,0.06)' }}>
          <div className="brand-icon">SAA</div>
          <div>
            <h5 style={{ marginBottom: '4px', fontSize: '1rem' }}>
              Study Abroad<br />Assistant
            </h5>
            <span style={{
              display: 'inline-block',
              background: 'rgba(239,68,68,0.18)',
              color: '#FC8181',
              border: '1px solid rgba(239,68,68,0.35)',
              borderRadius: '9999px',
              fontSize: '0.625rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              padding: '2px 8px',
              textTransform: 'uppercase',
            }}>
              Admin Portal
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="saa-sidebar-nav" role="navigation">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) => `saa-sidebar-link${isActive ? ' active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <i className={`bi ${item.icon}`} />
              <span>{item.label}</span>
            </NavLink>
          ))}

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '0.75rem 0' }} />

          <NavLink
            to="/"
            className="saa-sidebar-link"
            onClick={() => setSidebarOpen(false)}
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            <i className="bi bi-arrow-left-circle" />
            <span>Back to Site</span>
          </NavLink>
        </nav>

        {/* Footer */}
        <div className="saa-sidebar-footer">
          <button
            className="saa-sidebar-link w-100 text-start"
            style={{ color: 'rgba(255,255,255,0.45)', marginBottom: '0.75rem' }}
            onClick={() => setShowLogoutConfirm(true)}
          >
            <i className="bi bi-box-arrow-right" />
            <span>Logout</span>
          </button>

          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.75rem',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 'var(--saa-radius-sm)',
          }}>
            {/* Admin avatar — red circle with "AD" */}
            <div style={{
              width: 38, height: 38, minWidth: 38, borderRadius: '50%',
              background: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '0.8125rem', color: '#fff',
              fontFamily: "'Clash Display', 'Segoe UI', system-ui, sans-serif",
              boxShadow: '0 2px 8px rgba(239,68,68,0.4)',
            }}>
              AD
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{
                color: '#fff', fontWeight: 600, fontSize: '0.8125rem',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {user?.full_name || 'Admin'}
              </div>
              <div style={{
                color: 'rgba(255,255,255,0.4)', fontSize: '0.6875rem',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {user?.email || ''}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ===== MAIN ===== */}
      <div className="saa-dashboard-main">
        {/* Header — dark navy */}
        <header className="saa-dashboard-header" style={{
          background: '#112240',
          borderBottomColor: 'rgba(255,255,255,0.08)',
          boxShadow: '0 1px 8px rgba(0,0,0,0.25)',
        }}>
          <div className="header-left">
            <button
              className="mobile-menu-btn"
              onClick={() => setSidebarOpen(s => !s)}
              aria-label="Toggle menu"
              style={{ color: 'rgba(255,255,255,0.8)' }}
            >
              <i className={`bi ${sidebarOpen ? 'bi-x-lg' : 'bi-list'}`} />
            </button>
            <h1 className="header-title" style={{ color: '#fff', fontSize: '1.125rem' }}>
              {derivedTitle}
            </h1>
          </div>

          <div className="header-right">
            <button
              className="header-notification"
              aria-label="Notifications"
              style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}
            >
              <i className="bi bi-bell" />
              <span className="badge-dot" />
            </button>

            <div style={{ position: 'relative' }} ref={dropRef}>
              <button
                className="header-profile"
                onClick={() => setProfileDropOpen(o => !o)}
                style={{ color: '#fff' }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '0.8125rem', color: '#fff',
                  fontFamily: "'Clash Display', 'Segoe UI', system-ui, sans-serif",
                }}>
                  AD
                </div>
                <div className="profile-info">
                  <div className="profile-name" style={{ color: '#fff' }}>
                    {user?.full_name || 'Admin'}
                  </div>
                  <div className="profile-role" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    Administrator
                  </div>
                </div>
                <i className="bi bi-chevron-down" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }} />
              </button>

              {profileDropOpen && (
                <div className="profile-dropdown">
                  <button onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right" style={{ color: 'var(--saa-danger)' }} />
                    <span style={{ color: 'var(--saa-danger)' }}>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="saa-dashboard-content">
          {children}
        </main>
      </div>
      {showLogoutConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 'min(100%, 380px)', background: '#fff', borderRadius: 16, padding: 32, textAlign: 'center' }}>
            <div style={{ fontSize: 40, lineHeight: 1, marginBottom: 16 }}>🚪</div>
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Logout?</div>
            <div style={{ color: '#475569', marginBottom: 24 }}>Are you sure you want to logout of the admin panel?</div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => setShowLogoutConfirm(false)} style={{ background: 'transparent', border: '1.5px solid #CBD5E1', color: '#475569', borderRadius: 12, padding: '10px 18px', cursor: 'pointer', minWidth: 120 }}>Cancel</button>
              <button onClick={() => { setShowLogoutConfirm(false); handleLogout(); }} style={{ background: '#0A1628', color: '#fff', border: 'none', borderRadius: 12, padding: '10px 18px', cursor: 'pointer', minWidth: 120 }}>Yes, Logout</button>
            </div>
          </div>
        </div>
      )}
      </div>
  );
}
