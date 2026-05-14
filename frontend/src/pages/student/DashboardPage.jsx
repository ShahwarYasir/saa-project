import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getDashboard } from '../../services/profileService';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDashboard().then(res => setData(res.data)).catch(err => setError(err.message)).finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div className="page-container">
        <div className="page-header">
          <h1>Welcome back, {user?.full_name?.split(' ')[0] || 'Student'} 👋</h1>
          <p>Here's an overview of your study abroad journey</p>
        </div>

        {loading && <LoadingSpinner />}
        {error && <ErrorAlert message={error} />}

        {data && (
          <>
            <div className="row g-4 mb-5">
              <div className="col-sm-6 col-xl-3"><StatCard icon="bi-building" label="Saved Universities" value={data.saved_universities} /></div>
              <div className="col-sm-6 col-xl-3"><StatCard icon="bi-award-fill" label="Saved Scholarships" value={data.saved_scholarships} color="var(--saa-info)" /></div>
              <div className="col-sm-6 col-xl-3"><StatCard icon="bi-person-check-fill" label="Profile Completion" value={`${data.profile_completion}%`} color="var(--saa-success)" /></div>
              <div className="col-sm-6 col-xl-3"><StatCard icon="bi-map-fill" label="Roadmap Progress" value={`${data.roadmap_progress}%`} color="var(--saa-navy)" /></div>
            </div>

            <div className="row g-4">
              <div className="col-lg-6">
                <div className="saa-card">
                  <div className="saa-card-header">Quick Actions</div>
                  <div className="saa-card-body">
                    <div className="d-flex flex-wrap gap-2">
                      <Link to="/profile" className="btn btn-saa-outline btn-sm"><i className="bi bi-person-fill me-1"></i>Complete Profile</Link>
                      <Link to="/universities" className="btn btn-saa-outline btn-sm"><i className="bi bi-building me-1"></i>Browse Universities</Link>
                      <Link to="/scholarships" className="btn btn-saa-outline btn-sm"><i className="bi bi-award-fill me-1"></i>Find Scholarships</Link>
                      <Link to="/writing-assistant" className="btn btn-saa-outline btn-sm"><i className="bi bi-pen-fill me-1"></i>Write SOP</Link>
                      <Link to="/roadmap" className="btn btn-saa-outline btn-sm"><i className="bi bi-map-fill me-1"></i>View Roadmap</Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="saa-card">
                  <div className="saa-card-header">Recent Activity</div>
                  <div className="saa-card-body">
                    {data.recent_activity.map(a => (
                      <div key={a.id} className="d-flex align-items-start gap-3 mb-3">
                        <i className={`bi ${a.icon}`} style={{ color: 'var(--saa-gold)', fontSize: 'var(--saa-font-size-lg)', marginTop: 2 }}></i>
                        <div>
                          <div style={{ fontSize: 'var(--saa-font-size-sm)' }}>{a.action}</div>
                          <div style={{ fontSize: 'var(--saa-font-size-xs)', color: 'var(--saa-gray-400)' }}>{a.time}</div>
                        </div>
                      </div>
                    ))}
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
