import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Dominio Worker (server.port=8082). Van antes de la regla general: gana la primera que coincide.
      // Provisional: llamado directo para probar; después se define con el equipo orquestador.
      '/api/v1/workers': 'http://localhost:8082',
      '/api/v1/trades': 'http://localhost:8082',
      '/api/v1/trade-categories': 'http://localhost:8082',
      // Everything else starting with /api is forwarded to the Spring Boot backend
      '/api': 'http://localhost:8080',
    },
  },
})
