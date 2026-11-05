import { useRef, useState } from 'react';
import Boton from '../design-system/Boton';
import Field from '../design-system/Field';
import ui from '../design-system/ui.module.css';

const MAX_PHONES = 3;

function PhoneFields({ initialPhones = [''] }) {
  const [phones, setPhones] = useState(() =>
    initialPhones.map((value, id) => ({ id, value })),
  );
  const nextId = useRef(initialPhones.length);

  const addPhone = () => {
    setPhones([...phones, { id: nextId.current, value: '' }]);
    nextId.current += 1;
  };

  return (
    <div className={ui.phoneFields}>
      {phones.map((phone, index) => (
        <div className={ui.phoneRow} key={phone.id}>
          <Field
            label={index === 0 ? 'Teléfono principal' : `Teléfono alterno ${index}`}
            type="tel"
            value={phone.value}
          />
          {index > 0 && (
            <Boton
              className={ui.removePhone}
              onClick={() => setPhones(phones.filter((item) => item.id !== phone.id))}
              variant="ghost"
            >
              Quitar
            </Boton>
          )}
        </div>
      ))}
      <div className={ui.addField}>
        <span>{phones.length} de {MAX_PHONES} teléfonos agregados.</span>
        {phones.length < MAX_PHONES && (
          <Boton icon="plus" onClick={addPhone} variant="ghost">
            Agregar otro teléfono
          </Boton>
        )}
      </div>
    </div>
  );
}

export default PhoneFields;
