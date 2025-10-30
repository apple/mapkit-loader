import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, "../../", "");
  const port = 5082;
  console.log(`http://${env.HOST}:${port}/tests/dev-server/index.html`);
  return {
    root: ".",
    plugins: [react()],
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
