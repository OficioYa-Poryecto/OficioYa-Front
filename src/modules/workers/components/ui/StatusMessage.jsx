import Icon from './Icon';
import ui from './ui.module.css';

function StatusMessage({ variant = 'success', className = '', children }) {
  return (
    <div className={`${ui.statusMessage} ${ui[variant]} ${className}`}>
      <span>{variant === 'success' ? <Icon name="check" size={16} /> : '!'}</span>
      <p>{children}</p>
    </div>
  );
}

export default StatusMessage;
