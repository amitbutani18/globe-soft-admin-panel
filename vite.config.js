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
          manualChunks: {
            // React and core libraries
            "react-vendor": [
              "react",
              "react-dom",
              "react-router-dom",
            ],
            // Query and HTTP
            "query-vendor": ["@tanstack/react-query", "axios"],
            // UI and State
            "ui-vendor": ["lucide-react", "zustand"],
            // Other utilities
            "utils-vendor": ["clsx", "tailwind-merge"],
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
