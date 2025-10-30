import { loadEnv } from "vite";
import type { FullConfig } from "@playwright/test";

async function globalSetup(_config: FullConfig) {
  const env = loadEnv("development", ".", "");
  process.env = { ...process.env, ...env };
}

export default globalSetup;
