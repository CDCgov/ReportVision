import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    exclude: ['./e2e', './e2e-examples', './playwright.config.ts'],
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
  },
  css: {
    preprocessorOptions: {
      scss: {
        includePaths: ["./node_modules/@uswds/uswds/packages"],
        quietDeps: true
      },
    },
  }
})
