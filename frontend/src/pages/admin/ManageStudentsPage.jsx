import { useState, useEffect, useContext } from 'react';
import { useApi } from '../../hooks/useApi';
import { getAdminStudents, updateStudentStatus, deleteStudent } from '../../services/adminService';
import { ToastContext } from '../../context/ToastContext';
import AdminLayout from '../../components/layout/AdminLayout';

// Fallback for fields not returned by the mock service
const getMockDetails = (id) => {
  const pcts = [72, 85, 60, 45, 91, 100, 30, 80, 50, 95];
  const dests = [['USA', 'UK'], ['Canada'], ['Germany', 'USA'], ['Australia'], ['UK', 'Canada']];
  const levels = ['Bachelors', 'Masters', 'PhD', 'Diploma'];
  return {
    completion: pcts[id % 10] || 70,
    countries: dests[id % 5],
    degree: levels[id % 4],
    phone: `+1 (555) 01${(id % 10)}${(id % 9)}`
  };
};

export default function ManageStudentsPage() {
  const toast = useContext(ToastContext);
  const { data: initialData, loading, error } = useApi(
    () => getAdminStudents().then(r => r.data),
    [], true
  );

  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals state
  const [showViewModal, setShowViewModal] = useState(false);
  const [studentToView, setStudentToView] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setStudents(initialData);
    }
  }, [initialData]);

  const filteredData = students.filter(s => 
    s.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleStatus = async (student) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const newStatus = student.status === 'active' ? 'inactive' : 'active';
      await updateStudentStatus(student.id, newStatus);
      setStudents(prev => prev.map(s => s.id === student.id ? { ...s, status: newStatus } : s));
      toast?.success(`Student ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
    } catch (err) {
      toast?.error(err.message || 'Failed to update status');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openViewModal = (student) => {
    setStudentToView(student);
    setShowViewModal(true);
  };

  return (
    <AdminLayout pageTitle="Manage Students">
      {/* Header Row */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Manage Students</h2>
          <div style={{ color: 'var(--saa-text-muted)', fontSize: '0.875rem' }}>
            Showing {filteredData.length} student{filteredData.length !== 1 && 's'}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="saa-card mb-4">
        <div className="saa-card-body p-3">
          <div style={{ position: 'relative', maxWidth: 400 }}>
            <i className="bi bi-search" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--saa-text-muted)' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.5rem', borderRadius: 'var(--saa-radius-md)' }}
            />
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
                  <th style={{ padding: '1rem' }}>Email</th>
                  <th style={{ padding: '1rem' }}>Profile %</th>
                  <th style={{ padding: '1rem' }}>Registered</th>
                  <th style={{ padding: '1rem' }}>Status</th>
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
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        <h4 style={{ color: 'var(--saa-navy)', marginBottom: '0.5rem' }}>No students found</h4>
                        <p style={{ color: 'var(--saa-text-muted)', fontSize: '0.875rem' }}>Try adjusting your search.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((s, idx) => {
                    const mock = getMockDetails(s.id || idx);
                    return (
                      <tr key={s.id} style={{ background: idx % 2 === 0 ? '#fff' : '#FAFBFC', transition: 'background 0.2s' }}>
                        <td style={{ padding: '1rem', color: 'var(--saa-text-muted)', fontWeight: 500 }}>{idx + 1}</td>
                        <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--saa-navy)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{
                              width: 32, height: 32, borderRadius: '50%',
                              background: 'var(--saa-gradient-primary)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '0.75rem', fontWeight: 700, color: '#fff', flexShrink: 0
                            }}>
                              {s.full_name?.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}
                            </div>
                            {s.full_name}
                          </div>
                        </td>
                        <td style={{ padding: '1rem', color: 'var(--saa-text-muted)' }}>{s.email}</td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ flex: 1, height: 6, background: '#E2E8F0', borderRadius: 9999, overflow: 'hidden', minWidth: 60, maxWidth: 80 }}>
                              <div style={{ width: `${mock.completion}%`, height: '100%', background: 'var(--saa-gradient-gold)', borderRadius: 9999 }} />
                            </div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--saa-text-muted)' }}>{mock.completion}%</span>
                          </div>
                        </td>
                        <td style={{ padding: '1rem', color: 'var(--saa-text-muted)' }}>{s.registered_at || '-'}</td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{
                            display: 'inline-block', padding: '2px 10px',
                            borderRadius: 9999, fontSize: '0.75rem', fontWeight: 600,
                            background: s.status === 'active' ? 'rgba(16,185,129,0.12)' : 'rgba(100,116,139,0.1)',
                            color: s.status === 'active' ? '#059669' : '#64748B',
                          }}>
                            {s.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                          <div className="d-flex justify-content-end align-items-center gap-3">
                            <button
                              onClick={() => openViewModal(s)}
                              style={{ border: 'none', background: 'transparent', color: 'var(--saa-teal-dark)', padding: 0, cursor: 'pointer', transition: 'all 0.2s', fontSize: '1.125rem' }}
                              title="View Profile"
                            >
                              <i className="bi bi-eye-fill" />
                            </button>
                            <div className="form-check form-switch m-0 p-0" style={{ display: 'flex', alignItems: 'center' }}>
                              <input 
                                className="form-check-input m-0" 
                                type="checkbox" 
                                role="switch" 
                                checked={s.status === 'active'}
                                onChange={() => handleToggleStatus(s)}
                                disabled={isSubmitting}
                                style={{ cursor: 'pointer', width: '2.5rem', height: '1.25rem' }}
                                title={s.status === 'active' ? 'Deactivate' : 'Activate'}
                              />
                            </div>
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

      {/* View Profile Modal */}
      {showViewModal && studentToView && (
        <>
          <div className="modal-backdrop show" style={{ opacity: 0.5, zIndex: 1040 }}></div>
          <div className="modal show d-block" tabIndex="-1" style={{ zIndex: 1050 }} onClick={() => setShowViewModal(false)}>
            <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
              <div className="modal-content" style={{ borderRadius: 'var(--saa-radius-lg)', border: 'none', boxShadow: '0 24px 80px rgba(0,0,0,0.2)' }}>
                <div className="modal-header" style={{ borderBottom: '1px solid var(--saa-border)', padding: '1.25rem 1.5rem', background: 'var(--saa-bg)' }}>
                  <h5 className="modal-title" style={{ fontWeight: 700, margin: 0 }}>Student Profile</h5>
                  <button type="button" className="btn-close" onClick={() => setShowViewModal(false)}></button>
                </div>
                <div className="modal-body p-0">
                  {/* Top banner */}
                  <div style={{ background: 'var(--saa-gradient-primary)', padding: '2rem', textAlign: 'center', color: '#fff' }}>
                    <div style={{
                      width: 80, height: 80, borderRadius: '50%', margin: '0 auto 1rem',
                      background: '#fff', color: 'var(--saa-navy)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '2rem', fontWeight: 800, boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
                    }}>
                      {studentToView.full_name?.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}
                    </div>
                    <h3 style={{ color: '#fff', marginBottom: '0.25rem', fontSize: '1.5rem' }}>{studentToView.full_name}</h3>
                    <div style={{ opacity: 0.8, fontSize: '0.875rem' }}>{studentToView.email}</div>
                  </div>
                  
                  {/* Details */}
                  <div style={{ padding: '1.5rem' }}>
                    <div className="row g-4">
                      {(() => {
                        const m = getMockDetails(studentToView.id || 0);
                        return (
                          <>
                            <div className="col-6">
                              <div style={{ fontSize: '0.75rem', color: 'var(--saa-text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Phone</div>
                              <div style={{ fontWeight: 500 }}>{m.phone}</div>
                            </div>
                            <div className="col-6">
                              <div style={{ fontSize: '0.75rem', color: 'var(--saa-text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Degree Level</div>
                              <div style={{ fontWeight: 500 }}>{m.degree}</div>
                            </div>
                            <div className="col-12">
                              <div style={{ fontSize: '0.75rem', color: 'var(--saa-text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Preferred Countries</div>
                              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {m.countries.map(c => (
                                  <span key={c} style={{ background: 'var(--saa-bg)', border: '1px solid var(--saa-border)', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.8125rem', fontWeight: 500 }}>{c}</span>
                                ))}
                              </div>
                            </div>
                            <div className="col-12">
                              <div style={{ fontSize: '0.75rem', color: 'var(--saa-text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Profile Completion</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ flex: 1, height: 8, background: '#E2E8F0', borderRadius: 9999, overflow: 'hidden' }}>
                                  <div style={{ width: `${m.completion}%`, height: '100%', background: 'var(--saa-gradient-gold)', borderRadius: 9999 }} />
                                </div>
                                <span style={{ fontWeight: 700, color: 'var(--saa-navy)' }}>{m.completion}%</span>
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
                <div className="modal-footer" style={{ borderTop: '1px solid var(--saa-border)', padding: '1rem 1.5rem' }}>
                  <button type="button" className="btn w-100" onClick={() => setShowViewModal(false)} style={{ background: 'var(--saa-bg)', color: 'var(--saa-navy)', fontWeight: 600, border: '1px solid var(--saa-border)' }}>Close</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
