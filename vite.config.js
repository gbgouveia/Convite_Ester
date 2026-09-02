import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Assegura caminhos relativos para funcionar perfeitamente no GitHub Pages
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
});
