import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    fs: { strict: false },
    historyApiFallback: true, // 👈 this line makes React Router handle all routes
    ignored: ["**/backend/**"]
  },
})
