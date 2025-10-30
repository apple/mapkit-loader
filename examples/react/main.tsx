/**!
 *
 * Copyright (c) 2025 Apple Inc. Licensed under MIT License.
 */

/// <reference types="../../tests/vite.d.ts" />

import { StrictMode, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  load,
  type MapKit,
  type Map,
  type MapConstructorOptions,
} from "@apple/mapkit-loader";

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

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

function App() {
  const [center, setCenter] = useState(centers[0]);

  return (
    <>
      <h1>MapKit + React</h1>
      <h2>{center.name}</h2>
      <div className="card">
        <button
          id="next-place-btn"
          onClick={() => {
            const centerIndex = (centers.indexOf(center) + 1) % centers.length;
            setCenter(centers[centerIndex]);
          }}
        >
          Next place
        </button>
        <p></p>
      </div>
      <div>
        <AppleMap center={center} />
      </div>
    </>
  );
}

type Override<Base, Overrides extends object> = Omit<Base, keyof Overrides> &
  Overrides;

type AppleMapProps = Override<
  MapConstructorOptions,
  {
    center: { latitude: number; longitude: number };
    onMapReady?: (map: Map) => void;
  }
>;

const AppleMap = (props: AppleMapProps) => {
  const { center, onMapReady, ...mapOptions } = props;
  const mapNodeRef = useRef<HTMLDivElement>(null);
  const mapkitRef = useRef<MapKit>(null);
  const mapInstanceRef = useRef<Map>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(
    () => {
      // Initialize MapKit only once when component mounts
      const initializeMap = async () => {
        try {
          const mapkit = await load({
            token: MAPKIT_TOKEN,
            language: "en",
            libraries: ["map", "services"],
          });
          mapkitRef.current = mapkit;

          if (!mapInstanceRef.current && mapNodeRef.current) {
            const map = new mapkit.Map(mapNodeRef.current, {
              region: new mapkit.CoordinateRegion(
                new mapkit.Coordinate(center.latitude, center.longitude),
                new mapkit.CoordinateSpan(0.1, 0.1),
              ),
              showsCompass: mapkit.FeatureVisibility.Hidden,
              ...mapOptions,
            });

            mapInstanceRef.current = map;
            setIsMapReady(true);
            onMapReady?.(map);
          }
        } catch (error) {
          console.error("Failed to initialize MapKit:", error);
        }
      };

      initializeMap();

      // Cleanup function - destroy map when component unmounts
      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.destroy();
          mapInstanceRef.current = null;
          setIsMapReady(false);
        }
      };
    },
    // Empty dependency array ensures this runs only once
    [],
  );

  useEffect(() => {
    if (mapInstanceRef.current && mapkitRef.current) {
      const mapkit = mapkitRef.current;
      mapInstanceRef.current.setCenterAnimated(
        new mapkit.Coordinate(center.latitude, center.longitude),
        true,
      );
    }
  }, [center]);

  return (
    <div
      id="map"
      ref={mapNodeRef}
      style={{
        width: "100%",
        height: "400px",
        backgroundColor: "#f0f0f0",
      }}
      data-map-ready={isMapReady}
    />
  );
};
