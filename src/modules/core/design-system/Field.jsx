import Icon from './Icon';
import ui from './ui.module.css';

// Con onChange el campo es controlado; sin él conserva el valor inicial.
function Field({ label, placeholder, value, onChange, type = 'text', error, hint, locked, icon, min, maxLength }) {
  const shellClass = `${ui.inputShell} ${error ? ui.inputError : ''} ${locked ? ui.inputLocked : ''}`;
  const valueProps = onChange
    ? { value, onChange: (event) => onChange(event.target.value) }
    : { defaultValue: value };

  return (
    <label className={ui.field}>
      <span className={ui.fieldLabel}>{label}</span>
      <span className={shellClass}>
        {icon && <Icon name={icon} size={18} />}
        <input
          {...valueProps}
          disabled={locked}
          maxLength={maxLength}
          min={min}
          placeholder={placeholder}
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
