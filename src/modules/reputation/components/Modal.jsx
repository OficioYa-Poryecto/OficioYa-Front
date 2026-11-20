import { useEffect, useRef } from 'react';
import styles from './Modal.module.css';

// Diálogo centrado en computador y hoja inferior en celular.
function Modal({ titulo, alCerrar, children }) {
  const dialogo = useRef(null);

  useEffect(() => {
    dialogo.current.showModal();
  }, []);

  return (
    <dialog ref={dialogo} aria-label={titulo} className={styles.modal} onClose={alCerrar}>
      <h2>{titulo}</h2>
      {children}
    </dialog>
  );
}

export default Modal;
