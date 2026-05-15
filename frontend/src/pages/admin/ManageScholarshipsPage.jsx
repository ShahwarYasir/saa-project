import { useState, useEffect, useContext } from 'react';
import { useApi } from '../../hooks/useApi';
import { getAdminScholarships, createScholarship, updateScholarship, deleteScholarship } from '../../services/adminService';
import { ToastContext } from '../../context/ToastContext';
import AdminLayout from '../../components/layout/AdminLayout';

const getFlag = (country) => {
  const map = {
    'USA': '🇺🇸', 'UK': '🇬🇧', 'Canada': '🇨🇦', 'Australia': '🇦🇺', 'Germany': '🇩🇪',
    'United States': '🇺🇸', 'United Kingdom': '🇬🇧'
  };
  return map[country] || '🌍';
};

const getCoverageStyle = (type) => {
  const lower = (type || '').toLowerCase();
  if (lower.includes('full')) return { bg: 'rgba(245,166,35,0.15)', col: '#D48B0E' }; // gold
  if (lower.includes('partial')) return { bg: 'rgba(14,165,233,0.15)', col: '#0284C7' }; // teal
  if (lower.includes('tuition')) return { bg: 'rgba(139,92,246,0.15)', col: '#6D28D9' }; // purple
  return { bg: '#E2E8F0', col: '#64748B' }; // gray fallback
};

