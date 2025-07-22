import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    root: '.',
    build: {
      outDir: 'dist',
      rollupOptions: {
        input: './index.html'
      }
    },
    server: {
      port: 3000,
      host: '0.0.0.0'
    },
    define: {
      // Make sure environment variables are available at build time
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL || 'https://health-tourism-backend.onrender.com/api')
    }
  }
})
