import { useState } from 'react';
import EditFormFooter from '../../core/components/EditFormFooter';
import EditNav from '../../core/components/EditNav';
import PhoneFields from '../../core/components/PhoneFields';
import ProfileHero from '../../core/components/ProfileHero';
import WorkInfoSections from './WorkInfoSections';
import Boton from '../../core/design-system/Boton';
import Field from '../../core/design-system/Field';
import FormSection from '../../core/design-system/FormSection';
import StatusMessage from '../../core/design-system/StatusMessage';
import ui from '../../core/design-system/ui.module.css';
import { useTrabajadores } from '../hooks/useTrabajadores';

const SECTIONS = ['Datos personales', 'Mi trabajo', 'Disponibilidad', 'Galería'];

function TrabajadorEditarPage() {
  const { trabajador } = useTrabajadores();
  const [hasContractorRole, setHasContractorRole] = useState(false);

  return (
    <div className={`${ui.page} ${ui.editPage}`}>
      <div className={ui.editHeading}>
        <div>
          <p className="eyebrow">Mi cuenta</p>
          <h1>Editar perfil</h1>
          <p>Mantén tus datos al día para que puedan encontrarte y contactarte.</p>
        </div>
        {!hasContractorRole && (
          <Boton icon="plus" onClick={() => setHasContractorRole(true)} variant="outline">
            Agregar rol de contratante
          </Boton>
        )}
      </div>
      {hasContractorRole && (
        <StatusMessage className={ui.roleAddedMessage}>
          <strong>Rol de contratante agregado.</strong> Puedes solicitar servicios usando
          la misma cuenta y tus datos personales actuales.
        </StatusMessage>
      )}
      <div className={ui.editLayout}>
        <EditNav items={SECTIONS} />
        <section className={`${ui.formCard} ${ui.editForm}`}>
          <ProfileHero
            editing
            initials={trabajador.initials}
            name={trabajador.name}
            roles={hasContractorRole ? ['Trabajador', 'Contratante'] : ['Trabajador']}
          />
          <FormSection title="Datos personales">
            <div className={ui.formGrid}>
              <Field label="Nombre completo" value={trabajador.name} />
              <Field
                hint="Por seguridad, el correo no se puede editar. Escríbenos si necesitas cambiarlo."
                label="Correo electrónico"
                locked
                value={trabajador.email}
              />
              <PhoneFields initialPhones={trabajador.phones} />
            </div>
          </FormSection>
          <WorkInfoSections about={trabajador.summary} zone={trabajador.zone} />
          <EditFormFooter cancelTo="/trabajador/perfil" />
        </section>
      </div>
    </div>
  );
}

export default TrabajadorEditarPage;
