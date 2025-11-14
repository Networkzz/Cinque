import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// For GitHub Pages, update the base path to match your repository name
export default defineConfig({
  plugins: [react()],
  // Change 'Cinque' to your actual GitHub repository name
  base: process.env.NODE_ENV === 'production' ? '/Cinque/' : '/',
})


