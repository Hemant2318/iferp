import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
  resolve: {
    alias: {
      components: "/src/components",
      store: "/src/store",
      assets: "/src/assets",
      "utils/helpers": "/src/utils/helpers",
      "utils/constants": "/src/utils/constants",
      services: "/src/services/api",
      routes: "/src/routes",
      pages: "/src/pages",
    },
  },
});
