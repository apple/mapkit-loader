/**!
 *
 * Copyright (c) 2025 Apple Inc. Licensed under MIT License.
 */

/// <reference types="../../tests/vite.d.ts" />

import { load, type MapKit, type Map } from "@apple/mapkit-loader";

const centers: { name: string; latitude: number; longitude: number }[] = [
  {
    name: "San Francisco",
    latitude: 37.7749,
    longitude: -122.4194,
  },
  {
    name: "New York",
    latitude: 40.7128,
    longitude: -74.006,
  },
  {
    name: "Los Angeles",
    latitude: 34.0522,
    longitude: -118.2437,
  },
  {
    name: "Chicago",
    latitude: 41.8781,
    longitude: -87.6298,
  },
  {
    name: "Houston",
    latitude: 29.7604,
    longitude: -95.3698,
  },
];
let center = centers[0];

const mapElement = document.getElementById("map")!;
const placeName = document.getElementById("place-name")!;
const nextPlaceButton = document.getElementById("next-place-btn")!;

let map: Map | null = null;
let mapkit: MapKit | null = null;

async function init() {
  mapkit = await load({
    token: MAPKIT_TOKEN,
    language: "en",
    libraries: ["map", "services"],
  });

  map = new mapkit.Map(mapElement, {
    region: new mapkit.CoordinateRegion(
      new mapkit.Coordinate(center.latitude, center.longitude),
      new mapkit.CoordinateSpan(0.1, 0.1),
    ),
    showsCompass: mapkit.FeatureVisibility.Hidden,
  });

  placeName.innerText = center.name;
}

nextPlaceButton.addEventListener("click", () => {
  if (map && mapkit) {
    const centerIndex = (centers.indexOf(center) + 1) % centers.length;
    center = centers[centerIndex];

    map.setCenterAnimated(
      new mapkit.Coordinate(center.latitude, center.longitude),
      true,
    );
  }
  placeName.innerText = center.name;
});

init();
