import { useState, useEffect } from 'react';
import { getUniversities } from '../../services/recommendationService';
import { isInShortlist, addToShortlist, removeFromShortlist } from '../../services/shortlistService';
import DashboardLayout from '../../components/layout/DashboardLayout';
import UniversityCard from '../../components/recommendations/UniversityCard';
import FilterPanel from '../../components/recommendations/FilterPanel';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import EmptyState from '../../components/common/EmptyState';

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedIds, setSavedIds] = useState(new Set());

  const fetchData = async (f = {}) => {
    setLoading(true); setError(null);
    try {
      const res = await getUniversities(f);
      setUniversities(res.data);
      const saved = new Set();
      res.data.forEach(u => { if (isInShortlist('university', u.id)) saved.add(u.id); });
      setSavedIds(saved);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(filters); }, [filters]);

  const toggleSave = async (id) => {
    const newSaved = new Set(savedIds);
    if (newSaved.has(id)) { newSaved.delete(id); await removeFromShortlist('university', id); }
    else { newSaved.add(id); await addToShortlist('university', id); }
    setSavedIds(newSaved);
  };

  return (
    <DashboardLayout>
      <div className="page-container">
        <div className="page-header"><h1>Universities</h1><p>Explore universities matched to your profile and preferences</p></div>
        <div className="row g-4">
          <div className="col-lg-3">
            <FilterPanel type="universities" filters={filters} onChange={setFilters} />
          </div>
          <div className="col-lg-9">
            {loading && <LoadingSpinner />}
            {error && <ErrorAlert message={error} onRetry={() => fetchData(filters)} />}
            {!loading && !error && universities.length === 0 && <EmptyState icon="bi-building" title="No universities found" message="Try adjusting your filters." />}
            <div className="row g-3">
              {universities.map(u => (
                <div key={u.id} className="col-md-6">
                  <UniversityCard university={u} isSaved={savedIds.has(u.id)} onToggleSave={toggleSave} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
