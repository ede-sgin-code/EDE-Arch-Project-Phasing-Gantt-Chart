import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/EDE-Arch-Project-Phasing-Gantt-Chart/',
  plugins: [react()],
})
