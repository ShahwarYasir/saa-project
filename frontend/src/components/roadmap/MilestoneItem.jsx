import { formatShortDate } from '../../utils/formatters';
import { MILESTONE_STATUSES } from '../../utils/constants';

export default function MilestoneItem({ milestone, onStatusChange }) {
  const statusClass = milestone.status === 'Done' ? 'done' : milestone.status === 'In Progress' ? 'in-progress' : '';

  return (
    <div className={`saa-milestone ${statusClass}`}>
      <div className="flex-grow-1">
        <div className="d-flex justify-content-between align-items-start mb-1">
          <h6 style={{ margin: 0, color: 'var(--saa-navy)' }}>{milestone.title}</h6>
          <select
            className="form-select form-select-sm"
            style={{ width: 'auto', fontSize: 'var(--saa-font-size-xs)' }}
            value={milestone.status}
            onChange={e => onStatusChange(milestone.id, e.target.value)}
          >
            {MILESTONE_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <p style={{ fontSize: 'var(--saa-font-size-sm)', color: 'var(--saa-gray-500)', marginBottom: 'var(--saa-space-2)' }}>{milestone.description}</p>
        <div style={{ fontSize: 'var(--saa-font-size-xs)', color: 'var(--saa-gray-400)' }}>
          <i className="bi bi-calendar3 me-1"></i>Suggested: {formatShortDate(milestone.suggested_date)} • Deadline: {formatShortDate(milestone.deadline)}
        </div>
      </div>
    </div>
  );
}
