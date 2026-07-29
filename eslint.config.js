import { defineConfig } from "eslint/config";
import eslintPluginAstro from "eslint-plugin-astro";

export default defineConfig([
  {
    plugins: {
      eslintPluginAstro,
    },
  },
]);
