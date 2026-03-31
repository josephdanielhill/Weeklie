import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'

const { version } = JSON.parse(readFileSync('./package.json', 'utf-8'))

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Allow overriding base via environment variable (e.g. VITE_BASE or BASE_URL)
  const envBase = process.env.VITE_BASE || process.env.BASE_URL;

  return {
    plugins: [react()],
    // Use env override if provided; otherwise default to '/' (custom domain serves from root)
    base: envBase ?? '/',
    define: {
      __APP_VERSION__: JSON.stringify(version),
    },
  };
});
