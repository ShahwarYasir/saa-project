import { useState, useContext } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useApi } from '../../hooks/useApi';
import { downloadTemplate, getTemplates } from '../../services/templateService';
import { ToastContext } from '../../context/ToastContext';

const CATEGORY_COLORS = {
  CV:      '#0EA5E9',
  Essay:   '#8B5CF6',
  Letter:  '#F5A623',
  Email:   '#10B981',
};

const CATEGORY_TABS = ['All','CV','Essay','Letter','Email'];

// Enhanced mock templates with richer data
const ENRICHED = [
  { id: 1, name: 'Academic CV', category: 'CV', description: 'Structured CV for academic applications, highlighting education, research, and publications.', pages: 2, format: ['PDF','DOCX'] },
  { id: 2, name: 'Professional CV', category: 'CV', description: 'Clean, ATS-friendly CV template designed for professional roles with clear sections.', pages: 1, format: ['PDF','DOCX'] },
  { id: 3, name: 'Personal Statement', category: 'Essay', description: 'Compelling personal statement template for university admissions with structured prompts.', pages: 1, format: ['PDF','DOCX'] },
  { id: 4, name: 'Statement of Purpose', category: 'Essay', description: 'Structured SOP with sections for background, motivation, goals, and program fit.', pages: 2, format: ['PDF','DOCX'] },
  { id: 5, name: 'Scholarship Motivation Letter', category: 'Letter', description: 'Formal motivation letter for scholarship applications with impact-driven structure.', pages: 1, format: ['PDF','DOCX'] },
  { id: 6, name: 'University Motivation Letter', category: 'Letter', description: 'Professional letter template tailored for master\'s and PhD program applications.', pages: 1, format: ['PDF','DOCX'] },
  { id: 7, name: 'Reference Request Email', category: 'Email', description: 'Polite and professional email template for requesting recommendation letters.', pages: 1, format: ['PDF','DOCX'] },
  { id: 8, name: 'Follow-up Email', category: 'Email', description: 'Post-interview or post-application follow-up email to demonstrate continued interest.', pages: 1, format: ['PDF','DOCX'] },
  { id: 9, name: 'Research Proposal', category: 'Essay', description: 'Structured research proposal template for PhD applications with clear problem statement.', pages: 3, format: ['PDF','DOCX'] },
];

function Shimmer() {
  return (
    <div className="saa-card" style={{ overflow: 'hidden' }}>
      <div style={{ height: 8, background: '#e2e8f0', borderRadius: 0 }} />
      <div style={{ padding: '1.5rem' }}>
        <div style={{ height: 48, width: 48, borderRadius: 10, background: 'linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%)', backgroundSize: '400% 100%', animation: 'shimmer 1.4s infinite', marginBottom: 14 }} />
        {[1,2,3].map(i => <div key={i} style={{ height: 14, borderRadius: 8, background: 'linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%)', backgroundSize: '400% 100%', animation: 'shimmer 1.4s infinite', marginBottom: 10 }} />)}
      </div>
    </div>
  );
}

