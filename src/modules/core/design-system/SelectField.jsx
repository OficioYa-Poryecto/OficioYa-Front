import ui from './ui.module.css';

function SelectField({ label, value, options, hint }) {
  return (
    <label className={ui.field}>
      <span className={ui.fieldLabel}>{label}</span>
      <span className={ui.inputShell}>
        <select defaultValue={value}>
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <span className={ui.selectArrow}>⌄</span>
      </span>
      {hint && <span className={ui.fieldHint}>{hint}</span>}
    </label>
  );
}

export default SelectField;
