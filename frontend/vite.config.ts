import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Plugin para remover Console Ninja
const removeConsoleNinjaPlugin = {
  name: 'remove-console-ninja',
  apply: 'serve',
  transformIndexHtml(html: string) {
    return html.replace(/<script[^>]*console-ninja[^>]*><\/script>/gi, '')
               .replace(/<script[^>]*src="[^"]*console-ninja[^"]*"[^>]*><\/script>/gi, '')
               .replace(/<!--[^>]*console-ninja[^>]*-->/gi, '');
  }
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    middlewareMode: false,
  },
  plugins: [
    react(),
    removeConsoleNinjaPlugin,
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    'process.env.VITE_DISABLE_CONSOLE_NINJA': 'true',
    '__CONSOLE_NINJA_DISABLED__': 'true',
  },
  optimizeDeps: {
    exclude: ['console-ninja'],
  },
}));
