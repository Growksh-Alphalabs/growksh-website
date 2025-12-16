import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  // Provide a browser-friendly global for libraries that assume Node's `global`.
  define: {
    global: 'globalThis'
  },
  server: {
    // Proxy API calls during local development to the SAM/local backend.
    // Use `/api` as the proxy prefix so SPA routes under `/auth` are not forwarded to the API.
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
})