/**!
 *
 * Copyright (c) 2025 Apple Inc. Licensed under MIT License.
 */

import { MapKitLoaderOptions } from "@apple/mapkit-loader";
import { test, expect } from "@playwright/test";

declare global {
  interface Window {
    mapKitLoaderOptions?: MapKitLoaderOptions;
  }
}

const loadTestPage = "http://localhost:5080/tests/e2e/load.html";

test("should load and initialize MapKit", async ({ page }) => {
  await page.goto(loadTestPage);
  await page.waitForLoadState("networkidle");

  await page.locator("#load-btn").click();

  await expect(
    page.locator(`script[data-token="${process.env.MAPKIT_TOKEN}"]`),
  ).toBeAttached();

  await page.waitForSelector(`#load-btn.loaded`);

  expect(await page.evaluate(() => window.mapkit.version)).toMatch(
    /5\.\d+\.\d+/,
  );

  expect(await page.evaluate(() => window.mapkit["loadedLibraries"])).toEqual([
    "map",
    "services",
  ]);

  await page.locator("#init-btn").click();

  // wait for canvas to mount, this delay is required on some browsers
  await page.waitForSelector("#map canvas", { timeout: 5000 });

  const mapRoot = page.locator("#map");

  await expect(mapRoot.locator("canvas.rt-root")).toBeVisible();
});

test("should load mapkit library once when invoked sequentially", async ({
  page,
}) => {
  await page.goto(loadTestPage);
  await page.waitForLoadState("networkidle");

  let requestCount = 0;

  page.on("request", request => {
    if (
      request
        .url()
        .startsWith("https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.core.js")
    ) {
      requestCount++;
    }
  });

  await page.locator("#load-btn").click();
  await page.waitForSelector(`#load-btn.loaded`);

  expect(requestCount).toBe(1);

  await page.locator("#load-btn").click();
  await page.waitForSelector(`#load-btn.loaded`);

  expect(requestCount).toBe(1);
});

test("should load mapkit library once when invoked in parallel", async ({
  page,
}) => {
  await page.goto(loadTestPage);
  await page.waitForLoadState("networkidle");

  let requestCount = 0;

  page.on("request", request => {
    if (
      request
        .url()
        .startsWith("https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.core.js")
    ) {
      requestCount++;
    }
  });

  await page.locator("#load-btn").click();
  await page.locator("#load-btn").click();

  await page.waitForTimeout(1000);

  expect(requestCount).toBe(1);
});

test("should create only one script tag when invoked sequentially", async ({
  page,
}) => {
  await page.goto(loadTestPage);

  await page.locator("#load-btn").click();

  await page.waitForTimeout(1000);

  let mapkitScripts = await page
    .locator(`script[data-token="${process.env.MAPKIT_TOKEN}"]`)
    .count();

  expect(mapkitScripts).toBe(1);

  await page.locator("#load-btn").click();

  await page.waitForTimeout(1000);

  mapkitScripts = await page
    .locator(`script[data-token="${process.env.MAPKIT_TOKEN}"]`)
    .count();

  expect(mapkitScripts).toBe(1);
});

test("should create only one script tag when invoked in parallel", async ({
  page,
}) => {
  await page.goto(loadTestPage);

  await page.locator("#load-btn").click();
  await page.locator("#load-btn").click();

  await page.waitForTimeout(1000);

  const mapkitScripts = await page
    .locator(`script[data-token="${process.env.MAPKIT_TOKEN}"]`)
    .count();

  expect(mapkitScripts).toBe(1);
});

test("should pass options", async ({ page }) => {
  await page.goto(loadTestPage);

  await page.evaluate(() => {
    window.mapKitLoaderOptions = {
      token: "YOUR_TOKEN",
      language: "es",
      libraries: ["lib1", "lib2"],
      version: "5.79.5",
      data: {
        value: "1",
      },
    };
  });

  await page.locator("#load-btn").click();
  await page.waitForSelector(`#load-btn.loaded`);

  const scriptSelector = [
    `script`,
    `[data-token="YOUR_TOKEN"]`,
    `[data-libraries="lib1,lib2"]`,
    `[src*="5.79.5"]`,
    `[data-value="1"]`,
  ].join("");

  await page.waitForSelector(scriptSelector, { state: "attached" });
});
