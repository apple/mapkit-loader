/**!
 *
 * Copyright (c) 2025 Apple Inc. Licensed under MIT License.
 */

import {
  renderHTMLAttributes,
  Map,
  MapKitLoaderOptions,
} from "@apple/mapkit-loader";

declare global {
  interface Window {
    mapKitLoaderOptions?: MapKitLoaderOptions;
  }
}

let map: Map;

document.getElementById("load-btn")!.addEventListener("click", e => {
  const button = e.target as HTMLButtonElement;
  button.classList.remove("loaded");
  button.classList.add("loading");

  try {
    const attributes = renderHTMLAttributes({
      token: MAPKIT_TOKEN,
      language: "en",
      libraries: ["map", "services"],
      ...window.mapKitLoaderOptions,
    });

    const scriptTag = document.createElement("script");
    for (const attr in attributes) {
      const value = attributes[attr];
      if (typeof value === "string") {
        scriptTag.setAttribute(attr, value);
      } else {
        if (value) {
          scriptTag.setAttribute(attr, "");
        }
      }
    }

    document.head.append(scriptTag);
  } finally {
    button.classList.remove("loading");
    button.classList.add("loaded");
  }
});

document.getElementById("init-btn")!.addEventListener("click", () => {
  if (map) {
    map.destroy();
  }

  map = new window.mapkit.Map("map", {
    region: new window.mapkit.CoordinateRegion(
      new window.mapkit.Coordinate(37.7749, -122.4194),
      new window.mapkit.CoordinateSpan(0.1, 0.1),
    ),
  });
});
