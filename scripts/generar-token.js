/* global process, Buffer */
import { createHmac } from 'node:crypto';
import { writeFileSync } from 'node:fs';

const [userId, role] = process.argv.slice(2);
const secret = process.env.JWT_SECRET;
const VALID_HOURS = 8;

if (!secret) {
  console.error('Falta JWT_SECRET (el mismo secreto en Base64 del back)');
  process.exit(1);
}

const key = Buffer.from(secret, 'base64');

if (key.length < 32) {
  console.error('JWT_SECRET debe tener mínimo 32 bytes después de decodificarlo de Base64');
  process.exit(1);
}

if (!userId || !role) {
  console.error('Uso: node scripts/generar-token.js <idUsuario> <ROL[,ROL]>');
  process.exit(1);
}

const base64url = (text) => Buffer.from(text).toString('base64url');
const now = Math.floor(Date.now() / 1000);

const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
const payload = base64url(JSON.stringify({
  sub: userId,
  roles: role.split(',').map((r) => r.trim().toUpperCase()),
  iat: now,
  exp: now + VALID_HOURS * 3600,
}));
const signature = createHmac('sha256', key).update(`${header}.${payload}`).digest('base64url');
const token = `${header}.${payload}.${signature}`;

writeFileSync('.env.local', `VITE_ACCESS_TOKEN=${token}\n`);
console.log(`Token guardado en .env.local (válido ${VALID_HOURS} horas). Reinicia "npm run dev".`);
