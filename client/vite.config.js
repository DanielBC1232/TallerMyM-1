import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    fs: { strict: false },
    historyApiFallback: true,
    catch: {
      all: true,
      include: ['**/*'],
      exclude: ['node_modules/**', 'dist/**'],
    },
  },

})
