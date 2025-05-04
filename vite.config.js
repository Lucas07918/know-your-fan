import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/pandascore': {
        target: 'https://api.pandascore.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/pandascore/, ''),
      },
      '/api/twitter': {
        target: 'https://api.twitter.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/twitter/, ''),
      },
    },
  },
});
