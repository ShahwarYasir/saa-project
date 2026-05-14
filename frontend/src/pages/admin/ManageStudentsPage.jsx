import { useState, useEffect, useContext } from 'react';
import { getAdminStudents, updateStudentStatus, deleteStudent } from '../../services/adminService';
import { ToastContext } from '../../context/ToastContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import AdminTable from '../../components/admin/AdminTable';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';

export default function ManageStudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useContext(ToastContext);

  const fetchData = () => {
    setLoading(true);
    getAdminStudents().then(res => setStudents(res.data)).catch(err => setError(err.message)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleToggleStatus = async (student) => {
    const newStatus = student.status === 'active' ? 'inactive' : 'active';
    try {
      await updateStudentStatus(student.id, newStatus);
      toast.success(`Student ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
      setStudents(prev => prev.map(s => s.id === student.id ? { ...s, status: newStatus } : s));
    } catch (err) { toast.error(err.message); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this student account?')) return;
    try { await deleteStudent(id); toast.success('Student deleted'); fetchData(); }
    catch (err) { toast.error(err.message); }
  };

  const columns = [
    { key: 'full_name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'registered_at', label: 'Registered' },
    { key: 'status', label: 'Status', render: (v) => <span className={`badge ${v === 'active' ? 'bg-success' : 'bg-secondary'}`}>{v}</span> },
  ];

  return (
    <DashboardLayout>
      <div className="page-container">
        <div className="page-header"><h1>Manage Students</h1><p>View and manage student accounts</p></div>

        {loading && <LoadingSpinner />}
        {error && <ErrorAlert message={error} />}
        {!loading && !error && (
          <div className="saa-card"><div className="saa-card-body">
            <AdminTable
              columns={columns}
              data={students}
              searchFields={['full_name', 'email']}
              onDelete={handleDelete}
              extraActions={(row) => (
                <button className={`btn btn-sm ${row.status === 'active' ? 'btn-outline-warning' : 'btn-outline-success'}`} onClick={() => handleToggleStatus(row)}>
                  <i className={`bi ${row.status === 'active' ? 'bi-pause-circle' : 'bi-play-circle'}`}></i>
                </button>
              )}
            />
          </div></div>
        )}
      </div>
    </DashboardLayout>
  );
}
