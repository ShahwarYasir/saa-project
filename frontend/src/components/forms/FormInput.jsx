export default function FormInput({ label, name, register, error, type = 'text', placeholder = '', ...props }) {
  return (
    <div className="saa-form-group">
      <label htmlFor={name}>{label}</label>
      <input id={name} type={type} className={`form-control ${error ? 'is-invalid' : ''}`} placeholder={placeholder} {...register(name)} {...props} />
      {error && <div className="invalid-feedback">{error.message}</div>}
    </div>
  );
}
