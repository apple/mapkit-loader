<!-- Copyright (c) 2025 Apple Inc. Licensed under MIT License. -->
<template>
  <h1>MapKit + Vue</h1>
  <h2>{{ center.name }}</h2>
  <div class="card">
    <button id="next-place-btn" @click="nextPlace">Next place</button>
    <p></p>
  </div>
  <div>
    <div
      id="map"
      ref="mapRef"
      style="width: 100%; height: 400px; background-color: #f0f0f0"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onUnmounted } from "vue";
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

const centerIndex = ref(0);
const center = computed(() => centers[centerIndex.value]);
const mapRef = ref<HTMLDivElement>();
let map: Map | null = null;
let mapkit: MapKit | null = null;

const nextPlace = () => {
  if (map && mapkit) {
    centerIndex.value = (centerIndex.value + 1) % centers.length;
  }
};

watch(
  center,
  newCenter => {
    if (map && mapkit) {
      map.setCenterAnimated(
        new mapkit.Coordinate(newCenter.latitude, newCenter.longitude),
        true,
      );
    }
  },
  { immediate: true },
);

watch(
  mapRef,
  async el => {
    if (el) {
      try {
        mapkit = await load({
          token: MAPKIT_TOKEN,
          language: "en",
          libraries: ["map", "services"],
        });

        if (mapRef.value) {
          map = new mapkit.Map(mapRef.value, {
            region: new mapkit.CoordinateRegion(
              new mapkit.Coordinate(
                center.value.latitude,
                center.value.longitude,
              ),
              new mapkit.CoordinateSpan(0.1, 0.1),
            ),
            showsCompass: mapkit.FeatureVisibility.Hidden,
          });
        }
      } catch (error) {
        console.error("Failed to initialize MapKit:", error);
      }
    } else {
      if (map) {
        map.destroy();
        map = null;
      }
    }
  },
  { flush: "post" },
);

onMounted(async () => {});

onUnmounted(() => {});
</script>
