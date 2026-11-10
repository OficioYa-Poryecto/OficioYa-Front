import Field from '../../core/design-system/Field';
import FormSection from '../../core/design-system/FormSection';
import SelectField from '../../core/design-system/SelectField';
import ui from '../../core/design-system/ui.module.css';
import { useTrades } from '../hooks/useCatalogos';
import Gallery from './Gallery';
import ScheduleEditor from './ScheduleEditor';

function WorkInfoSections({ zone, about }) {
  const oficios = (useTrades().data ?? []).map((oficio) => oficio.name);

  return (
    <>
      <FormSection title="Información de trabajo">
        <div className={ui.formGrid}>
          <SelectField label="Oficio principal" options={oficios} value="Plomería" />
          <Field label="Oficios secundarios" value="Instalaciones, mantenimiento" />
          <Field icon="map" label="Barrio o zona de cobertura" value={zone} />
          <Field icon="coin" label="Tarifa aproximada (COP)" value="$ 80.000 por visita" />
        </div>
        <label className={`${ui.field} ${ui.fullField}`}>
          <span className={ui.fieldLabel}>Sobre mi trabajo</span>
          <textarea className={ui.textarea} defaultValue={about} />
        </label>
      </FormSection>
      <FormSection title="Disponibilidad semanal">
        <ScheduleEditor />
      </FormSection>
      <FormSection title="Galería de trabajos">
        <Gallery editable />
      </FormSection>
    </>
  );
}

export default WorkInfoSections;
