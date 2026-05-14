import { useState } from 'react';
import Sidebar from './Sidebar';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard-wrapper">
      <button className="saa-menu-toggle" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
        <i className="bi bi-list"></i>
      </button>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="dashboard-content">
        {children}
      </main>
    </div>
  );
}
