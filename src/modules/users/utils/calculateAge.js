// "AAAA-MM-DD"
export function calculateAge(birthDate) {
    const [anio, mes, dia] = birthDate.split('-').map(Number);
    const hoy = new Date();
    const yaCumplio = hoy.getMonth() + 1 > mes || (hoy.getMonth() + 1 === mes && hoy.getDate() >= dia);
    return hoy.getFullYear() - anio - (yaCumplio ? 0 : 1);
}