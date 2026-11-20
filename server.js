import http from 'node:http';
import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, 'dist');
const PORT = process.env.PORT || 8080;

// Todas las llamadas /api/* del front se reenvian al orquestador, igual que el proxy de Vite en local.
// Asi el front sigue usando rutas relativas y el navegador no necesita CORS.
// Se puede cambiar con la variable API_URL en la configuracion del App Service.
const ORCHESTRATOR_URL = 'https://oficioya-orchestor-api-ghaxfaacfabxh4bv.chilecentral-01.azurewebsites.net';
const API_TARGET = new URL((process.env.API_URL || ORCHESTRATOR_URL).replace(/\/+$/, ''));

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ico': 'image/x-icon'
};

function proxyToApi(req, res) {
  const target = new URL(req.url, API_TARGET);
  const client = target.protocol === 'https:' ? https : http;
  // Se reenvian metodo, cabeceras (Authorization, Content-Type multipart...) y cuerpo tal cual
  const headers = { ...req.headers, host: target.host };

  const upstream = client.request(target, { method: req.method, headers }, (apiRes) => {
    res.writeHead(apiRes.statusCode, apiRes.headers);
    apiRes.pipe(res);
  });

  upstream.on('error', (error) => {
    console.error(`Error reenviando ${req.method} ${req.url} al orquestador:`, error.message);
    if (!res.headersSent) {
      res.writeHead(502, { 'Content-Type': 'application/json; charset=utf-8' });
    }
    res.end(JSON.stringify({ status: 502, error: 'Bad Gateway', message: 'No se pudo conectar con el servidor' }));
  });

  req.pipe(upstream);
}

const server = http.createServer((req, res) => {
  let urlPath;
  try {
    urlPath = decodeURIComponent(req.url.split('?')[0]);
  } catch {
    res.writeHead(400);
    return res.end('Bad Request');
  }

  if (urlPath.startsWith('/api/')) {
    return proxyToApi(req, res);
  }

  // Solo se sirven archivos que esten dentro de dist (evita rutas como /../server.js)
  const filePath = path.resolve(DIST, `.${urlPath}`);
  const insideDist = filePath === DIST || filePath.startsWith(DIST + path.sep);

  if (insideDist && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    return fs.createReadStream(filePath).pipe(res);
  }

  // Cualquier otra ruta es una pantalla de React (SPA): se entrega index.html
  const indexPath = path.join(DIST, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return fs.createReadStream(indexPath).pipe(res);
  }

  res.writeHead(404);
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`Servidor de frontend corriendo en el puerto ${PORT}; /api -> ${API_TARGET.origin}`);
});
