import { useLayoutEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../core/design-system/Button';
import { decodeRole } from '../../service/services/jwt';
import { tokenStorage } from '../../service/services/tokenStorage';
import { DETAILS_FORM_ID, SENT_STEP, STEPS, WORKERS_FORM_ID } from '../config';
import { useCreateRequest } from '../hooks/useCreateRequest';
import { EMPTY_FORM } from '../requestForm';
import '../theme.css';
import { BellIcon, ChevronLeftIcon, ChevronRightIcon } from './icons';
import RequestDetailsStep from './RequestDetailsStep';
import RequestStepper from './RequestStepper';
import ReviewStep from './ReviewStep';
import SentStep from './SentStep';
import WorkersStep from './WorkersStep';
import styles from './CreateRequestPage.module.css';

const CONTRACTOR_ROLE = 'CONTRATANTE';
const REVIEW = STEPS.length;
const SENT = STEPS.length + 1;
const THEME = 'azul';
const STEP_FORMS = { 1: DETAILS_FORM_ID, 2: WORKERS_FORM_ID };

function sendLabel(count) {
  return count === 1 ? 'Enviar al trabajador' : `Enviar a ${count} trabajadores`;
}

function CreateRequestPage() {
  const [token] = useState(() => tokenStorage.get());
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(EMPTY_FORM);
  const { sending, error: sendError, result, send, reset } = useCreateRequest(token);
  const role = decodeRole(token);

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = THEME;
    return () => {
      delete document.documentElement.dataset.theme;
    };
  }, []);

  if (!token) {
    return (
      <div className={styles.gate}>
        <section className={styles.notice}>
          <h1>Inicia sesión para crear una solicitud</h1>
          <p>Necesitas una sesión activa como contratante para enviar solicitudes de servicio.</p>
          <Link to="/solicitudes" className={styles.noticeLink}>
            Ir a iniciar sesión
          </Link>
        </section>
      </div>
    );
  }

  if (role !== CONTRACTOR_ROLE) {
    return (
      <div className={styles.gate}>
        <section className={styles.notice}>
          <h1>Solo los contratantes pueden crear solicitudes</h1>
          <p>Tu sesión actual tiene el rol {role || 'desconocido'}.</p>
          <Link to="/solicitudes" className={styles.noticeLink}>
            Ir a mis solicitudes
          </Link>
        </section>
      </div>
    );
  }

  const meta = step === SENT ? SENT_STEP : STEPS[step - 1];
  const canGoBack = step > 1 && step < SENT && !sending;
  const goBack = () => setStep((s) => Math.max(s - 1, 1));
  const goNext = () => setStep((s) => Math.min(s + 1, SENT));
  const updateForm = (patch) => setForm((current) => ({ ...current, ...patch }));
  const handleSend = async () => {
    if (await send(form)) {
      setStep(SENT);
    }
  };
  const restart = () => {
    reset();
    setForm(EMPTY_FORM);
    setStep(1);
  };

  const primaryAction =
    step === REVIEW
      ? { onClick: handleSend, disabled: sending }
      : { type: 'submit', form: STEP_FORMS[step] };
  const primaryLabel =
    step === REVIEW ? (sending ? 'Enviando…' : sendLabel(form.workers.length)) : meta.cta;
  const PrimaryIcon = step === REVIEW ? BellIcon : ChevronRightIcon;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button
          type="button"
          className={styles.back}
          onClick={goBack}
          disabled={!canGoBack}
          aria-label="Volver al paso anterior"
        >
          <ChevronLeftIcon />
        </button>
        <div className={styles.heading}>
          <p className="eyebrow">{meta.eyebrow}</p>
          <h1>{meta.title}</h1>
        </div>
      </header>

      <RequestStepper
        steps={STEPS}
        current={Math.min(step, STEPS.length)}
        progressLabel={meta.progressLabel}
      />

      <section className={styles.body}>
        {step === 1 && <RequestDetailsStep values={form} onChange={updateForm} onSubmit={goNext} />}
        {step === 2 && (
          <WorkersStep
            values={form}
            onChange={updateForm}
            onSubmit={goNext}
            onEditRequest={goBack}
          />
        )}
        {step === REVIEW && (
          <ReviewStep values={form} onEditWorkers={goBack} busy={sending} error={sendError} />
        )}
        {step === SENT && result && <SentStep values={form} result={result} />}
      </section>

      <footer className={styles.footer}>
        {step === SENT ? (
          <Button variant="secondary" onClick={restart}>
            {meta.cta}
          </Button>
        ) : (
          <Button {...primaryAction}>
            {primaryLabel}
            <PrimaryIcon size={18} />
          </Button>
        )}
      </footer>
    </div>
  );
}

export default CreateRequestPage;