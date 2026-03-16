import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0', // listen on all IPv4 addresses
    strictPort: true // fail instead of picking a new port silently
  },
  plugins: [react()],
  optimizeDeps: {
    include: ['moment', 'moment/locale/fr']
  }
})
