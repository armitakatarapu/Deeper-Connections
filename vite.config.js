import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        home: 'home.html',
        evi: 'evi.html',
        about: 'about.html',
      }
    }
  }
})