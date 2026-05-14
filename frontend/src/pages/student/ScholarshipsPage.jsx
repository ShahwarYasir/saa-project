import { useState, useEffect } from 'react';
import { getScholarships } from '../../services/recommendationService';
import { isInShortlist, addToShortlist, removeFromShortlist } from '../../services/shortlistService';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ScholarshipCard from '../../components/recommendations/ScholarshipCard';
import FilterPanel from '../../components/recommendations/FilterPanel';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import EmptyState from '../../components/common/EmptyState';

export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedIds, setSavedIds] = useState(new Set());

  const fetchData = async (f = {}) => {
    setLoading(true); setError(null);
    try {
      const res = await getScholarships(f);
      setScholarships(res.data);
      const saved = new Set();
      res.data.forEach(s => { if (isInShortlist('scholarship', s.id)) saved.add(s.id); });
      setSavedIds(saved);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(filters); }, [filters]);

  const toggleSave = async (id) => {
    const newSaved = new Set(savedIds);
    if (newSaved.has(id)) { newSaved.delete(id); await removeFromShortlist('scholarship', id); }
    else { newSaved.add(id); await addToShortlist('scholarship', id); }
    setSavedIds(newSaved);
  };

  return (
    <DashboardLayout>
      <div className="page-container">
        <div className="page-header"><h1>Scholarships</h1><p>Find scholarships that match your profile and eligibility</p></div>
        <div className="row g-4">
          <div className="col-lg-3">
            <FilterPanel type="scholarships" filters={filters} onChange={setFilters} />
          </div>
          <div className="col-lg-9">
            {loading && <LoadingSpinner />}
            {error && <ErrorAlert message={error} onRetry={() => fetchData(filters)} />}
            {!loading && !error && scholarships.length === 0 && <EmptyState icon="bi-award" title="No scholarships found" message="Try adjusting your filters." />}
            <div className="row g-3">
              {scholarships.map(s => (
                <div key={s.id} className="col-md-6">
                  <ScholarshipCard scholarship={s} isSaved={savedIds.has(s.id)} onToggleSave={toggleSave} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
