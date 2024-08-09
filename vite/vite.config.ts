import { loadEnv, defineConfig } from 'vite'
import { ngrok } from 'vite-plugin-ngrok'
import react from '@vitejs/plugin-react'

process.env = { ...process.env, ...loadEnv("production", process.cwd()) };

const { NGROK_AUTH_TOKEN } = loadEnv("production", process.cwd(), "NGROK_AUTH_TOKEN")

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ngrok(NGROK_AUTH_TOKEN)
  ],
})
