import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig({
  server: {},
  plugins: [
    react(),
    // so when you do npm run dev no crash occurs just tell you the error.
    {
      ...eslint({
        cache: true,
        failOnWarning: false,
        failOnError: false,
        exclude: ['/virtual:/**', '/node_modules/**']
      }),
      apply: 'serve',
      enforce: 'post'
    }
  ]
});
