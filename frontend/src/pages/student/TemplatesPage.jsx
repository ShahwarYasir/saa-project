import { useState, useEffect, useContext } from 'react';
import { getTemplates, downloadTemplate } from '../../services/templateService';
import { ToastContext } from '../../context/ToastContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';

const ICONS = { 'CV': 'bi-file-person', 'Essay': 'bi-journal-richtext', 'Letter': 'bi-envelope-paper', 'Email': 'bi-envelope-at' };

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useContext(ToastContext);

  useEffect(() => {
    getTemplates().then(res => setTemplates(res.data)).catch(err => setError(err.message)).finally(() => setLoading(false));
  }, []);

  const handleDownload = async (id, format) => {
    try {
      await downloadTemplate(id, format);
    } catch (err) {
      toast.warning(err.message || 'Coming soon!');
    }
  };

  return (
    <DashboardLayout>
      <div className="page-container">
        <div className="page-header">
          <h1>Document Templates</h1>
          <p>Download professionally crafted templates for your application documents</p>
        </div>

        {loading && <LoadingSpinner />}
        {error && <ErrorAlert message={error} />}

        <div className="row g-4">
          {templates.map(t => (
            <div key={t.id} className="col-md-6 col-lg-4">
              <div className="saa-card h-100">
                <div className="saa-card-body text-center">
                  <div style={{ width: 80, height: 80, borderRadius: 'var(--saa-radius-lg)', background: 'var(--saa-navy-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--saa-space-4)', fontSize: '2rem', color: 'var(--saa-navy)' }}>
                    <i className={`bi ${ICONS[t.category] || 'bi-file-earmark-text'}`}></i>
                  </div>
                  <h5>{t.name}</h5>
                  <p style={{ fontSize: 'var(--saa-font-size-sm)', color: 'var(--saa-gray-500)', minHeight: 48 }}>{t.description}</p>
                  <div className="d-flex gap-2 justify-content-center mt-3">
                    <button className="btn btn-sm btn-saa-primary" onClick={() => handleDownload(t.id, 'pdf')}><i className="bi bi-file-pdf me-1"></i>PDF</button>
                    <button className="btn btn-sm btn-saa-outline" onClick={() => handleDownload(t.id, 'docx')}><i className="bi bi-file-word me-1"></i>DOCX</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
