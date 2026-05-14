export default function EmptyState({ icon = 'bi-inbox', title = 'No data found', message = 'There is nothing to display here yet.', action = null }) {
  return (
    <div className="saa-empty-state">
      <i className={`bi ${icon}`}></i>
      <h5>{title}</h5>
      <p>{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
