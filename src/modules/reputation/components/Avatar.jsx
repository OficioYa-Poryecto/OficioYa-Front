import { useState } from 'react';
import styles from './Avatar.module.css';

function iniciales(nombre) {
  return nombre.split(' ').slice(0, 2).map((parte) => parte[0]).join('').toUpperCase();
}

function Avatar({ nombre, foto, tamano = 52 }) {
  const [fotoFallida, setFotoFallida] = useState(false);
  const medidas = { width: tamano, height: tamano, fontSize: tamano * 0.34 };

  return (
    <span className={styles.avatar} style={medidas}>
      {foto && !fotoFallida ? (
        <img src={foto} alt="" onError={() => setFotoFallida(true)} />
      ) : (
        iniciales(nombre)
      )}
    </span>
  );
}

export default Avatar;
