import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from "fs";

export default defineConfig(({ mode }) => {
  const serverConfig: any = {
    host: true, 
    port: 5173,
    allowedHosts: [
      "frontend", 
      "localhost",
      process.env.DOMAIN || "localhost",
    ],
    watch: {
      usePolling: true,
    },
    hmr: {
      host: process.env.VITE_HMR_HOST || process.env.DOMAIN,
      protocol: process.env.VITE_HTTPS === "true" ? "wss" : "ws"
    }
  };

  // Add HTTPS support when USE_HTTPS is true
  if (process.env.VITE_HTTPS === "true") {
    try {
      serverConfig.https = {
        key: fs.readFileSync("/app/certs/private.key"),
        cert: fs.readFileSync("/app/certs/certificate.crt"),
      };
    } catch (err) {
      console.warn("Could not load HTTPS certificates:", err);
    }
  }

  return {
    server: serverConfig,
    plugins: [react(), mode === "development" && componentTagger()].filter(
      Boolean,
    ),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});

