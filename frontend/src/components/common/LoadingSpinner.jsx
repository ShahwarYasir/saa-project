export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="saa-spinner-wrapper">
      <div className="saa-spinner"></div>
      <span style={{ color: 'var(--saa-gray-500)', fontSize: 'var(--saa-font-size-sm)' }}>{message}</span>
    </div>
  );
}
