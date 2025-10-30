/**!
 *
 * Copyright (c) 2025 Apple Inc. Licensed under MIT License.
 */

import { load, Map, MapKit, MapKitLoaderOptions } from "@apple/mapkit-loader";

declare global {
  interface Window {
    mapKitLoaderOptions?: MapKitLoaderOptions;
  }
}

let mapkit: MapKit;
let map: Map;

document.getElementById("load-btn")!.addEventListener("click", async e => {
  const button = e.target as HTMLButtonElement;
  button.classList.remove("loaded");
  button.classList.add("loading");

  try {
    mapkit = await load({
      token: MAPKIT_TOKEN,
      language: "en",
      libraries: ["map", "services"],
      ...window.mapKitLoaderOptions,
    });
  } finally {
    button.classList.remove("loading");
    button.classList.add("loaded");
  }
});

document.getElementById("init-btn")!.addEventListener("click", () => {
  if (map) {
    map.destroy();
  }

  map = new mapkit.Map("map", {
    region: new mapkit.CoordinateRegion(
      new mapkit.Coordinate(37.7749, -122.4194),
      new mapkit.CoordinateSpan(0.1, 0.1),
    ),
  });
});
