import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Saat backend Laravel jalan (php artisan serve -> :8000), request /api diteruskan ke sana
    proxy: {
      "/api": "http://127.0.0.1:8000",
    },
  },
});
