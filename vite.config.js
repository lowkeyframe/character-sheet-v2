import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT: doit correspondre au nom du repo GitHub pour un déploiement GitHub Pages correct
export default defineConfig({
  base: '/character-sheet-claude/',
  plugins: [react()],
})
