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

const MOCK_NOTIFICATIONS = [
  { id: 1, icon: '🏛️', text: 'TU Munich application deadline in 15 days', time: '2 hours ago', read: false },
  { id: 2, icon: '🎓', text: 'New scholarship match: DAAD 2026 now open', time: '5 hours ago', read: false },
  { id: 3, icon: '✅', text: 'Your profile is 68% complete — finish it!', time: '1 day ago', read: true },
  { id: 4, icon: '👋', text: 'Welcome to SAA! Start by building your profile', time: '3 days ago', read: true },
];

export default function DashboardLayout({ children, pageTitle }) {
  const { user, logout } = useAuth();
  const toast = useContext(ToastContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropOpen, setProfileDropOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const dropRef = useRef(null);
  const notifRef = useRef(null);

  // Derive page title from route if not passed as prop
  const derivedTitle = pageTitle || NAV_ITEMS.find(n => location.pathname === n.to)?.label || 'Dashboard';

  useEffect(() => {
    function handleClick(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setProfileDropOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
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
            className="w-100 text-start"
            style={{
              background: 'var(--saa-gold, #F5A623)',
              color: '#0A1628',
              borderRadius: 10,
              padding: '10px 20px',
              fontWeight: 700,
              width: 'calc(100% - 32px)',
              margin: '12px 16px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--saa-navy, #0A1628)';
              e.currentTarget.style.color = 'var(--saa-gold, #F5A623)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'var(--saa-gold, #F5A623)';
              e.currentTarget.style.color = '#0A1628';
            }}
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
            <div style={{ position: 'relative' }} ref={notifRef}>
            <button
              className="header-notification"
              aria-label="Notifications"
              onClick={() => setNotifOpen(o => !o)}
              style={{ position: 'relative' }}
            >
              <i className="bi bi-bell" />
              {notifications.some(n => !n.read) && (
                <span style={{ position: 'absolute', top: 6, right: 6, width: 10, height: 10, borderRadius: '50%', background: '#EF4444', boxShadow: '0 0 0 2px rgba(255,255,255,0.9)' }} />
              )}
            </button>
            {notifOpen && (
              <div style={{
                position: 'absolute', right: 0, top: 50, width: 320,
                background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                border: '1px solid #E2E8F0', zIndex: 100, overflow: 'hidden'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid #E2E8F0' }}>
                  <div style={{ fontWeight: 700, color: '#0A1628' }}>Notifications</div>
                  <button
                    onClick={() => {
                      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                      setNotifOpen(false);
                    }}
                    style={{ background: 'transparent', border: 'none', color: 'var(--saa-gold, #F5A623)', fontWeight: 700, cursor: 'pointer', fontSize: 12 }}
                  >
                    Mark all as read
                  </button>
                </div>
                {notifications.map((notification, index) => (
                  <div key={notification.id} style={{
                    display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px 16px',
                    background: notification.read ? '#fff' : '#FFFBEB',
                    borderBottom: index < notifications.length - 1 ? '1px solid #E2E8F0' : 'none'
                  }}>
                    <div style={{ width: 36, height: 36, borderRadius: 12, background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                      {notification.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: notification.read ? 500 : 700, color: 'var(--saa-navy)' }}>{notification.text}</div>
                      <div style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>{notification.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

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
