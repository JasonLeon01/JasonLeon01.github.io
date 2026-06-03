import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Assets live at /assets/; Ludork docs are static files under /Ludork/
  base: '/',
})
