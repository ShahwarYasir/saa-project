import { DOCUMENT_TYPES } from '../../utils/constants';

export default function DocumentTypeSelector({ selected, onSelect }) {
  return (
    <div className="row g-3">
      {DOCUMENT_TYPES.map(doc => (
        <div key={doc.id} className="col-md-6">
          <div
            className={`saa-card h-100`}
            style={{ cursor: 'pointer', border: selected === doc.id ? '2px solid var(--saa-gold)' : undefined, background: selected === doc.id ? 'var(--saa-gold-50)' : undefined }}
            onClick={() => onSelect(doc.id)}
          >
            <div className="saa-card-body text-center">
              <i className={`bi ${doc.icon}`} style={{ fontSize: '2rem', color: selected === doc.id ? 'var(--saa-gold)' : 'var(--saa-navy)' }}></i>
              <h6 className="mt-2 mb-1">{doc.label}</h6>
              <p style={{ fontSize: 'var(--saa-font-size-xs)', color: 'var(--saa-gray-500)', margin: 0 }}>{doc.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
