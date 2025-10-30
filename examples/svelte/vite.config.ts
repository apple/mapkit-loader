import { defineConfig, loadEnv } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, "../../", "");
  const port = 5084;
  console.log(`http://${env.HOST}:${port}/tests/dev-server/index.html`);
  return {
    root: ".",
    plugins: [svelte()],
    define: {
      MAPKIT_TOKEN: `"${env.MAPKIT_TOKEN || "__TOKEN_PLACEHOLDER__"}"`,
    },
    server: {
      host: "0.0.0.0",
      allowedHosts: [env.HOST, "localhost"],
      port: port,
    },
  };
});
