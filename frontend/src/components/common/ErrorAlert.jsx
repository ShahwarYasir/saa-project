export default function ErrorAlert({ message = 'Something went wrong. Please try again.', onRetry = null }) {
  return (
    <div className="saa-error-alert">
      <i className="bi bi-exclamation-triangle-fill"></i>
      <div className="flex-grow-1">
        <strong>Error</strong>
        <p className="mb-0 mt-1">{message}</p>
      </div>
      {onRetry && <button className="btn btn-sm btn-outline-danger" onClick={onRetry}>Retry</button>}
    </div>
  );
}
