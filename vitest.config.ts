import { defineConfig } from "vitest/config";
import path from "node:path";
import { loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  console.log("Mode:", mode);
  console.log("OPENROUTER_API_KEY:", env.OPEN_ROUTER_API_KEY);

  Object.assign(process.env, env);

  return {
    test: {
      globals: true,
      testTimeout: 50000,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./"),
      },
    },
  };
});
