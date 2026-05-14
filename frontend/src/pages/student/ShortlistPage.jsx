import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getShortlist, removeFromShortlist } from '../../services/shortlistService';
import { ToastContext } from '../../context/ToastContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import EmptyState from '../../components/common/EmptyState';
import { COUNTRY_FLAGS } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';

export default function ShortlistPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('universities');
  const toast = useContext(ToastContext);

  const fetchData = async () => {
    setLoading(true);
    try { const res = await getShortlist(); setData(res.data); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleRemove = async (type, id) => {
    await removeFromShortlist(type, id);
    toast.info('Removed from shortlist');
    fetchData();
  };

  return (
    <DashboardLayout>
      <div className="page-container">
        <div className="page-header"><h1>My Shortlist</h1><p>Your saved universities and scholarships</p></div>

        <ul className="nav nav-tabs saa-tabs mb-4">
          <li className="nav-item"><button className={`nav-link ${tab === 'universities' ? 'active' : ''}`} onClick={() => setTab('universities')}>Universities ({data?.universities?.length || 0})</button></li>
          <li className="nav-item"><button className={`nav-link ${tab === 'scholarships' ? 'active' : ''}`} onClick={() => setTab('scholarships')}>Scholarships ({data?.scholarships?.length || 0})</button></li>
        </ul>

        {loading && <LoadingSpinner />}
        {error && <ErrorAlert message={error} />}

        {data && tab === 'universities' && (
          data.universities.length === 0 ? <EmptyState icon="bi-bookmark" title="No saved universities" message="Browse universities and save your favorites." action={<Link to="/universities" className="btn btn-saa-primary btn-sm">Browse Universities</Link>} />
          : data.universities.map(u => (
            <div key={u.id} className="saa-card mb-3">
              <div className="saa-card-body d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div>
                  <h6 style={{ margin: 0, color: 'var(--saa-navy)' }}>{u.name}</h6>
                  <span style={{ fontSize: 'var(--saa-font-size-sm)', color: 'var(--saa-gray-500)' }}>{COUNTRY_FLAGS[u.country]} {u.city}, {u.country} • Ranking #{u.ranking} • {formatCurrency(u.tuition_fee_usd)}/yr</span>
                </div>
                <div className="d-flex gap-2">
                  <Link to={`/how-to-apply/university/${u.id}`} className="btn btn-sm btn-saa-outline"><i className="bi bi-info-circle me-1"></i>How to Apply</Link>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemove('university', u.id)}><i className="bi bi-x-lg"></i></button>
                </div>
              </div>
            </div>
          ))
        )}

        {data && tab === 'scholarships' && (
          data.scholarships.length === 0 ? <EmptyState icon="bi-bookmark" title="No saved scholarships" message="Browse scholarships and save your favorites." action={<Link to="/scholarships" className="btn btn-saa-primary btn-sm">Browse Scholarships</Link>} />
          : data.scholarships.map(s => (
            <div key={s.id} className="saa-card mb-3">
              <div className="saa-card-body d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div>
                  <h6 style={{ margin: 0, color: 'var(--saa-navy)' }}>{s.name}</h6>
                  <span style={{ fontSize: 'var(--saa-font-size-sm)', color: 'var(--saa-gray-500)' }}>{s.provider} • {COUNTRY_FLAGS[s.funding_country]} {s.funding_country} • {s.coverage}</span>
                </div>
                <div className="d-flex gap-2">
                  <Link to={`/how-to-apply/scholarship/${s.id}`} className="btn btn-sm btn-saa-outline"><i className="bi bi-info-circle me-1"></i>How to Apply</Link>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemove('scholarship', s.id)}><i className="bi bi-x-lg"></i></button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
