import { defineConfig } from 'vite';

export default defineConfig(({ command, mode }) => {
  // Get repository name from package.json or environment
  const repoName = 'siyam-ahmed-portfolio'; // Change this to your repo name
  
  return {
    base: command === 'build' ? `/${repoName}/` : '/',
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: true,
      rollupOptions: {
        input: {
          main: 'index.html'
        }
      }
    },
    server: {
      port: 3000,
      open: true,
      host: true
    },
    preview: {
      port: 8080,
      open: true
    }
  };
});