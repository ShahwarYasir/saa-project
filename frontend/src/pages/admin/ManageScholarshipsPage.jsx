import { useState, useEffect, useContext } from 'react';
import { getAdminScholarships, createScholarship, updateScholarship, deleteScholarship } from '../../services/adminService';
import { ToastContext } from '../../context/ToastContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import AdminTable from '../../components/admin/AdminTable';
import ScholarshipForm from '../../components/admin/ScholarshipForm';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';

export default function ManageScholarshipsPage() {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const toast = useContext(ToastContext);

  const fetchData = () => {
    setLoading(true);
    getAdminScholarships().then(res => setScholarships(res.data)).catch(err => setError(err.message)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (data) => {
    setSaving(true);
    try {
      if (editing) { await updateScholarship(editing.id, data); toast.success('Scholarship updated'); }
      else { await createScholarship(data); toast.success('Scholarship created'); }
      setShowModal(false); setEditing(null); fetchData();
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this scholarship?')) return;
    try { await deleteScholarship(id); toast.success('Deleted'); fetchData(); }
    catch (err) { toast.error(err.message); }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'provider', label: 'Provider' },
    { key: 'funding_country', label: 'Country' },
    { key: 'coverage', label: 'Coverage' },
    { key: 'deadline', label: 'Deadline' },
  ];

  return (
    <DashboardLayout>
      <div className="page-container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div><h1 style={{ marginBottom: 4 }}>Manage Scholarships</h1><p style={{ color: 'var(--saa-gray-500)', margin: 0 }}>Add, edit, or remove scholarship listings</p></div>
          <Button onClick={() => { setEditing(null); setShowModal(true); }}><i className="bi bi-plus-lg me-1"></i>Add Scholarship</Button>
        </div>

        {loading && <LoadingSpinner />}
        {error && <ErrorAlert message={error} />}
        {!loading && !error && (
          <div className="saa-card"><div className="saa-card-body">
            <AdminTable columns={columns} data={scholarships} searchFields={['name', 'provider', 'funding_country']} onEdit={row => { setEditing(row); setShowModal(true); }} onDelete={handleDelete} />
          </div></div>
        )}

        <Modal show={showModal} onClose={() => { setShowModal(false); setEditing(null); }} title={editing ? 'Edit Scholarship' : 'Add Scholarship'} size="lg">
          <ScholarshipForm initial={editing} onSubmit={handleSubmit} loading={saving} />
        </Modal>
      </div>
    </DashboardLayout>
  );
}
