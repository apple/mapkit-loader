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

test("should load and initialize MapKit", async ({ page }) => {
  await page.goto(
    "http://localhost:5080/tests/e2e/render-html-attributes.html",
  );

  await page.evaluate(token => {
    window.mapKitLoaderOptions = {
      token: token,
      language: "es",
      libraries: ["map", "services", "overlays"],
      version: "5.79.x",
      data: {
        value: "1",
      },
    };
  }, process.env.MAPKIT_TOKEN);

  await page.locator("#load-btn").click();

  const scriptSelector = [
    `script`,
    `[data-token="${process.env.MAPKIT_TOKEN}"]`,
    `[data-libraries="map,services,overlays"]`,
    `[src*="5.79.x"]`,
    `[data-value="1"]`,
  ].join("");

  await page.waitForSelector(scriptSelector, { state: "attached" });
  await page.waitForTimeout(1000);

  expect(await page.evaluate(() => window.mapkit.version)).toMatch(
    /5\.\d+\.\d+/,
  );

  expect(await page.evaluate(() => window.mapkit["loadedLibraries"])).toEqual([
    "map",
    "services",
    "overlays",
  ]);

  await page.locator("#init-btn").click();

  // wait for canvas to mount, this delay is required on some browsers
  await page.waitForSelector("#map canvas", { timeout: 5000 });

  const mapRoot = page.locator("#map");

  await expect(mapRoot.locator("canvas.rt-root")).toBeVisible();
});
