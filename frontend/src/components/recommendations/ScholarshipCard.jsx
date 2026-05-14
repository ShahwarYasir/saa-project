import { formatDate, daysUntil } from '../../utils/formatters';
import { COUNTRY_FLAGS } from '../../utils/constants';

export default function ScholarshipCard({ scholarship, isSaved = false, onToggleSave }) {
  const days = daysUntil(scholarship.deadline);

  return (
    <div className="saa-entity-card">
      <button className={`save-btn ${isSaved ? 'saved' : ''}`} onClick={() => onToggleSave?.(scholarship.id)} title={isSaved ? 'Remove from shortlist' : 'Save to shortlist'}>
        <i className={`bi ${isSaved ? 'bi-heart-fill' : 'bi-heart'}`}></i>
      </button>

      <div className="d-flex flex-wrap gap-2 mb-3">
        <span className="card-badge badge-funding"><i className="bi bi-cash-stack"></i> {scholarship.coverage}</span>
      </div>

      <h5 style={{ color: 'var(--saa-navy)', marginBottom: 'var(--saa-space-1)', paddingRight: '2rem' }}>{scholarship.name}</h5>
      <p style={{ color: 'var(--saa-gray-500)', fontSize: 'var(--saa-font-size-sm)', marginBottom: 'var(--saa-space-2)' }}>
        {scholarship.provider}
      </p>

      <p style={{ fontSize: 'var(--saa-font-size-sm)', marginBottom: 'var(--saa-space-3)' }}>
        {COUNTRY_FLAGS[scholarship.funding_country] || ''} {scholarship.funding_country}
      </p>

      <p style={{ fontSize: 'var(--saa-font-size-sm)', color: 'var(--saa-gray-600)', marginBottom: 'var(--saa-space-3)' }}>
        {scholarship.eligibility_summary}
      </p>

      <div style={{ fontSize: 'var(--saa-font-size-sm)' }} className="mb-3">
        <strong>Eligible:</strong> {scholarship.eligible_nationalities.join(', ')}
      </div>

      <div className="d-flex justify-content-between align-items-center">
        <span className={`card-badge ${days > 0 ? 'badge-deadline' : 'badge-match'}`}>
          <i className="bi bi-calendar-event"></i>
          {days > 0 ? `${days} days left` : 'Closed'}
        </span>
        <a href={scholarship.link} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-saa-outline">
          <i className="bi bi-box-arrow-up-right me-1"></i>Apply
        </a>
      </div>
    </div>
  );
}
