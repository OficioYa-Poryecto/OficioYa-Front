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
      '/api/v1/workers': {
        target: 'https://oficioya-orchestor-api-ghaxfaacfabxh4bv.chilecentral-01.azurewebsites.net',
        changeOrigin: true,
        secure: false,
      },
      '/api/v1/trades': {
        target: 'https://oficioya-orchestor-api-ghaxfaacfabxh4bv.chilecentral-01.azurewebsites.net',
        changeOrigin: true,
        secure: false,
      },
      '/api/v1/trade-categories': {
        target: 'https://oficioya-orchestor-api-ghaxfaacfabxh4bv.chilecentral-01.azurewebsites.net',
        changeOrigin: true,
        secure: false,
      },
      '/api/v1/search': {
        target: 'https://oficioya-orchestor-api-ghaxfaacfabxh4bv.chilecentral-01.azurewebsites.net',
        changeOrigin: true,
        secure: false,
      },
      '/api/v1/reputation': {
        target: 'https://oficioya-orchestor-api-ghaxfaacfabxh4bv.chilecentral-01.azurewebsites.net',
        changeOrigin: true,
        secure: false,
      },
      '/api/v1/reporting': {
        target: 'https://oficioya-orchestor-api-ghaxfaacfabxh4bv.chilecentral-01.azurewebsites.net',
        changeOrigin: true,
        secure: false,
      },
      '/api/v1/localities': {
        target: 'https://oficioya-orchestor-api-ghaxfaacfabxh4bv.chilecentral-01.azurewebsites.net',
        changeOrigin: true,
        secure: false,
      },
      '/api/v1/requests': {
        target: 'https://oficioya-orchestor-api-ghaxfaacfabxh4bv.chilecentral-01.azurewebsites.net',
        changeOrigin: true,
        secure: false,
      },
      '/api/v1/services': {
        target: 'https://oficioya-orchestor-api-ghaxfaacfabxh4bv.chilecentral-01.azurewebsites.net',
        changeOrigin: true,
        secure: false,
      },
      '/api/v1/notification': {
        target: 'https://oficioya-orchestor-api-ghaxfaacfabxh4bv.chilecentral-01.azurewebsites.net',
        changeOrigin: true,
        secure: false,
      },
      '/api': {
        target: 'https://oficioya-orchestor-api-ghaxfaacfabxh4bv.chilecentral-01.azurewebsites.net',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
