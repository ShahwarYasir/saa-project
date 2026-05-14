export default function StatCard({ icon, label, value, color = 'var(--saa-gold)' }) {
  return (
    <div className="saa-stat-card" style={{ '--stat-color': color }}>
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <div className="stat-label mb-1">{label}</div>
          <div className="stat-value">{value}</div>
        </div>
        <div className="stat-icon" style={{ color }}>
          <i className={`bi ${icon}`}></i>
        </div>
      </div>
    </div>
  );
}
