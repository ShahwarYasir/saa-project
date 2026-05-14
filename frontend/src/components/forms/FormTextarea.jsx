export default function FormTextarea({ label, name, register, error, rows = 4, placeholder = '', ...props }) {
  return (
    <div className="saa-form-group">
      <label htmlFor={name}>{label}</label>
      <textarea id={name} className={`form-control ${error ? 'is-invalid' : ''}`} rows={rows} placeholder={placeholder} {...register(name)} {...props}></textarea>
      {error && <div className="invalid-feedback">{error.message}</div>}
    </div>
  );
}
