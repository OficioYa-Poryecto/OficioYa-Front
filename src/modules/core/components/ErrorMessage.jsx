
function ErrorMessage({ error }) {
    if (!error) {
    return null;
    }
    return <p role="alert" style={{ color: 'var(--color-danger)' }}>{error}</p>;
}

export default ErrorMessage;