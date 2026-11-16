import ui from './ui.module.css';

function FormSection({ title, children }) {
  return (
    <div className={ui.formSection}>
      <h3>{title}</h3>
      {children}
    </div>
  );
}

export default FormSection;
