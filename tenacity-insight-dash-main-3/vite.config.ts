import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Removed lovable-tagger for production build

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],   // Only React plugin, no lovable
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
