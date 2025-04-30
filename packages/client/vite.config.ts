import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '#': path.resolve(__dirname, './src'),
    },
  },
  css: {
    postcss: './postcss.config.js',
  },
  server: {
    host: '127.0.0.1',
    port: 3000,
    proxy: {
      '^/(xrpc|oauth|client-metadata\.json)/.*': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
