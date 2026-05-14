import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminDashboard } from '../../services/adminService';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import { formatDate } from '../../utils/formatters';

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAdminDashboard().then(res => setData(res.data)).catch(err => setError(err.message)).finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div className="page-container">
        <div className="page-header">
          <h1>Admin Dashboard</h1>
          <p>Platform overview and management</p>
        </div>

        {loading && <LoadingSpinner />}
        {error && <ErrorAlert message={error} />}

        {data && (
          <>
            <div className="row g-4 mb-5">
              <div className="col-sm-6 col-xl-3"><StatCard icon="bi-people-fill" label="Total Students" value={data.total_students} /></div>
              <div className="col-sm-6 col-xl-3"><StatCard icon="bi-building" label="Total Universities" value={data.total_universities} color="var(--saa-info)" /></div>
              <div className="col-sm-6 col-xl-3"><StatCard icon="bi-award-fill" label="Total Scholarships" value={data.total_scholarships} color="var(--saa-success)" /></div>
              <div className="col-sm-6 col-xl-3"><StatCard icon="bi-activity" label="Active Sessions" value={data.active_sessions} color="var(--saa-navy)" /></div>
            </div>

            <div className="row g-4">
              <div className="col-lg-8">
                <div className="saa-card">
                  <div className="saa-card-header">Recent Registrations</div>
                  <div className="saa-card-body">
                    <div className="table-responsive">
                      <table className="table saa-admin-table mb-0">
                        <thead><tr><th>Name</th><th>Email</th><th>Date</th><th>Status</th></tr></thead>
                        <tbody>
                          {data.recent_registrations.map(r => (
                            <tr key={r.id}>
                              <td>{r.full_name}</td>
                              <td>{r.email}</td>
                              <td>{formatDate(r.registered_at)}</td>
                              <td><span className={`badge ${r.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>{r.status}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="saa-card">
                  <div className="saa-card-header">Quick Links</div>
                  <div className="saa-card-body d-flex flex-column gap-2">
                    <Link to="/admin/universities" className="btn btn-saa-outline btn-sm text-start"><i className="bi bi-building me-2"></i>Manage Universities</Link>
                    <Link to="/admin/scholarships" className="btn btn-saa-outline btn-sm text-start"><i className="bi bi-award-fill me-2"></i>Manage Scholarships</Link>
                    <Link to="/admin/students" className="btn btn-saa-outline btn-sm text-start"><i className="bi bi-people-fill me-2"></i>Manage Students</Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
