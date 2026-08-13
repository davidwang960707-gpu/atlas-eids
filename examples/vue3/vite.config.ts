import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      input: {
        showcase: resolve(import.meta.dirname, 'index.html'),
        knowledge: resolve(import.meta.dirname, 'knowledge.html'),
      },
    },
  },
})
