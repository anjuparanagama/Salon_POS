import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target:
          process.env.VITE_BACKEND_TARGET ||
          process.env.VITE_API_URL ||
          'https://sribees-gkbeajd5dzatf3gc.southeastasia-01.azurewebsites.net',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
