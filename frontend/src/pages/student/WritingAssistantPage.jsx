import { useState, useContext } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { generateDocument, refineDocument } from '../../services/writingService';
import { ToastContext } from '../../context/ToastContext';

const DOC_TYPES = [
  { id: 'sop',        icon: '📄', label: 'Statement of Purpose',  sub: 'For graduate admissions' },
  { id: 'personal',  icon: '💼', label: 'Personal Statement',      sub: 'Undergraduate applications' },
  { id: 'motivation',icon: '💡', label: 'Motivation Letter',       sub: 'Scholarship applications' },
  { id: 'cover',     icon: '📋', label: 'Cover Letter',            sub: 'Job/internship applications' },
];

const TIPS_MAP = {
  sop: ['Start with a compelling hook about your academic journey','Clearly state your research interests and goals','Explain why this specific program and university','Highlight 2-3 significant academic achievements','End with a strong vision for your career'],
  personal: ['Be authentic — tell your unique story','Show growth and self-awareness','Connect past experiences to future goals','Avoid generic clichés','Proofread for grammar and tone'],
  motivation: ['Address why you need this scholarship','Quantify your achievements where possible','Show community impact and leadership','Align your goals with the scholarship mission','Keep it concise and well-structured'],
  cover: ['Open with enthusiasm for the specific role','Match your skills to the job requirements','Show you have researched the organization','Use concrete examples and metrics','Close with a clear call to action'],
};

const WORD_COUNT_OPTIONS = ['500','750','1000'];

function StepBadge({ n, active, done }) {
  return (
    <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, background: done ? 'var(--saa-success)' : active ? 'var(--saa-gold)' : '#E2E8F0', color: done || active ? '#fff' : 'var(--saa-text-muted)' }}>
      {done ? '✓' : n}
    </div>
  );
}

