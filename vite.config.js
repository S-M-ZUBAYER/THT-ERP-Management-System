import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths' // optional, for @ path alias

export default defineConfig({
  plugins: [react(), tsconfigPaths()]
})
