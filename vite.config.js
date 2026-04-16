import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/PORR_Construct_Quiz/',
  build: {
    outDir: 'dist',
  },
});
