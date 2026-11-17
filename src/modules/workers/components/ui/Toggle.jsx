import styles from './Toggle.module.css';

function Toggle({ checked, onChange, disabled = false, label }) {
  return (
    <div className={`${styles.row} ${disabled ? styles.disabled : ''}`}>
      <button
        aria-label={label}
        aria-pressed={checked}
        className={`${styles.toggle} ${checked ? styles.on : ''}`}
        disabled={disabled}
        onClick={onChange}
        type="button"
      >
        <span />
      </button>
      <span>{label}</span>
    </div>
  );
}

export default Toggle;
