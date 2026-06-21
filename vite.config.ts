import { cloudflare } from "@cloudflare/vite-plugin";
import mdx from "@mdx-js/rollup";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { iconsSpritesheet } from "vite-plugin-icons-spritesheet";
import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  resolve: {
    alias: {
      "~": resolve(__dirname, "app"),
    },
  },
  plugins: [
    cloudflare(),
    mdx({ remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter] }),
    reactRouter(),
    tailwindcss(),
    iconsSpritesheet({
      inputDir: "icons/svg-icons",
      outputDir: "public/icons",
      fileName: "sprite.svg",
      withTypes: true,
    }),
  ],
});
