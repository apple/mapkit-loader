/**!
 *
 * Copyright (c) 2025 Apple Inc. Licensed under MIT License.
 */

import { Map, renderToHTMLString } from "@apple/mapkit-loader";
import { test, expect } from "@playwright/test";

declare global {
  interface Window {
    map?: Map;
  }
}

test("should load and initialize MapKit", async ({ page }) => {
  const scriptString = renderToHTMLString({
    token: process.env.MAPKIT_TOKEN,
    language: "en",
    libraries: ["map", "services"],
  });

  await page.setContent(`
<!doctype html>
<html lang="en">
  <head>
    ${scriptString}
  </head>
  <body>
    <div id="map" style="width: 100%; height: 400px; margin-top: 20px"></div>
  </body>
</html>
`);

  await page.waitForSelector(
    `script[data-token="${process.env.MAPKIT_TOKEN}"]`,
    { state: "attached" },
  );

  await page.waitForFunction(() => !!window.mapkit);

  expect(await page.evaluate(() => window.mapkit.version)).toMatch(
    /5\.\d+\.\d+/,
  );

  expect(await page.evaluate(() => window.mapkit["loadedLibraries"])).toEqual([
    "map",
    "services",
  ]);

  await page.evaluate(() => {
    new window.mapkit.Map("map", {
      region: new window.mapkit.CoordinateRegion(
        new window.mapkit.Coordinate(37.7749, -122.4194),
        new window.mapkit.CoordinateSpan(0.1, 0.1),
      ),
    });
  });

  // wait for canvas to mount, this delay is required on some browsers
  await page.waitForSelector("#map canvas", { timeout: 5000 });

  const mapRoot = page.locator("#map");

  await expect(mapRoot.locator("canvas.rt-root")).toBeVisible();
});
