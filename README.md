# OficioYa · Front-end

Aplicación web de **OficioYa**, plataforma que conecta a personas que necesitan un servicio con trabajadores de oficios. Es un único front compartido por todos los squads; cada squad desarrolla el módulo de su dominio.

## Tecnologías

- React + Vite (JavaScript)
- React Router
- CSS Modules

## Requisitos

- Node.js 20.19 o superior (o 22.12 o superior)
- Backend de los servicios corriendo en `http://localhost:8080`

## Cómo ejecutarlo

```bash
npm install
npm run dev
```

La aplicación queda en `http://localhost:5173`. Todas las peticiones que empiezan por `/api` se reenvían al backend mediante el proxy de Vite (`vite.config.js`), por lo que no hay que configurar CORS.

Otros comandos:

```bash
npm run build     # compila para producción
npm run lint      # revisa el código con ESLint
```

## Estructura

Arquitectura por módulos: cada módulo agrupa todo lo de una funcionalidad del negocio.

```text
src/
├── assets/
├── modules/
│   ├── core/              # Piezas compartidas por todos los módulos
│   │   ├── components/
│   │   ├── design-system/
│   │   └── lib/           # httpClient: única puerta hacia la API
│   └── <domain>/          # Un módulo por dominio (worker, service, ...)
│       ├── components/
│       ├── hooks/
│       └── services/
├── App.jsx                # Rutas de la aplicación
├── index.css
└── main.jsx
```

Regla del equipo: un componente nunca llama a `fetch` directamente. Siempre usa un *service*, y todos los services usan `core/lib/httpClient.js`.
