import { loadEnv, defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

process.env = { ...process.env, ...loadEnv("production", process.cwd()) };

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: ["uiara.tre-pb.jus.br"], // Permite acesso a esse domínio
  }
})
