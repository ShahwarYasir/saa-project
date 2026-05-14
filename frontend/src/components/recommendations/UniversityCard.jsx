import { formatCurrency, formatDate, getDeadlineStatus, daysUntil } from '../../utils/formatters';
import { COUNTRY_FLAGS } from '../../utils/constants';

export default function UniversityCard({ university, isSaved = false, onToggleSave }) {
  const deadlineStatus = getDeadlineStatus(university.application_deadline);
  const days = daysUntil(university.application_deadline);

  return (
    <div className="saa-entity-card">
      <button className={`save-btn ${isSaved ? 'saved' : ''}`} onClick={() => onToggleSave?.(university.id)} title={isSaved ? 'Remove from shortlist' : 'Save to shortlist'}>
        <i className={`bi ${isSaved ? 'bi-heart-fill' : 'bi-heart'}`}></i>
      </button>

      <div className="d-flex flex-wrap gap-2 mb-3">
        <span className="card-badge badge-ranking"><i className="bi bi-trophy-fill"></i> #{university.ranking}</span>
        {university.match_score && <span className="card-badge badge-match"><i className="bi bi-bullseye"></i> {university.match_score}% Match</span>}
      </div>

      <h5 style={{ color: 'var(--saa-navy)', marginBottom: 'var(--saa-space-1)', paddingRight: '2rem' }}>{university.name}</h5>
      <p style={{ color: 'var(--saa-gray-500)', fontSize: 'var(--saa-font-size-sm)', marginBottom: 'var(--saa-space-3)' }}>
        {COUNTRY_FLAGS[university.country] || ''} {university.city}, {university.country}
      </p>

      <div className="d-flex flex-wrap gap-1 mb-3">
        {university.programs.map(p => (
          <span key={p} style={{ fontSize: 'var(--saa-font-size-xs)', background: 'var(--saa-gray-100)', padding: '2px 8px', borderRadius: 'var(--saa-radius-full)', color: 'var(--saa-gray-600)' }}>{p}</span>
        ))}
      </div>

      <div className="row g-2" style={{ fontSize: 'var(--saa-font-size-sm)' }}>
        <div className="col-6"><span style={{ color: 'var(--saa-gray-400)' }}>Tuition:</span> <strong>{formatCurrency(university.tuition_fee_usd)}</strong></div>
        <div className="col-6"><span style={{ color: 'var(--saa-gray-400)' }}>GPA:</span> <strong>{university.gpa_requirement}+</strong></div>
        <div className="col-6"><span style={{ color: 'var(--saa-gray-400)' }}>IELTS:</span> <strong>{university.ielts_requirement}+</strong></div>
        <div className="col-6">
          <span className={`card-badge badge-deadline`}>
            <i className="bi bi-calendar-event"></i>
            {deadlineStatus === 'passed' ? 'Closed' : `${days}d left`}
          </span>
        </div>
      </div>
    </div>
  );
}
