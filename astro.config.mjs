// @ts-check
import { defineConfig } from "astro/config";
import { fileURLToPath, URL } from "node:url";

import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  // used for canonical urls, og:url and the sitemap, so it has to be the live domain
  site: "https://p3dual.com",

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@assets": fileURLToPath(new URL("./src/assets", import.meta.url)),
      },
    },
  },

  integrations: [react(), sitemap()],
});
