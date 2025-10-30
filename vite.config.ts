import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const port = 5080;

  console.log(`http://${env.HOST}:${port}/tests/dev-server/index.html`);

  return {
    root: ".",
    server: {
      host: "0.0.0.0",
      allowedHosts: [env.HOST, "localhost"],
      port: port,
    },
    resolve: {
      alias: {
        "@apple/mapkit-loader": new URL("./src/", import.meta.url).pathname,
      },
    },
    define: {
      MAPKIT_TOKEN: `"${env.MAPKIT_TOKEN || "__TOKEN_PLACEHOLDER__"}"`,
    },
  };
});
