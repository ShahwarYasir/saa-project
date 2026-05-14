import { useState, useEffect, useContext } from 'react';
import { getAdminUniversities, createUniversity, updateUniversity, deleteUniversity } from '../../services/adminService';
import { ToastContext } from '../../context/ToastContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import AdminTable from '../../components/admin/AdminTable';
import UniversityForm from '../../components/admin/UniversityForm';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import { formatCurrency } from '../../utils/formatters';

export default function ManageUniversitiesPage() {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const toast = useContext(ToastContext);

  const fetchData = () => {
    setLoading(true);
    getAdminUniversities().then(res => setUniversities(res.data)).catch(err => setError(err.message)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (data) => {
    setSaving(true);
    try {
      if (editing) { await updateUniversity(editing.id, data); toast.success('University updated'); }
      else { await createUniversity(data); toast.success('University created'); }
      setShowModal(false); setEditing(null); fetchData();
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this university?')) return;
    try { await deleteUniversity(id); toast.success('Deleted'); fetchData(); }
    catch (err) { toast.error(err.message); }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'country', label: 'Country' },
    { key: 'ranking', label: 'Ranking' },
    { key: 'tuition_fee_usd', label: 'Tuition', render: v => formatCurrency(v) },
    { key: 'gpa_requirement', label: 'GPA Req' },
  ];

  return (
    <DashboardLayout>
      <div className="page-container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div><h1 style={{ marginBottom: 4 }}>Manage Universities</h1><p style={{ color: 'var(--saa-gray-500)', margin: 0 }}>Add, edit, or remove university listings</p></div>
          <Button onClick={() => { setEditing(null); setShowModal(true); }}><i className="bi bi-plus-lg me-1"></i>Add University</Button>
        </div>

        {loading && <LoadingSpinner />}
        {error && <ErrorAlert message={error} />}
        {!loading && !error && (
          <div className="saa-card"><div className="saa-card-body">
            <AdminTable columns={columns} data={universities} searchFields={['name', 'country', 'city']} onEdit={row => { setEditing(row); setShowModal(true); }} onDelete={handleDelete} />
          </div></div>
        )}

        <Modal show={showModal} onClose={() => { setShowModal(false); setEditing(null); }} title={editing ? 'Edit University' : 'Add University'} size="lg">
          <UniversityForm initial={editing} onSubmit={handleSubmit} loading={saving} />
        </Modal>
      </div>
    </DashboardLayout>
  );
}
