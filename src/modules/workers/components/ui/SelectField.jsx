import ui from './ui.module.css';

// options acepta textos u objetos { value, label }. Con onChange el campo es controlado.
// placeholder agrega una primera opción vacía ("Selecciona...") para obligar a elegir.
function SelectField({ label, value, options, onChange, hint, error, required = false, placeholder }) {
  const valueProps = onChange
    ? { value, onChange: (event) => onChange(event.target.value) }
    : { defaultValue: value };

  return (
    <label className={ui.field}>
      <span className={ui.fieldLabel}>
        {label}
        {required && <span aria-hidden="true" className={ui.requiredMark}> *</span>}
      </span>
      <span className={`${ui.inputShell} ${error ? ui.inputError : ''}`}>
        <select {...valueProps} aria-invalid={error ? true : undefined} aria-required={required || undefined}>
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => {
            const { value: optionValue, label: optionLabel } =
              typeof option === 'string' ? { value: option, label: option } : option;
            return <option key={optionValue} value={optionValue}>{optionLabel}</option>;
          })}
        </select>
        <span className={ui.selectArrow}>⌄</span>
      </span>
      {error && <span className={ui.errorText}>{error}</span>}
      {hint && <span className={ui.fieldHint}>{hint}</span>}
    </label>
  );
}

export default SelectField;
