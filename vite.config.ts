import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// ===== ONE LINE TO CHANGE =====
const API_TARGET = 'https://pulmonary-broadband-taps.ngrok-free.dev'
// ===============================

function stripSecureFromCookie(proxyRes: any) {
  const setCookie = proxyRes.headers['set-cookie']
  if (setCookie) {
    proxyRes.headers['set-cookie'] = Array.isArray(setCookie)
      ? setCookie.map((c: string) => c.replace(/;\s*secure/gi, ''))
      : setCookie.replace(/;\s*secure/gi, '')
  }
}

function makeProxyConfig() {
  return {
    target: API_TARGET,
    changeOrigin: true,
    secure: false,
    headers: {
      'ngrok-skip-browser-warning': 'true',
    },
    configure: (proxy: any) => {
      proxy.on('proxyRes', stripSecureFromCookie)
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'payment-checkout',
      configureServer(server) {
        server.middlewares.use('/api/payment/checkout', async (req, res) => {
          if (req.method !== 'POST') {
            res.statusCode = 405
            res.end()
            return
          }

          const chunks: Buffer[] = []
          for await (const chunk of req) {
            chunks.push(chunk)
          }
          const body = Buffer.concat(chunks).toString()

          try {
            const backendRes = await fetch(`${API_TARGET}/pay/send`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
                cookie: req.headers.cookie || '',
              },
              body,
              redirect: 'manual',
            })

            const location = backendRes.headers.get('Location')

            res.setHeader('Content-Type', 'application/json')
            if (location) {
              res.end(JSON.stringify({ url: location }))
            } else {
              const text = await backendRes.text()
              res.end(JSON.stringify({ url: text || undefined }))
            }
          } catch (err) {
            res.statusCode = 502
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Payment service unavailable' }))
          }
        })
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  assetsInclude: ['**/*.svg', '**/*.csv'],

  server: {
    proxy: {
      '/api': makeProxyConfig(),
      '/pay': makeProxyConfig(),
      '/social': makeProxyConfig(),
    },
  },
})
