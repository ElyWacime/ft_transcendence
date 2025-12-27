import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: true, // Listen on all network interfaces inside Docker
    port: 8080,
    allowedHosts: [
      "frontend", // container name inside Docker network
      "10.30.239.32",
      "127.0.0.1",
    ],
    watch: {
      usePolling: true, // ensures hot reload works inside Docker volumes
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean,
  ),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
