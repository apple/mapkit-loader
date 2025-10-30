<!-- Copyright (c) 2025 Apple Inc. Licensed under MIT License. -->
<script lang="ts">
  import { onMount, onDestroy } from "svelte";
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

  let centerIndex = 0;
  let mapRef: HTMLDivElement;
  let map: Map | null = null;
  let mapkit: MapKit | null = null;

  $: center = centers[centerIndex];

  $: if (map && mapkit && center) {
    map.setCenterAnimated(
      new mapkit.Coordinate(center.latitude, center.longitude),
      true,
    );
  }

  function nextPlace() {
    if (map && mapkit) {
      centerIndex = (centerIndex + 1) % centers.length;
    }
  }

  onMount(async () => {
    try {
      mapkit = await load({
        token: MAPKIT_TOKEN,
        language: "en",
        libraries: ["map", "services"],
      });

      if (mapRef) {
        map = new mapkit.Map(mapRef, {
          region: new mapkit.CoordinateRegion(
            new mapkit.Coordinate(center.latitude, center.longitude),
            new mapkit.CoordinateSpan(0.1, 0.1),
          ),
          showsCompass: mapkit.FeatureVisibility.Hidden,
        });
      }
    } catch (error) {
      console.error("Failed to initialize MapKit:", error);
    }
  });

  onDestroy(() => {
    if (map) {
      map.destroy();
      map = null;
    }
  })
</script>

<h1>MapKit + Svelte</h1>
<h2>{center.name}</h2>
<div class="card">
  <button id="next-place-btn" on:click={nextPlace}>Next place</button>
  <p></p>
</div>
<div>
  <div
    id="map"
    bind:this={mapRef}
    style="width: 100%; height: 400px; background-color: #f0f0f0"
  ></div>
</div>
