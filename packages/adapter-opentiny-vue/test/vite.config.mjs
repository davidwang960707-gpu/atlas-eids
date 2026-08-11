import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  resolve: { dedupe: ['vue'] },
  build: { outDir: 'dist', emptyOutDir: true, rollupOptions: { input: fileURLToPath(new URL('./fixture.html', import.meta.url)) } }
})
