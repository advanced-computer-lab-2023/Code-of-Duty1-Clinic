import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import checker from 'vite-plugin-checker';
import dns from 'dns';
import dns from 'dns';

// ----------------------------------------------------------------------

dns.setDefaultResultOrder('verbatim');

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: /^~(.+)/,
        replacement: path.join(process.cwd(), 'node_modules/$1')
      },
      {
        find: /^src(.+)/,
        replacement: path.join(process.cwd(), 'src/$1')
      }
    ]
  },
  server: {
    open: true,
    host: 'localhost',
    port: 3030
  },
  preview: {
    open: true,
    host: 'localhost',
    port: 3030
  }
});
