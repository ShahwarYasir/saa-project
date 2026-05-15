import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useState, useRef, useEffect, useContext } from 'react';
import { ToastContext } from '../../context/ToastContext';

const NAV_ITEMS = [
  { to: '/dashboard',         label: 'Dashboard',         icon: 'bi-grid-fill' },
  { to: '/profile',           label: 'Profile Builder',   icon: 'bi-person-fill' },
  { to: '/universities',      label: 'Universities',      icon: 'bi-building-fill' },
  { to: '/scholarships',      label: 'Scholarships',      icon: 'bi-award-fill' },
  { to: '/shortlist',         label: 'Shortlist',         icon: 'bi-bookmark-heart-fill' },
  { to: '/writing-assistant', label: 'Writing Assistant', icon: 'bi-file-earmark-text-fill' },
  { to: '/roadmap',           label: 'Roadmap',           icon: 'bi-map-fill' },
  { to: '/templates',         label: 'Templates',         icon: 'bi-folder2-open' },
];

function getInitials(name) {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardLayout({ children, pageTitle }) {
  const { user, logout } = useAuth();
  const toast = useContext(ToastContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropOpen, setProfileDropOpen] = useState(false);
  const dropRef = useRef(null);

  // Derive page title from route if not passed as prop
  const derivedTitle = pageTitle || NAV_ITEMS.find(n => location.pathname === n.to)?.label || 'Dashboard';

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
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="saa-sidebar-overlay show"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ===== SIDEBAR ===== */}
      <aside className={`saa-sidebar${sidebarOpen ? ' open' : ''}`} style={{ background: 'var(--saa-gradient-primary)' }}>
        {/* Brand */}
        <div className="saa-sidebar-brand">
          <div className="brand-icon">SAA</div>
          <h5>Study Abroad<br/>Assistant</h5>
        </div>

        {/* Nav */}
        <nav className="saa-sidebar-nav" role="navigation">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `saa-sidebar-link${isActive ? ' active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <i className={`bi ${item.icon}`} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="saa-sidebar-footer">
          <button
            className="saa-sidebar-link w-100 text-start"
            style={{ color: 'rgba(255,255,255,0.5)' }}
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right" />
            <span>Logout</span>
          </button>

          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            marginTop: '1rem', padding: '0.75rem',
            background: 'rgba(255,255,255,0.06)', borderRadius: 'var(--saa-radius-sm)'
          }}>
            <div style={{
              width: 38, height: 38, minWidth: 38, borderRadius: '50%',
              background: 'var(--saa-gradient-gold)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '0.8125rem', color: 'var(--saa-navy)'
            }}>
              {getInitials(user?.full_name)}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{
                color: '#fff', fontWeight: 600, fontSize: '0.8125rem',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
              }}>
                {user?.full_name || 'Student'}
              </div>
              <div style={{
                color: 'rgba(255,255,255,0.45)', fontSize: '0.6875rem',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
              }}>
                {user?.email || ''}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ===== MAIN ===== */}
      <div className="saa-dashboard-main">
        {/* Header */}
        <header className="saa-dashboard-header">
          <div className="header-left">
            <button
              className="mobile-menu-btn"
              onClick={() => setSidebarOpen(s => !s)}
              aria-label="Toggle menu"
            >
              <i className={`bi ${sidebarOpen ? 'bi-x-lg' : 'bi-list'}`} />
            </button>
            <h1 className="header-title">{derivedTitle}</h1>
          </div>

          <div className="header-right">
            <button className="header-notification" aria-label="Notifications">
              <i className="bi bi-bell" />
              <span className="badge-dot" />
            </button>

            <div style={{ position: 'relative' }} ref={dropRef}>
              <button
                className="header-profile"
                onClick={() => setProfileDropOpen(o => !o)}
              >
                <div className="profile-avatar">
                  {getInitials(user?.full_name)}
                </div>
                <div className="profile-info">
                  <div className="profile-name">{user?.full_name || 'Student'}</div>
                  <div className="profile-role">Student</div>
                </div>
                <i className="bi bi-chevron-down" style={{ fontSize: '0.75rem', color: 'var(--saa-text-muted)' }} />
              </button>

              {profileDropOpen && (
                <div className="profile-dropdown">
                  <NavLink to="/profile" onClick={() => setProfileDropOpen(false)}>
                    <i className="bi bi-person-circle" />
                    My Profile
                  </NavLink>
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
    </div>
  );
}
