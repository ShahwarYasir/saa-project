import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const studentLinks = [
  { to: '/dashboard', icon: 'bi-house', label: 'Dashboard' },
  { to: '/profile', icon: 'bi-person-fill', label: 'Profile Builder' },
  { to: '/universities', icon: 'bi-building', label: 'Universities' },
  { to: '/scholarships', icon: 'bi-award-fill', label: 'Scholarships' },
  { to: '/writing-assistant', icon: 'bi-pen-fill', label: 'Writing Assistant' },
  { to: '/roadmap', icon: 'bi-map-fill', label: 'Roadmap' },
  { to: '/shortlist', icon: 'bi-bookmark-heart-fill', label: 'Shortlist' },
  { to: '/templates', icon: 'bi-file-earmark-text-fill', label: 'Templates' },
  { to: '/how-to-apply/university/1', icon: 'bi-question-circle-fill', label: 'How to Apply' },
];

const adminLinks = [
  { to: '/admin', icon: 'bi-speedometer2', label: 'Dashboard', end: true },
  { to: '/admin/universities', icon: 'bi-building', label: 'Universities' },
  { to: '/admin/scholarships', icon: 'bi-award-fill', label: 'Scholarships' },
  { to: '/admin/students', icon: 'bi-people-fill', label: 'Students' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { logout, isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const links = isAdmin ? adminLinks : studentLinks;

  const handleLogout = () => {
    logout();
    navigate(isAdmin ? '/admin/login' : '/login');
  };

  return (
    <>
      <div className={`saa-sidebar-overlay ${isOpen ? 'show' : ''}`} onClick={onClose}></div>
      <aside className={`saa-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="saa-sidebar-brand">
          <div className="brand-icon">SAA</div>
          <h5>{isAdmin ? 'Admin Panel' : 'SAA'}</h5>
        </div>

        {!isAdmin && user && (
          <div style={{ padding: 'var(--saa-space-4) var(--saa-space-6)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: 'var(--saa-font-size-sm)', color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>{user.full_name}</div>
            <div style={{ fontSize: 'var(--saa-font-size-xs)', color: 'rgba(255,255,255,0.5)' }}>{user.email}</div>
          </div>
        )}

        <nav className="saa-sidebar-nav">
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `saa-sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <i className={`bi ${link.icon}`}></i>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="saa-sidebar-footer">
          <button className="saa-sidebar-link w-100 border-0" onClick={handleLogout} style={{ background: 'none' }}>
            <i className="bi bi-box-arrow-right"></i>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
