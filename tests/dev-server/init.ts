/**!
 *
 * Copyright (c) 2025 Apple Inc. Licensed under MIT License.
 */

import { load } from "@apple/mapkit-loader";

const output = document.getElementById("output")!;

function log(message: unknown) {
  console.log(message);
  output.innerHTML += `<p>${message}</p>`;
}

try {
  log("Starting MapKit loader test...");
  log(`Using token: ${MAPKIT_TOKEN}`);

  const mapkit = await load({
    token: MAPKIT_TOKEN,
    language: "en",
    libraries: ["map", "services"],
  });

  log("MapKit loaded successfully");
  log(`MapKit version: ${mapkit.version || "Unknown"}`);
  log(`Loaded libraries: ${mapkit.loadedLibraries?.join(", ") || "None"}`);

  new mapkit.Map("map", {
    region: new mapkit.CoordinateRegion(
      new mapkit.Coordinate(37.7749, -122.4194), // San Francisco
      new mapkit.CoordinateSpan(0.1, 0.1), // Zoom level
    ),
  });

  log("Map created successfully");
} catch (error: unknown) {
  log(`Error loading MapKit: ${String(error)}`);
  console.error("MapKit loading error:", error);
}
