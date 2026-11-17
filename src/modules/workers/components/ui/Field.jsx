import Icon from './Icon';
import ui from './ui.module.css';

// Con onChange el campo es controlado; sin él conserva el valor inicial.
// required pinta el asterisco; prefix va pegado al inicio del input (por ejemplo "$").
function Field({
  label, placeholder, value, onChange, type = 'text', error, hint, locked, icon, min, max, step, maxLength,
  required = false, prefix, inputMode,
}) {
  const shellClass = `${ui.inputShell} ${error ? ui.inputError : ''} ${locked ? ui.inputLocked : ''}`;
  const valueProps = onChange
    ? { value, onChange: (event) => onChange(event.target.value) }
    : { defaultValue: value };

  return (
    <label className={ui.field}>
      <span className={ui.fieldLabel}>
        {label}
        {required && <span aria-hidden="true" className={ui.requiredMark}> *</span>}
      </span>
      <span className={shellClass}>
        {icon && <Icon name={icon} size={18} />}
        {prefix && <span className={ui.inputPrefix}>{prefix}</span>}
        <input
          {...valueProps}
          aria-invalid={error ? true : undefined}
          aria-required={required || undefined}
          disabled={locked}
          inputMode={inputMode}
          max={max}
          maxLength={maxLength}
          min={min}
          placeholder={placeholder}
          step={step}
          type={type}
        />
        {type === 'password' && <Icon name="eye" size={18} />}
        {locked && <Icon name="lock" size={17} />}
      </span>
      {error && <span className={ui.errorText}>{error}</span>}
      {hint && <span className={ui.fieldHint}>{hint}</span>}
    </label>
  );
}

export default Field;
