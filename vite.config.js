import { defineConfig } from "vite";
import { createVuePlugin as vue } from "vite-plugin-vue2";

const path = require("path");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    extensions: [".mjs", ".js", ".ts", ".vue"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
