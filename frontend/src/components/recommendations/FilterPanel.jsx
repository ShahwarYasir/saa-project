import { COUNTRIES, DEGREE_LEVELS, BUDGET_RANGES, COVERAGE_TYPES } from '../../utils/constants';

export default function FilterPanel({ type = 'universities', filters, onChange }) {
  const update = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <div className="saa-filter-panel">
      <h6><i className="bi bi-funnel-fill me-2"></i>Filters</h6>

      <div className="saa-form-group">
        <label>{type === 'universities' ? 'Country' : 'Funding Country'}</label>
        <select className="form-select form-select-sm" value={filters.country || filters.funding_country || ''} onChange={e => update(type === 'universities' ? 'country' : 'funding_country', e.target.value)}>
          <option value="">All Countries</option>
          {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="saa-form-group">
        <label>Degree Level</label>
        <select className="form-select form-select-sm" value={filters.degree_level || ''} onChange={e => update('degree_level', e.target.value)}>
          <option value="">All Levels</option>
          {DEGREE_LEVELS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {type === 'universities' && (
        <>
          <div className="saa-form-group">
            <label>Max Tuition (USD)</label>
            <select className="form-select form-select-sm" value={filters.max_tuition || ''} onChange={e => update('max_tuition', e.target.value)}>
              <option value="">Any Budget</option>
              {BUDGET_RANGES.map(b => <option key={b.label} value={b.max === Infinity ? '' : b.max}>{b.label}</option>)}
            </select>
          </div>
          <div className="saa-form-group">
            <label>Your GPA</label>
            <input type="number" className="form-control form-control-sm" step="0.1" min="0" max="4" placeholder="e.g. 3.5" value={filters.min_gpa || ''} onChange={e => update('min_gpa', e.target.value)} />
          </div>
          <div className="saa-form-group">
            <label>Program Search</label>
            <input type="text" className="form-control form-control-sm" placeholder="e.g. Computer Science" value={filters.program || ''} onChange={e => update('program', e.target.value)} />
          </div>
        </>
      )}

      {type === 'scholarships' && (
        <div className="saa-form-group">
          <label>Coverage Type</label>
          <select className="form-select form-select-sm" value={filters.coverage || ''} onChange={e => update('coverage', e.target.value)}>
            <option value="">All Types</option>
            {COVERAGE_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      )}

      <button className="btn btn-sm btn-saa-outline w-100 mt-2" onClick={() => onChange({})}>
        <i className="bi bi-x-circle me-1"></i>Clear Filters
      </button>
    </div>
  );
}
