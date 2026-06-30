import { cloudflare } from "@cloudflare/vite-plugin";
import mdx from "@mdx-js/rollup";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { remarkWordCount } from "./app/plugins/remarkWordCount";
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
    cloudflare({ configPath: "./wrangler.dev.toml" }),
    mdx({ remarkPlugins: [remarkFrontmatter, remarkGfm, remarkWordCount, remarkMdxFrontmatter] }),
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
