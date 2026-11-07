/* global process, Buffer */
// Genera un JWT igual al que emite Identity (HS256, sub = id del usuario, claim "roles")
// y lo guarda en .env.local como VITE_ACCESS_TOKEN para que el front lo use.
// Uso (GitBash): JWT_SECRET="<mismo secreto del back>" node scripts/generar-token.js <idUsuario> <ROL[,ROL]>
import { createHmac } from 'node:crypto';
import { writeFileSync } from 'node:fs';

const [userId, roles] = process.argv.slice(2);
const secret = process.env.JWT_SECRET;
const HORAS_VALIDEZ = 8;

if (!secret || secret.length < 32) {
  console.error('Falta JWT_SECRET (mínimo 32 caracteres, el mismo del .env del back)');
  process.exit(1);
}
if (!userId || !roles) {
  console.error('Uso: node scripts/generar-token.js <idUsuario> <ROL[,ROL]>');
  process.exit(1);
}

const base64url = (texto) => Buffer.from(texto).toString('base64url');
const ahora = Math.floor(Date.now() / 1000);

const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
const payload = base64url(JSON.stringify({
  sub: userId,
  roles: roles.split(',').map((r) => r.trim().toUpperCase()),
  iat: ahora,
  exp: ahora + HORAS_VALIDEZ * 3600,
}));
const firma = createHmac('sha256', secret).update(`${header}.${payload}`).digest('base64url');
const token = `${header}.${payload}.${firma}`;

writeFileSync('.env.local', `VITE_ACCESS_TOKEN=${token}\n`);
console.log(`Token guardado en .env.local (válido ${HORAS_VALIDEZ} horas). Reinicia "npm run dev".`);