export default function WritingAssistantPage() {
  const toast = useContext(ToastContext);
  const [step, setStep] = useState(1);
  const [docType, setDocType] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [content, setContent] = useState('');
  const [docId, setDocId] = useState(null);

  const [formVals, setFormVals] = useState({ university: '', program: '', achievements: '', why: '', goals: '', wordCount: '750' });

  async function handleGenerate() {
    setGenerating(true);
    try {
      const res = await generateDocument({
        document_type: docType,
        target_university: formVals.university,
        target_program: formVals.program,
        achievements: formVals.achievements,
        why_university: formVals.why,
        career_goals: formVals.goals,
        word_count: Number(formVals.wordCount),
      });
      setContent(res.data.content);
      setDocId(res.data.id);
      setStep(3);
    } catch { toast?.error('Generation failed. Try again.'); }
    finally { setGenerating(false); }
  }

  async function handleRefine() {
    setGenerating(true);
    try {
      const res = await refineDocument(docId, 'Please refine and improve: ' + content);
      setContent(res.data.content);
      toast?.success('Document refined! ✨');
    } catch { toast?.error('Refinement failed.'); }
    finally { setGenerating(false); }
  }

  function handleCopy() { navigator.clipboard.writeText(content); toast?.success('Copied to clipboard!'); }

  function handleDownload() {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${docType || 'document'}.txt`; a.click();
    URL.revokeObjectURL(url);
    toast?.success('Downloaded as .txt!');
  }

  function wordCount(text) { return text.trim() ? text.trim().split(/\s+/).length : 0; }

  const tips = TIPS_MAP[docType] || TIPS_MAP.sop;

  return (
    <DashboardLayout pageTitle="Writing Assistant">
      {/* Amber Warning Banner */}
      <div style={{ background: 'linear-gradient(135deg,#FEF3C7,#FDE68A)', border: '1.5px solid #F59E0B', borderRadius: 12, padding: '0.875rem 1.25rem', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 18 }}>⚠️</span>
        <div style={{ fontSize: 13, color: '#92400E', fontWeight: 600 }}>
          AI-generated content — review and personalize before submission. Do not submit without editing.
        </div>
      </div>

      {/* Step Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
        {[{ n: 1, label: 'Choose Type' }, { n: 2, label: 'Provide Context' }, { n: 3, label: 'Review & Edit' }].map((s, i) => (
          <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <StepBadge n={s.n} active={step === s.n} done={step > s.n} />
            <span style={{ fontSize: 13, fontWeight: step === s.n ? 700 : 400, color: step === s.n ? 'var(--saa-navy)' : step > s.n ? 'var(--saa-success)' : 'var(--saa-text-muted)' }}>{s.label}</span>
            {i < 2 && <div style={{ width: 40, height: 2, background: step > s.n ? 'var(--saa-success)' : 'var(--saa-border)' }} />}
          </div>
        ))}
      </div>

      {/* STEP 1 — Choose Document Type */}
      {step === 1 && (
        <div>
          <h4 style={{ fontWeight: 700, color: 'var(--saa-navy)', marginBottom: 20 }}>Choose Document Type</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16, marginBottom: 24 }}>
            {DOC_TYPES.map(dt => (
              <button key={dt.id} onClick={() => setDocType(dt.id)} style={{
                padding: '1.75rem 1.5rem', background: '#fff', textAlign: 'left', cursor: 'pointer',
                border: `3px solid ${docType === dt.id ? 'var(--saa-gold)' : 'var(--saa-border)'}`,
                borderRadius: 16, transition: 'var(--saa-transition)',
                background: docType === dt.id ? 'rgba(245,166,35,0.06)' : '#fff',
              }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{dt.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 15, color: docType === dt.id ? 'var(--saa-gold)' : 'var(--saa-navy)', marginBottom: 4 }}>{dt.label}</div>
                <div style={{ fontSize: 12, color: 'var(--saa-text-muted)' }}>{dt.sub}</div>
              </button>
            ))}
          </div>
          {docType && (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setStep(2)} style={{ background: 'var(--saa-gradient-gold)', color: 'var(--saa-navy)', fontWeight: 700, padding: '0.75rem 2rem', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 14 }}>Next →</button>
            </div>
          )}
        </div>
      )}

      {/* STEP 2 — Provide Context */}
      {step === 2 && (
        <div className="saa-card" style={{ padding: '2rem' }}>
          <h4 style={{ fontWeight: 700, color: 'var(--saa-navy)', marginBottom: 20 }}>Provide Context</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            {[
              { key: 'university', label: 'Target University', placeholder: 'e.g. TU Munich' },
              { key: 'program', label: 'Target Program', placeholder: 'e.g. MSc Computer Science' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ fontWeight: 600, fontSize: 13, display: 'block', marginBottom: 6, color: 'var(--saa-text)' }}>{f.label}</label>
                <input value={formVals[f.key]} onChange={e => setFormVals(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder}
                  style={{ width: '100%', padding: '0.6rem 0.9rem', border: '1.5px solid var(--saa-border)', borderRadius: 8, fontSize: 14 }} />
              </div>
            ))}
          </div>
          {[
            { key: 'achievements', label: 'Your Key Achievements', placeholder: 'Describe 3 significant academic or professional achievements...' },
            { key: 'why', label: 'Why This University?', placeholder: 'What specifically attracts you to this institution?' },
            { key: 'goals', label: 'Career Goals', placeholder: 'Describe your short and long-term career goals...' },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: 16 }}>
              <label style={{ fontWeight: 600, fontSize: 13, display: 'block', marginBottom: 6, color: 'var(--saa-text)' }}>{f.label}</label>
              <textarea value={formVals[f.key]} onChange={e => setFormVals(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} rows={3}
                style={{ width: '100%', padding: '0.6rem 0.9rem', border: '1.5px solid var(--saa-border)', borderRadius: 8, fontSize: 14, resize: 'vertical' }} />
            </div>
          ))}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontWeight: 600, fontSize: 13, display: 'block', marginBottom: 6, color: 'var(--saa-text)' }}>Word Count Preference</label>
            <select value={formVals.wordCount} onChange={e => setFormVals(p => ({ ...p, wordCount: e.target.value }))} style={{ padding: '0.6rem 0.9rem', border: '1.5px solid var(--saa-border)', borderRadius: 8, fontSize: 14 }}>
              {WORD_COUNT_OPTIONS.map(w => <option key={w} value={w}>{w} words</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => setStep(1)} style={{ background: '#F1F5F9', color: 'var(--saa-text)', fontWeight: 600, padding: '0.75rem 1.5rem', border: 'none', borderRadius: 10, cursor: 'pointer' }}>← Back</button>
            <button onClick={handleGenerate} disabled={generating} style={{ background: 'var(--saa-gradient-gold)', color: 'var(--saa-navy)', fontWeight: 700, padding: '0.75rem 2rem', border: 'none', borderRadius: 10, cursor: 'pointer', opacity: generating ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: 8 }}>
              {generating ? <><span className="spinner-border spinner-border-sm" /> Generating...</> : 'Generate Document →'}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 — Review & Edit */}
      {step === 3 && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 16 }}>
            <div>
              <textarea value={content} onChange={e => setContent(e.target.value)} rows={20}
                style={{ width: '100%', padding: '1rem', border: '1.5px solid var(--saa-border)', borderRadius: 12, fontSize: 13, fontFamily: 'monospace', resize: 'vertical', minHeight: 400, lineHeight: 1.7 }} />
              <div style={{ fontSize: 12, color: 'var(--saa-text-muted)', marginTop: 6 }}>Word count: <strong>{wordCount(content)}</strong> words</div>
            </div>
            <div className="saa-card" style={{ padding: '1.5rem', alignSelf: 'flex-start' }}>
              <h6 style={{ fontWeight: 700, color: 'var(--saa-navy)', marginBottom: 14 }}>✨ Tips for {DOC_TYPES.find(d => d.id === docType)?.label || 'this document'}</h6>
              {tips.map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 10 }}>
                  <i className="bi bi-lightbulb-fill" style={{ color: 'var(--saa-gold)', fontSize: 12, marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--saa-text)', lineHeight: 1.5 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button onClick={() => setStep(2)} style={{ background: '#F1F5F9', color: 'var(--saa-text)', fontWeight: 600, padding: '0.7rem 1.25rem', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 13 }}>← Regenerate</button>
            <button onClick={handleCopy} style={{ background: 'var(--saa-navy)', color: '#fff', fontWeight: 600, padding: '0.7rem 1.25rem', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 13 }}>📋 Copy</button>
            <button onClick={handleDownload} style={{ background: '#F1F5F9', color: 'var(--saa-text)', fontWeight: 600, padding: '0.7rem 1.25rem', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 13 }}>💾 Download .txt</button>
            <button onClick={handleRefine} disabled={generating} style={{ background: 'var(--saa-gradient-gold)', color: 'var(--saa-navy)', fontWeight: 700, padding: '0.7rem 1.25rem', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 13, marginLeft: 'auto', opacity: generating ? 0.7 : 1 }}>
              {generating ? 'Refining...' : '✨ Refine with AI'}
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
