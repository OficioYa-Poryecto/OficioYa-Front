import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/v1/auth': {
        target: 'https://oficioya-orchestor-api-ghaxfaacfabxh4bv.chilecentral-01.azurewebsites.net',
        changeOrigin: true,
        secure: false,
      },
      '/api/v1/images': {
        target: 'https://oficioya-orchestor-api-ghaxfaacfabxh4bv.chilecentral-01.azurewebsites.net',
        changeOrigin: true,
        secure: false,
      },
      '/api/v1/workers': 'http://localhost:8082',
      '/api/v1/trades': 'http://localhost:8082',
      '/api/v1/trade-categories': 'http://localhost:8082',
      '/api': {
        target: 'https://oficioya-users-api-cmaxb7fphegvdwb3.chilecentral-01.azurewebsites.net',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
