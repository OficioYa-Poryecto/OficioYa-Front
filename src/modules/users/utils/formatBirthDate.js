const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto',
    'septiembre', 'octubre', 'noviembre', 'diciembre'];

// "AAAA-MM-DD" -> "20 de mayo de 1995". Sin new Date() para que la zona horaria no la corra un día (RF-01)
export function formatBirthDate(birthDate) {
    const [anio, mes, dia] = birthDate.split('-').map(Number);
    return `${dia} de ${MESES[mes - 1]} de ${anio}`;
}