function PreviewModal({ template, onClose, onDownload }) {
  if (!template) return null;
  const color = CATEGORY_COLORS[template.category] || '#64748B';
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 20, padding: '2rem', maxWidth: 520, width: '100%', position: 'relative', boxShadow: 'var(--saa-shadow-lg)' }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: '#F1F5F9', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        <div style={{ width: 64, height: 64, borderRadius: 14, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <i className="bi bi-file-earmark-text" style={{ fontSize: 32, color }} />
        </div>
        <h4 style={{ fontWeight: 800, color: 'var(--saa-navy)', marginBottom: 8 }}>{template.name}</h4>
        <span style={{ fontSize: 11, background: `${color}18`, color, borderRadius: 99, padding: '2px 10px', fontWeight: 600 }}>{template.category}</span>
        <p style={{ fontSize: 14, color: 'var(--saa-text-muted)', margin: '14px 0', lineHeight: 1.6 }}>{template.description}</p>
        <div style={{ background: '#F8FAFC', borderRadius: 12, padding: '1rem', textAlign: 'center', color: 'var(--saa-text-muted)', fontSize: 13, marginBottom: 16, border: '1.5px dashed var(--saa-border)' }}>
          📋 Full template available after download
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {template.format.map(fmt => (
            <button key={fmt} onClick={() => onDownload(template, fmt)} style={{ flex: 1, background: 'var(--saa-gradient-gold)', color: 'var(--saa-navy)', fontWeight: 700, border: 'none', borderRadius: 10, padding: '0.7rem', cursor: 'pointer', fontSize: 13 }}>
              Download {fmt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TemplatesPage() {
  const toast = useContext(ToastContext);
  const { data, loading } = useApi(getTemplates);
  const [activeTab, setActiveTab] = useState('All');
  const [preview, setPreview] = useState(null);

  const templates = data?.data?.length ? data.data.map((template, index) => ({
    ...template,
    pages: ENRICHED[index]?.pages || 1,
    format: (template.format || ['pdf', 'docx']).map(fmt => String(fmt).toUpperCase()),
  })) : ENRICHED;
  const filtered = activeTab === 'All' ? templates : templates.filter(t => t.category === activeTab);

  async function handleDownload(t, fmt) {
    try {
      await downloadTemplate(t.id, fmt);
      toast?.success(`${t.name} (${fmt}) downloaded!`);
    } catch (error) {
      toast?.error(error?.message || 'Download failed');
    }
  }

  return (
    <DashboardLayout pageTitle="Templates">
      <style>{`@keyframes shimmer{0%{background-position:100% 0}100%{background-position:-100% 0}}`}</style>

      <PreviewModal template={preview} onClose={() => setPreview(null)} onDownload={handleDownload} />

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontWeight: 800, color: 'var(--saa-navy)', margin: 0 }}>Document Templates</h2>
        <p style={{ color: 'var(--saa-text-muted)', fontSize: 14, marginTop: 6 }}>Ready-to-use templates for your study abroad applications</p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
        {CATEGORY_TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '0.5rem 1.25rem', border: 'none', borderRadius: 99, cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'var(--saa-transition)',
            background: activeTab === tab ? 'var(--saa-navy)' : '#F1F5F9',
            color: activeTab === tab ? '#fff' : 'var(--saa-text-muted)',
          }}>{tab}</button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 20 }}>
          {[1,2,3,4,5,6].map(i => <Shimmer key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--saa-text-muted)' }}>
          <div style={{ fontSize: 64 }}>📂</div><h5>No templates in this category</h5>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 20 }}>
          {filtered.map(t => {
            const color = CATEGORY_COLORS[t.category] || '#64748B';
            return (
              <div key={t.id} className="saa-card" style={{ overflow: 'hidden', transition: 'var(--saa-transition)', display: 'flex', flexDirection: 'column' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--saa-shadow-lg)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'var(--saa-shadow-md)'; }}>
                <div style={{ height: 6, background: color }} />
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                    <i className="bi bi-file-earmark-text" style={{ fontSize: 24, color }} />
                  </div>
                  <h6 style={{ fontWeight: 700, fontSize: 15, color: 'var(--saa-navy)', marginBottom: 6 }}>{t.name}</h6>
                  <p style={{ fontSize: 12, color: 'var(--saa-text-muted)', marginBottom: 12, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{t.description}</p>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 10, background: '#F1F5F9', color: 'var(--saa-text-muted)', borderRadius: 99, padding: '2px 8px', fontWeight: 600 }}>{t.pages} page{t.pages > 1 ? 's' : ''}</span>
                    {t.format.map(f => <span key={f} style={{ fontSize: 10, background: `${color}18`, color, borderRadius: 99, padding: '2px 8px', fontWeight: 600 }}>{f}</span>)}
                  </div>
                  <div style={{ marginTop: 'auto', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button onClick={() => setPreview(t)} style={{ flex: 1, background: '#F8FAFC', color: 'var(--saa-navy)', fontWeight: 600, border: '1.5px solid var(--saa-border)', borderRadius: 8, padding: '0.5rem 0.75rem', cursor: 'pointer', fontSize: 12 }}>Preview</button>
                    {t.format.map(fmt => (
                      <button key={fmt} onClick={() => handleDownload(t, fmt)} style={{ flex: 1, background: color, color: '#fff', fontWeight: 600, border: 'none', borderRadius: 8, padding: '0.5rem 0.75rem', cursor: 'pointer', fontSize: 12 }}>
                        {fmt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
