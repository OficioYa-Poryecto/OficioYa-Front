import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/v1/auth': 'http://localhost:8081',
      '/api/v1/workers': 'http://localhost:8082',
      '/api/v1/trades': 'http://localhost:8082',
      '/api/v1/trade-categories': 'http://localhost:8082',
      '/api': 'http://localhost:8080',
    },
  },
})