export default function ManageScholarshipsPage() {
  const toast = useContext(ToastContext);
  const { data: initialData, loading, error } = useApi(
    () => getAdminScholarships().then(r => r.data),
    [], true
  );

  const [scholarships, setScholarships] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [countryFilter, setCountryFilter] = useState('');

  // Modals state
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState(null);
  const [scholarshipToDelete, setScholarshipToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '', provider: '', country: '', coverage_type: '',
    amount: '', application_deadline: '', eligibility: '', portal_url: ''
  });

  useEffect(() => {
    if (initialData) {
      setScholarships(initialData);
    }
  }, [initialData]);

  const filteredData = scholarships.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCountry = countryFilter ? s.country === countryFilter : true;
    return matchSearch && matchCountry;
  });

  const uniqueCountries = [...new Set(scholarships.map(s => s.country))].filter(Boolean);

  const handleOpenForm = (scholarship = null) => {
    if (scholarship) {
      setEditingScholarship(scholarship);
      setFormData({
        name: scholarship.name || '',
        provider: scholarship.provider || '',
        country: scholarship.country || '',
        coverage_type: scholarship.coverage_type || '',
        amount: scholarship.amount || '',
        application_deadline: scholarship.application_deadline || '',
        eligibility: scholarship.eligibility || '',
        portal_url: scholarship.portal_url || ''
      });
    } else {
      setEditingScholarship(null);
      setFormData({
        name: '', provider: '', country: '', coverage_type: '',
        amount: '', application_deadline: '', eligibility: '', portal_url: ''
      });
    }
    setShowFormModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingScholarship) {
        await updateScholarship(editingScholarship.id, formData);
        setScholarships(prev => prev.map(s => s.id === editingScholarship.id ? { ...s, ...formData } : s));
        toast?.success('Scholarship updated successfully');
      } else {
        const res = await createScholarship(formData);
        setScholarships(prev => [res.data, ...prev]);
        toast?.success('Scholarship added successfully');
      }
      setShowFormModal(false);
    } catch (err) {
      toast?.error(err.message || 'Failed to save scholarship');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (scholarship) => {
    setScholarshipToDelete(scholarship);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setIsSubmitting(true);
    try {
      await deleteScholarship(scholarshipToDelete.id);
      setScholarships(prev => prev.filter(s => s.id !== scholarshipToDelete.id));
      toast?.success('Scholarship deleted');
      setShowDeleteModal(false);
    } catch (err) {
      toast?.error(err.message || 'Failed to delete scholarship');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout pageTitle="Manage Scholarships">
      {/* Header Row */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Manage Scholarships</h2>
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
          Add Scholarship
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
                  placeholder="Search scholarships by name..."
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
                  <th style={{ padding: '1rem' }}>Provider</th>
                  <th style={{ padding: '1rem' }}>Country</th>
                  <th style={{ padding: '1rem' }}>Coverage</th>
                  <th style={{ padding: '1rem' }}>Deadline</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [1, 2, 3, 4, 5].map(i => (
                    <tr key={i}>
                      <td colSpan="7" style={{ padding: '1rem' }}>
                        <div className="skeleton skeleton-text" style={{ margin: 0 }} />
                      </td>
                    </tr>
                  ))
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.5 }}>
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--saa-navy)', marginBottom: '1rem' }}>
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        <h4 style={{ color: 'var(--saa-navy)', marginBottom: '0.5rem' }}>No scholarships found</h4>
                        <p style={{ color: 'var(--saa-text-muted)', fontSize: '0.875rem' }}>Try adjusting your search or filters.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((s, idx) => {
                    const coverage = getCoverageStyle(s.coverage_type);
                    return (
                      <tr key={s.id} style={{ background: idx % 2 === 0 ? '#fff' : '#FAFBFC', transition: 'background 0.2s' }}>
                        <td style={{ padding: '1rem', color: 'var(--saa-text-muted)', fontWeight: 500 }}>{idx + 1}</td>
                        <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--saa-navy)' }}>{s.name}</td>
                        <td style={{ padding: '1rem', color: 'var(--saa-text-muted)' }}>{s.provider}</td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
                            <span style={{ fontSize: '1.25rem' }}>{getFlag(s.country)}</span>
                            {s.country}
                          </span>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{
                            display: 'inline-block', padding: '4px 12px',
                            background: coverage.bg, color: coverage.col,
                            borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600
                          }}>
                            {s.coverage_type}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', color: 'var(--saa-text-muted)' }}>{s.application_deadline || '-'}</td>
                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                          <div className="d-flex justify-content-end gap-2">
                            <button
                              onClick={() => handleOpenForm(s)}
                              style={{ width: 32, height: 32, borderRadius: 'var(--saa-radius-sm)', border: 'none', background: 'rgba(14,165,233,0.1)', color: 'var(--saa-teal-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                            >
                              <i className="bi bi-pencil-fill" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(s)}
                              style={{ width: 32, height: 32, borderRadius: 'var(--saa-radius-sm)', border: 'none', background: 'rgba(239,68,68,0.1)', color: 'var(--saa-danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                            >
                              <i className="bi bi-trash3-fill" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
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
                    {editingScholarship ? 'Edit Scholarship' : 'Add Scholarship'}
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setShowFormModal(false)}></button>
                </div>
                <form onSubmit={handleSave}>
                  <div className="modal-body p-4">
                    <div className="row g-3">
                      <div className="col-md-12 saa-form-group">
                        <label>Scholarship Name *</label>
                        <input required type="text" className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                      </div>
                      <div className="col-md-6 saa-form-group">
                        <label>Provider *</label>
                        <input required type="text" className="form-control" value={formData.provider} onChange={e => setFormData({...formData, provider: e.target.value})} />
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
                          <option value="Global">Global</option>
                        </select>
                      </div>
                      <div className="col-md-6 saa-form-group">
                        <label>Coverage Type *</label>
                        <select required className="form-select" value={formData.coverage_type} onChange={e => setFormData({...formData, coverage_type: e.target.value})}>
                          <option value="">Select coverage...</option>
                          <option value="Full">Full</option>
                          <option value="Partial">Partial</option>
                          <option value="Tuition Only">Tuition Only</option>
                        </select>
                      </div>
                      <div className="col-md-6 saa-form-group">
                        <label>Amount (Text)</label>
                        <input type="text" className="form-control" placeholder="e.g. $10,000 / year" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                      </div>
                      <div className="col-md-6 saa-form-group">
                        <label>Application Deadline</label>
                        <input type="date" className="form-control" value={formData.application_deadline} onChange={e => setFormData({...formData, application_deadline: e.target.value})} />
                      </div>
                      <div className="col-md-6 saa-form-group">
                        <label>Official URL</label>
                        <input type="url" className="form-control" placeholder="https://..." value={formData.portal_url} onChange={e => setFormData({...formData, portal_url: e.target.value})} />
                      </div>
                      <div className="col-md-12 saa-form-group">
                        <label>Eligibility</label>
                        <textarea className="form-control" rows="3" value={formData.eligibility} onChange={e => setFormData({...formData, eligibility: e.target.value})} />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer" style={{ borderTop: '1px solid var(--saa-border)', padding: '1.25rem 1.5rem' }}>
                    <button type="button" className="btn btn-light" onClick={() => setShowFormModal(false)} style={{ borderRadius: 'var(--saa-radius-md)' }}>Cancel</button>
                    <button type="submit" disabled={isSubmitting} style={{ background: 'linear-gradient(135deg, #0A1628 0%, #1E3A5F 100%)', color: '#fff', border: 'none', padding: '0.5rem 1.5rem', borderRadius: 'var(--saa-radius-md)', fontWeight: 600 }}>
                      {isSubmitting ? 'Saving...' : 'Save Scholarship'}
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
                <h5 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Delete Scholarship</h5>
                <p style={{ color: 'var(--saa-text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                  Are you sure you want to delete <strong>{scholarshipToDelete?.name}</strong>? This action cannot be undone.
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
