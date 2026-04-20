import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Sanitizes environment variables to ensure compatibility with Vite's injection system.
 */
const sanitizeViteEnvKeys = () => {
  for (const key of Object.keys(process.env)) {
    if (!key.startsWith("VITE_")) {
      continue
    }
    const sanitizedKey = key.replace(/[^\w.]/g, "")
    if (sanitizedKey !== key) {
      if (process.env[sanitizedKey] === undefined) {
        process.env[sanitizedKey] = process.env[key]
      }
      delete process.env[key]
    }
  }
}

sanitizeViteEnvKeys()

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const targetURL = env.VITE_BASE_URL

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    css: {
      postcss: "./postcss.config.js",
    },
    server: {
      host: "0.0.0.0",
      port: 5173,
      open: true,
      strictPort: false,
      cors: true,
      proxy: {
        '/api': {
          target: targetURL,
          changeOrigin: true,
          secure: false,
        }
      }
    },
    resolve: {
      dedupe: ["react", "react-dom"],
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
                return 'react-vendor'
              }
              if (id.includes('@tanstack/react-query') || id.includes('axios')) {
                return 'query-vendor'
              }
              if (id.includes('lucide-react') || id.includes('zustand')) {
                return 'ui-vendor'
              }
              if (id.includes('clsx') || id.includes('tailwind-merge')) {
                return 'utils-vendor'
              }
            }
          },
        },
      },
      chunkSizeWarningLimit: 1500,
    },
    esbuild: {
      legalComments: "none",
    },
    optimizeDeps: {
      include: ["react", "react-dom"],
    },
  }
})
