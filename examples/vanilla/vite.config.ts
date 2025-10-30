import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, "../../", "");
  const port = 5081;
  console.log(`http://${env.HOST}:${port}/tests/dev-server/index.html`);
  return {
    root: ".",
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
