import { useState, useEffect, useContext } from 'react';
import { useApi } from '../../hooks/useApi';
import { getAdminUniversities, createUniversity, updateUniversity, deleteUniversity } from '../../services/adminService';
import { ToastContext } from '../../context/ToastContext';
import AdminLayout from '../../components/layout/AdminLayout';

const getFlag = (country) => {
  const map = {
    'USA': '🇺🇸', 'UK': '🇬🇧', 'Canada': '🇨🇦', 'Australia': '🇦🇺', 'Germany': '🇩🇪',
    'United States': '🇺🇸', 'United Kingdom': '🇬🇧'
  };
  return map[country] || '🌍';
};

const formatCurrency = (val) => {
  if (!val) return 'N/A';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
};

export default function ManageUniversitiesPage() {
  const toast = useContext(ToastContext);
  const { data: initialData, loading, error } = useApi(
    () => getAdminUniversities().then(r => r.data),
    [], true
  );

  const [universities, setUniversities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [countryFilter, setCountryFilter] = useState('');

  // Modals state
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingUniv, setEditingUniv] = useState(null);
  const [univToDelete, setUnivToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '', country: '', city: '', ranking: '',
    programs: '', gpa_requirement: '', tuition_fee_usd: '',
    application_deadline: '', portal_url: '', description: ''
  });

  useEffect(() => {
    if (initialData) {
      setUniversities(initialData);
    }
  }, [initialData]);

  const filteredData = universities.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCountry = countryFilter ? u.country === countryFilter : true;
    return matchSearch && matchCountry;
  });

  const uniqueCountries = [...new Set(universities.map(u => u.country))].filter(Boolean);

  const handleOpenForm = (univ = null) => {
    if (univ) {
      setEditingUniv(univ);
      setFormData({
        name: univ.name || '',
        country: univ.country || '',
        city: univ.city || '',
        ranking: univ.ranking || '',
        programs: Array.isArray(univ.programs) ? univ.programs.join(', ') : (univ.programs || ''),
        gpa_requirement: univ.gpa_requirement || '',
        tuition_fee_usd: univ.tuition_fee_usd || '',
        application_deadline: univ.application_deadline || '',
        portal_url: univ.portal_url || '',
        description: univ.description || ''
      });
    } else {
      setEditingUniv(null);
      setFormData({
        name: '', country: '', city: '', ranking: '',
        programs: '', gpa_requirement: '', tuition_fee_usd: '',
        application_deadline: '', portal_url: '', description: ''
      });
    }
    setShowFormModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        ranking: parseInt(formData.ranking) || null,
        tuition_fee_usd: parseInt(formData.tuition_fee_usd) || null,
        gpa_requirement: parseFloat(formData.gpa_requirement) || null,
        programs: formData.programs.split(',').map(s => s.trim()).filter(Boolean)
      };

      if (editingUniv) {
        await updateUniversity(editingUniv.id, payload);
        setUniversities(prev => prev.map(u => u.id === editingUniv.id ? { ...u, ...payload } : u));
        toast?.success('University updated successfully');
      } else {
        const res = await createUniversity(payload);
        setUniversities(prev => [res.data, ...prev]);
        toast?.success('University added successfully');
      }
      setShowFormModal(false);
    } catch (err) {
      toast?.error(err.message || 'Failed to save university');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (univ) => {
    setUnivToDelete(univ);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setIsSubmitting(true);
    try {
      await deleteUniversity(univToDelete.id);
      setUniversities(prev => prev.filter(u => u.id !== univToDelete.id));
      toast?.success('University deleted');
      setShowDeleteModal(false);
    } catch (err) {
      toast?.error(err.message || 'Failed to delete university');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout pageTitle="Manage Universities">
      {/* Header Row */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Manage Universities</h2>
          <div style={{ color: 'var(--saa-text-muted)', fontSize: '0.875rem' }}>
            Showing {filteredData.length} result{filteredData.length !== 1 && 's'}
          </div>
        </div>
        <button
          onClick={() => handleOpenForm()}
          style={{
            background: 'linear-gradient(135deg, #F5A623 0%, #D48B0E 100%)',
            color: 'var(--saa-navy)',
            border: 'none', padding: '0.625rem 1.25rem',
            borderRadius: 'var(--saa-radius-md)', fontWeight: 600,
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            boxShadow: '0 4px 12px rgba(245,166,35,0.3)',
            transition: 'all 0.2s', width: '100%', maxWidth: 'max-content'
          }}
        >
          <i className="bi bi-plus-lg" />
          Add University
        </button>
      </div>

      {/* Filters */}
      <div className="saa-card mb-4">
        <div className="saa-card-body p-3">
          <div className="row g-3">
            <div className="col-md-8">
              <div style={{ position: 'relative' }}>
                <i className="bi bi-search" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--saa-text-muted)' }} />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search universities by name..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{ paddingLeft: '2.5rem', borderRadius: 'var(--saa-radius-md)' }}
                />
              </div>
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={countryFilter}
                onChange={e => setCountryFilter(e.target.value)}
                style={{ borderRadius: 'var(--saa-radius-md)' }}
              >
                <option value="">All Countries</option>
                {uniqueCountries.map(c => (
                  <option key={c} value={c}>{getFlag(c)} {c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      {error ? (
        <div className="saa-error-alert">
          <i className="bi bi-exclamation-triangle-fill" />
          <div>
            <strong>Error loading data</strong>
            <div>{error}</div>
            <button className="btn btn-sm btn-outline-danger mt-2" onClick={() => window.location.reload()}>Retry</button>
          </div>
        </div>
      ) : (
        <div className="saa-card" style={{ overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="table mb-0" style={{ minWidth: 800 }}>
              <thead>
                <tr style={{ background: '#FAFBFC', color: 'var(--saa-text-muted)', fontSize: '0.8125rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '1rem' }}>#</th>
                  <th style={{ padding: '1rem' }}>Name</th>
                  <th style={{ padding: '1rem' }}>Country</th>
                  <th style={{ padding: '1rem' }}>Ranking</th>
                  <th style={{ padding: '1rem' }}>Programs</th>
                  <th style={{ padding: '1rem' }}>Min GPA</th>
                  <th style={{ padding: '1rem' }}>Tuition</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [1, 2, 3, 4, 5].map(i => (
                    <tr key={i}>
                      <td colSpan="8" style={{ padding: '1rem' }}>
                        <div className="skeleton skeleton-text" style={{ margin: 0 }} />
                      </td>
                    </tr>
                  ))
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.5 }}>
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--saa-navy)', marginBottom: '1rem' }}>
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <line x1="3" y1="9" x2="21" y2="9" />
                          <line x1="9" y1="21" x2="9" y2="9" />
                        </svg>
                        <h4 style={{ color: 'var(--saa-navy)', marginBottom: '0.5rem' }}>No universities found</h4>
                        <p style={{ color: 'var(--saa-text-muted)', fontSize: '0.875rem' }}>Try adjusting your search or filters.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((u, idx) => (
                    <tr key={u.id} style={{ background: idx % 2 === 0 ? '#fff' : '#FAFBFC', transition: 'background 0.2s' }}>
                      <td style={{ padding: '1rem', color: 'var(--saa-text-muted)', fontWeight: 500 }}>{idx + 1}</td>
                      <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--saa-navy)' }}>{u.name}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
                          <span style={{ fontSize: '1.25rem' }}>{getFlag(u.country)}</span>
                          {u.country}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--saa-text-muted)' }}>{u.ranking ? `#${u.ranking}` : '-'}</td>
                      <td style={{ padding: '1rem', color: 'var(--saa-text-muted)', fontSize: '0.875rem' }}>
                        <div style={{ maxWidth: 150, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {Array.isArray(u.programs) ? u.programs.join(', ') : u.programs}
                        </div>
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--saa-text-muted)' }}>{u.gpa_requirement || '-'}</td>
                      <td style={{ padding: '1rem', fontWeight: 500, color: 'var(--saa-teal-dark)' }}>{formatCurrency(u.tuition_fee_usd)}</td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <div className="d-flex justify-content-end gap-2">
                          <button
                            onClick={() => handleOpenForm(u)}
                            style={{ width: 32, height: 32, borderRadius: 'var(--saa-radius-sm)', border: 'none', background: 'rgba(14,165,233,0.1)', color: 'var(--saa-teal-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                          >
                            <i className="bi bi-pencil-fill" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(u)}
                            style={{ width: 32, height: 32, borderRadius: 'var(--saa-radius-sm)', border: 'none', background: 'rgba(239,68,68,0.1)', color: 'var(--saa-danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                          >
                            <i className="bi bi-trash3-fill" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showFormModal && (
        <>
          <div className="modal-backdrop show" style={{ opacity: 0.5, zIndex: 1040 }}></div>
          <div className="modal show d-block" tabIndex="-1" style={{ zIndex: 1050 }} onClick={() => setShowFormModal(false)}>
            <div className="modal-dialog modal-lg modal-dialog-centered" onClick={e => e.stopPropagation()}>
              <div className="modal-content" style={{ borderRadius: 'var(--saa-radius-lg)', border: 'none', boxShadow: '0 24px 80px rgba(0,0,0,0.2)' }}>
                <div className="modal-header" style={{ borderBottom: '1px solid var(--saa-border)', padding: '1.25rem 1.5rem' }}>
                  <h5 className="modal-title" style={{ fontWeight: 700, margin: 0 }}>
                    {editingUniv ? 'Edit University' : 'Add University'}
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setShowFormModal(false)}></button>
                </div>
                <form onSubmit={handleSave}>
                  <div className="modal-body p-4">
                    <div className="row g-3">
                      <div className="col-md-12 saa-form-group">
                        <label>University Name *</label>
                        <input required type="text" className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                      </div>
                      <div className="col-md-6 saa-form-group">
                        <label>Country *</label>
                        <select required className="form-select" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})}>
                          <option value="">Select country...</option>
                          <option value="USA">USA</option>
                          <option value="UK">UK</option>
                          <option value="Canada">Canada</option>
                          <option value="Australia">Australia</option>
                          <option value="Germany">Germany</option>
                        </select>
                      </div>
                      <div className="col-md-6 saa-form-group">
                        <label>City</label>
                        <input type="text" className="form-control" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                      </div>
                      <div className="col-md-6 saa-form-group">
                        <label>World Ranking</label>
                        <input type="number" className="form-control" value={formData.ranking} onChange={e => setFormData({...formData, ranking: e.target.value})} />
                      </div>
                      <div className="col-md-6 saa-form-group">
                        <label>Min GPA</label>
                        <input type="number" step="0.1" className="form-control" value={formData.gpa_requirement} onChange={e => setFormData({...formData, gpa_requirement: e.target.value})} />
                      </div>
                      <div className="col-md-12 saa-form-group">
                        <label>Programs (comma separated) *</label>
                        <input required type="text" className="form-control" placeholder="e.g. Computer Science, Business, Engineering" value={formData.programs} onChange={e => setFormData({...formData, programs: e.target.value})} />
                      </div>
                      <div className="col-md-6 saa-form-group">
                        <label>Annual Tuition (USD)</label>
                        <input type="number" className="form-control" value={formData.tuition_fee_usd} onChange={e => setFormData({...formData, tuition_fee_usd: e.target.value})} />
                      </div>
                      <div className="col-md-6 saa-form-group">
                        <label>Application Deadline</label>
                        <input type="date" className="form-control" value={formData.application_deadline} onChange={e => setFormData({...formData, application_deadline: e.target.value})} />
                      </div>
                      <div className="col-md-12 saa-form-group">
                        <label>Portal URL</label>
                        <input type="url" className="form-control" placeholder="https://..." value={formData.portal_url} onChange={e => setFormData({...formData, portal_url: e.target.value})} />
                      </div>
                      <div className="col-md-12 saa-form-group">
                        <label>Description</label>
                        <textarea className="form-control" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer" style={{ borderTop: '1px solid var(--saa-border)', padding: '1.25rem 1.5rem' }}>
                    <button type="button" className="btn btn-light" onClick={() => setShowFormModal(false)} style={{ borderRadius: 'var(--saa-radius-md)' }}>Cancel</button>
                    <button type="submit" disabled={isSubmitting} style={{ background: 'linear-gradient(135deg, #0A1628 0%, #1E3A5F 100%)', color: '#fff', border: 'none', padding: '0.5rem 1.5rem', borderRadius: 'var(--saa-radius-md)', fontWeight: 600 }}>
                      {isSubmitting ? 'Saving...' : 'Save University'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <>
          <div className="modal-backdrop show" style={{ opacity: 0.5, zIndex: 1040 }}></div>
          <div className="modal show d-block" tabIndex="-1" style={{ zIndex: 1050 }} onClick={() => setShowDeleteModal(false)}>
            <div className="modal-dialog modal-dialog-centered modal-sm" onClick={e => e.stopPropagation()}>
              <div className="modal-content" style={{ borderRadius: 'var(--saa-radius-lg)', border: 'none', textAlign: 'center', padding: '2rem 1.5rem' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(239,68,68,0.1)', color: 'var(--saa-danger)', fontSize: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <i className="bi bi-exclamation-triangle-fill" />
                </div>
                <h5 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Delete University</h5>
                <p style={{ color: 'var(--saa-text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                  Are you sure you want to delete <strong>{univToDelete?.name}</strong>? This action cannot be undone.
                </p>
                <div className="d-flex gap-2 w-100">
                  <button type="button" className="btn btn-light flex-fill" onClick={() => setShowDeleteModal(false)} style={{ borderRadius: 'var(--saa-radius-md)', fontWeight: 600 }}>Cancel</button>
                  <button type="button" disabled={isSubmitting} onClick={confirmDelete} style={{ background: 'var(--saa-danger)', color: '#fff', border: 'none', borderRadius: 'var(--saa-radius-md)', fontWeight: 600, padding: '0.5rem 1rem' }} className="flex-fill">
                    {isSubmitting ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
