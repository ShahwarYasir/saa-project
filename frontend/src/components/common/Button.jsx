export default function Button({ children, variant = 'primary', size = '', className = '', loading = false, ...props }) {
  const variantClass = variant === 'gold' ? 'btn-saa-gold' : variant === 'outline' ? 'btn-saa-outline' : 'btn-saa-primary';
  return (
    <button className={`btn ${variantClass} ${size ? `btn-${size}` : ''} ${className}`} disabled={loading || props.disabled} {...props}>
      {loading ? <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Loading...</> : children}
    </button>
  );
}
