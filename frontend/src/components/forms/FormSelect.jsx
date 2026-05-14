export default function FormSelect({ label, name, register, error, options = [], placeholder = 'Select...', ...props }) {
  return (
    <div className="saa-form-group">
      <label htmlFor={name}>{label}</label>
      <select id={name} className={`form-select ${error ? 'is-invalid' : ''}`} {...register(name)} {...props}>
        <option value="">{placeholder}</option>
        {options.map(opt => (
          <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
            {typeof opt === 'string' ? opt : opt.label}
          </option>
        ))}
      </select>
      {error && <div className="invalid-feedback">{error.message}</div>}
    </div>
  );
}
