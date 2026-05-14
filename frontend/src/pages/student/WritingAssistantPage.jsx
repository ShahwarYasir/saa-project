import { useState, useContext } from 'react';
import { generateDocument, refineDocument } from '../../services/writingService';
import { ToastContext } from '../../context/ToastContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DocumentTypeSelector from '../../components/writing/DocumentTypeSelector';
import PromptContextForm from '../../components/writing/PromptContextForm';
import GeneratedDocumentEditor from '../../components/writing/GeneratedDocumentEditor';
import { DOCUMENT_TYPES } from '../../utils/constants';

export default function WritingAssistantPage() {
  const [step, setStep] = useState(1);
  const [docType, setDocType] = useState(null);
  const [generatedDoc, setGeneratedDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refining, setRefining] = useState(false);
  const toast = useContext(ToastContext);

  const handleTypeSelect = (type) => {
    setDocType(type);
    setStep(2);
  };

  const handleGenerate = async (formData) => {
    setLoading(true);
    try {
      const res = await generateDocument({ ...formData, document_type: docType });
      setGeneratedDoc(res.data);
      setStep(3);
    } catch (err) {
      toast.error(err.message || 'Failed to generate document');
    } finally {
      setLoading(false);
    }
  };

  const handleRefine = async (instructions) => {
    if (!generatedDoc) return;
    setRefining(true);
    try {
      const res = await refineDocument(generatedDoc.id, instructions);
      setGeneratedDoc(prev => ({ ...prev, content: res.data.content, word_count: res.data.word_count }));
      toast.success('Document refined successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to refine');
    } finally {
      setRefining(false);
    }
  };

  const docLabel = DOCUMENT_TYPES.find(d => d.id === docType)?.label || '';

  return (
    <DashboardLayout>
      <div className="page-container" style={{ maxWidth: 900, margin: '0 auto' }}>
        <div className="page-header">
          <h1>AI Writing Assistant</h1>
          <p>Generate professional application documents with AI assistance</p>
        </div>

        <div className="saa-step-indicator">
          <div className={`saa-step ${step >= 1 ? (step > 1 ? 'completed' : 'active') : ''}`}>
            <div className="saa-step-num">{step > 1 ? <i className="bi bi-check-lg"></i> : '1'}</div>
            <span style={{ fontSize: 'var(--saa-font-size-xs)', display: 'none' }}>Type</span>
          </div>
          <div className={`saa-step-line ${step > 1 ? 'completed' : ''}`}></div>
          <div className={`saa-step ${step >= 2 ? (step > 2 ? 'completed' : 'active') : ''}`}>
            <div className="saa-step-num">{step > 2 ? <i className="bi bi-check-lg"></i> : '2'}</div>
          </div>
          <div className={`saa-step-line ${step > 2 ? 'completed' : ''}`}></div>
          <div className={`saa-step ${step >= 3 ? 'active' : ''}`}>
            <div className="saa-step-num">3</div>
          </div>
        </div>

        {step === 1 && (
          <div>
            <h5 className="mb-3">Step 1: Choose Document Type</h5>
            <DocumentTypeSelector selected={docType} onSelect={handleTypeSelect} />
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="d-flex align-items-center gap-2 mb-3">
              <button className="btn btn-sm btn-saa-outline" onClick={() => setStep(1)}><i className="bi bi-arrow-left"></i></button>
              <h5 className="mb-0">Step 2: Provide Context for {docLabel}</h5>
            </div>
            <div className="saa-card">
              <div className="saa-card-body">
                <PromptContextForm onSubmit={handleGenerate} loading={loading} />
              </div>
            </div>
          </div>
        )}

        {step === 3 && generatedDoc && (
          <div>
            <div className="d-flex align-items-center gap-2 mb-3">
              <button className="btn btn-sm btn-saa-outline" onClick={() => setStep(2)}><i className="bi bi-arrow-left"></i></button>
              <h5 className="mb-0">Step 3: Your {docLabel}</h5>
            </div>
            <GeneratedDocumentEditor document={generatedDoc} onRefine={handleRefine} refining={refining} />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
