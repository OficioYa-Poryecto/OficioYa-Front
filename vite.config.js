import process from 'node:process'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// Back de Worker desplegado en Azure App Service. Para usar uno local (server.port=8082),
// pon WORKER_API_URL=http://localhost:8082 en .env.development.local.
const WORKER_API_AZURE = 'https://oficioya-worker-api.azurewebsites.net'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const workerApi = { target: env.WORKER_API_URL || WORKER_API_AZURE, changeOrigin: true }

  return {
    plugins: [react()],
    server: {
      proxy: {
        // Dominio Worker. Van antes de la regla general: gana la primera que coincide.
        // Provisional: llamado directo para probar; después se define con el equipo orquestador.
        '/api/v1/workers': workerApi,
        '/api/v1/trades': workerApi,
        '/api/v1/trade-categories': workerApi,
        // Everything else starting with /api is forwarded to the Spring Boot backend
        '/api': 'http://localhost:8080',
      },
    },
  }
})
