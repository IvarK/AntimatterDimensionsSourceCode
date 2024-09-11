import path from "path";

import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue2";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const STEAM = env.VITE_STEAM === "true";
  return {
    plugins: [vue()],
    base: "./",
    outDir: STEAM ? "../AppFiles" : "dist",
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "./src"),
      },
      extensions: [".js", ".vue"]
    },
  };
});