import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Relative base so the build works whether it's served from a domain root
  // or from a GitHub Pages project path like /your-repo-name/.
  base: "./",
  server: {
    port: 5173,
  },
});
