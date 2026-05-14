export default function MultiSelect({ label, options = [], selected = [], onChange }) {
  const toggle = (val) => {
    if (selected.includes(val)) onChange(selected.filter(v => v !== val));
    else onChange([...selected, val]);
  };

  return (
    <div className="saa-form-group">
      <label>{label}</label>
      <div className="saa-multi-select">
        {options.map(opt => (
          <span key={opt} className={`tag ${selected.includes(opt) ? 'selected' : ''}`} onClick={() => toggle(opt)}>
            {opt}
            {selected.includes(opt) && <i className="bi bi-x-lg" style={{ fontSize: '0.6rem' }}></i>}
          </span>
        ))}
      </div>
    </div>
  );
}
