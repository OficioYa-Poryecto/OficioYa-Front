import Field from './ui/Field';
import SelectField from './ui/SelectField';
import { UNITS } from './formats';

// Tarifa + unidad, iguales en crear perfil, agregar oficio y editar oficio.
function RateFields({ rate, unit, onRateChange, onUnitChange, rateError, unitError }) {
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
        options={UNITS}
        required
        value={unit}
      />
    </>
  );
}

export default RateFields;
