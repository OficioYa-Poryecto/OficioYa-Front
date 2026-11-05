   import react from '@vitejs/plugin-react'
   import { defineConfig } from 'vite'

   export default defineConfig({
     plugins: [react()],
     server: {
       proxy: {
         // Everything starting with /api is forwarded to the Spring Boot backend
         '/api': 'http://localhost:8080',
       },
     },
   })
