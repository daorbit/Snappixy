import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const cloudName = env.VITE_CLOUDINARY_CLOUD_NAME || 'your-cloud-name'

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/cloudinary': {
          target: `https://api.cloudinary.com/v1_1/${cloudName}`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/cloudinary/, ''),
        },
      },
    },
  }
})
