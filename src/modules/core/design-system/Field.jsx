import Icon from './Icon';
import ui from './ui.module.css';

function Field({ label, placeholder, value, type = 'text', error, hint, locked, icon }) {
  const shellClass = `${ui.inputShell} ${error ? ui.inputError : ''} ${locked ? ui.inputLocked : ''}`;

  return (
    <label className={ui.field}>
      <span className={ui.fieldLabel}>{label}</span>
      <span className={shellClass}>
        {icon && <Icon name={icon} size={18} />}
        <input defaultValue={value} disabled={locked} placeholder={placeholder} type={type} />
        {type === 'password' && <Icon name="eye" size={18} />}
        {locked && <Icon name="lock" size={17} />}
      </span>
      {error && <span className={ui.errorText}>{error}</span>}
      {hint && <span className={ui.fieldHint}>{hint}</span>}
    </label>
  );
}

export default Field;
