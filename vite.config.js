import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/Agency/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        work: resolve(__dirname, 'work.html'),
        nav:  resolve(__dirname, 'nav.html'),
      }
    }
  }
})
