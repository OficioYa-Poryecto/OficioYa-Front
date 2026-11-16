import Field from '../../core/design-system/Field';
import SelectField from '../../core/design-system/SelectField';
import { UNIDADES } from './formatos';

// Tarifa + unidad, iguales en crear perfil, agregar oficio y editar oficio.
function TarifaFields({ rate, unit, onRateChange, onUnitChange, rateError, unitError }) {
  return (
    <>
      <Field
        error={rateError}
        inputMode="decimal"
        label="Establecer tarifa"
        min={1}
        onChange={onRateChange}
        placeholder="80000"
        prefix="$"
        required
        step="any"
        type="number"
        value={rate}
      />
      <SelectField
        error={unitError}
        label="Unidad"
        onChange={onUnitChange}
        options={UNIDADES}
        required
        value={unit}
      />
    </>
  );
}

export default TarifaFields;
