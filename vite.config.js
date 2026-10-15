import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths"; // optional, for @ path alias

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    proxy: {
      "/erp-api": {
        target: "http://localhost:5000/api/v1",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/erp-api/, ""),
      },
    },
  },
});
