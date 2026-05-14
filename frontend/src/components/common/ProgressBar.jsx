export default function ProgressBar({ value = 0, label = '', showPercentage = true, className = '' }) {
  const clampedValue = Math.min(100, Math.max(0, value));
  return (
    <div className={className}>
      {(label || showPercentage) && (
        <div className="d-flex justify-content-between align-items-center mb-2">
          {label && <span style={{ fontSize: 'var(--saa-font-size-sm)', fontWeight: 'var(--saa-font-weight-medium)', color: 'var(--saa-gray-700)' }}>{label}</span>}
          {showPercentage && <span style={{ fontSize: 'var(--saa-font-size-sm)', fontWeight: 'var(--saa-font-weight-bold)', color: 'var(--saa-navy)' }}>{clampedValue}%</span>}
        </div>
      )}
      <div className="saa-progress">
        <div className="saa-progress-bar" style={{ width: `${clampedValue}%` }}></div>
      </div>
    </div>
  );
}
