import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api/daily-blog': {
        target: 'https://seahorse-app-doers.ondigitalocean.app',
        changeOrigin: true,
        secure: false,
      },
      '/api/ai-configs': {
        target: 'https://seahorse-app-doers.ondigitalocean.app',
        changeOrigin: true,
        secure: false,
      },
      '/api/ads': {
        target: 'https://seahorse-app-doers.ondigitalocean.app',
        changeOrigin: true,
        secure: false,
      },
      '/api/ad-configs': {
        target: 'https://seahorse-app-doers.ondigitalocean.app',
        changeOrigin: true,
        secure: false,
      },
      '/api/topics': {
        target: 'https://seahorse-app-doers.ondigitalocean.app',
        changeOrigin: true,
        secure: false,
      },
      '/api/subtopics': {
        target: 'https://seahorse-app-doers.ondigitalocean.app',
        changeOrigin: true,
        secure: false,
      },
      '/api/flashed-quizzes': {
        target: 'https://seahorse-app-doers.ondigitalocean.app',
        changeOrigin: true,
        secure: false,
      },
      '/api/story-based-learning': {
        target: 'https://seahorse-app-doers.ondigitalocean.app',
        changeOrigin: true,
        secure: false,
      },
      '/api/image-prompts': {
        target: 'https://seahorse-app-doers.ondigitalocean.app',
        changeOrigin: true,
        secure: false,
      },
      '/api/languages': {
        target: 'https://seahorse-app-doers.ondigitalocean.app',
        changeOrigin: true,
        secure: false,
      },
      '/api/user-login-config': {
        target: 'https://seahorse-app-doers.ondigitalocean.app',
        changeOrigin: true,
        secure: false,
      },
      '/api/quizzes': {
        target: 'https://seahorse-app-doers.ondigitalocean.app',
        changeOrigin: true,
        secure: false,
      },
      '/api/level-quizzes': {
        target: 'https://seahorse-app-doers.ondigitalocean.app',
        changeOrigin: true,
        secure: false,
      },
      '/api': {
        target: 'https://shark-app-l2rx4.ondigitalocean.app',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
