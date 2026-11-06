import ui from './ui.module.css';

// options acepta textos u objetos { value, label }. Con onChange el campo es controlado.
function SelectField({ label, value, options, onChange, hint, error }) {
  const valueProps = onChange
    ? { value, onChange: (event) => onChange(event.target.value) }
    : { defaultValue: value };

  return (
    <label className={ui.field}>
      <span className={ui.fieldLabel}>{label}</span>
      <span className={`${ui.inputShell} ${error ? ui.inputError : ''}`}>
        <select {...valueProps}>
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
