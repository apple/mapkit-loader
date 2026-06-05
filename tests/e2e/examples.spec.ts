import { test, expect } from "@playwright/test";

const examplesData = [
  {
    framework: "Vanilla JS",
    url: "http://localhost:5081/",
  },
  {
    framework: "React",
    url: "http://localhost:5082/",
  },
  {
    framework: "Vue",
    url: "http://localhost:5083/",
  },
  {
    framework: "Svelte",
    url: "http://localhost:5084/",
  },
];

test.describe("MapKit integration suit", () => {
  examplesData.forEach(exampleData => {
    test.describe(exampleData.framework, () => {
      test.beforeEach(async ({ page }) => {
        await page.goto(exampleData.url);
        // wait for mapkit script to be added
        await page.waitForSelector(
          `script[data-token="${process.env.MAPKIT_TOKEN}"]`,
          {
            state: "attached",
          },
        );
        // wait for canvas to mount, this delay is required on some browsers
        await page.waitForSelector("#map canvas", { timeout: 5000 });
      });

      test(`should have jwt token injected ot set to placeholder`, async () => {
        expect(process.env.MAPKIT_TOKEN).not.toBe(undefined);
      });

      test(`should load and instantiate MapKit`, async ({ page }) => {
        expect(await page.evaluate(() => window.mapkit.version)).toMatch(
          /6\.\d+\.\d+/,
        );

        expect(
          await page.evaluate(() => window.mapkit["loadedLibraries"]),
        ).toEqual(["map", "services"]);

        const mapRoot = page.locator("#map");

        await expect(mapRoot.locator("canvas.rt-root")).toBeVisible();
      });

      test(`should not recreate map on reactive action`, async ({ page }) => {
        const uniqueId = Math.random().toString(36);
        await page.evaluate(id => {
          const element = document.querySelector("#map canvas");
          (element as any)._testId = id;
        }, uniqueId);

        const nextPlaceButton = page.locator("#next-place-btn");
        await nextPlaceButton.click();

        await page.waitForTimeout(1000);

        const hasOriginalProperty = await page.evaluate(id => {
          const element = document.querySelector("#map canvas");
          return (element as any)._testId === id;
        }, uniqueId);

        expect(hasOriginalProperty).toBe(true);
      });
    });
  });
});
