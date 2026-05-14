export default function Card({ title, children, className = '', headerRight = null }) {
  return (
    <div className={`saa-card ${className}`}>
      {title && (
        <div className="saa-card-header d-flex justify-content-between align-items-center">
          <span>{title}</span>
          {headerRight}
        </div>
      )}
      <div className="saa-card-body">{children}</div>
    </div>
  );
}
