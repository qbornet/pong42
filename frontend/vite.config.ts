import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import eslint from 'vite-plugin-eslint';
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    cors: true,
    proxy: {
      '/auth': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  },
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
  ],
  resolve: {
    alias: [
      {
        find: '@constant',
        replacement: path.resolve(__dirname, 'src/utils/constants.ts')
      },
      {
        find: '@img',
        replacement: path.resolve(__dirname, 'src/utils/images.ts')
      }
    ]
  }
});
