# MapKit Loader

Loads Apple MapKit JS script dynamically from Apple MapKit CDN.
This package exposes the returned `mapkit` object with type definitions.

## Installation

Available via npm as the package `@apple/mapkit-loader`.

```shell
npm i @apple/mapkit-loader
```

## Documentation

For documentation on MapKit JS, see the [Apple MapKit JS Documentation](https://developer.apple.com/documentation/mapkitjs/).

## Example using MapKit JS Loader

```js
import { load } from "@apple/mapkit-loader";

const mapkit = await load({
  token: "YOUR_MAPKIT_TOKEN",
  language: "en-US",
  libraries: ["map", "annotations"],
});
```

The `load()` function returns a `Promise` that would resolve to the `mapkit` object.
The `await`ed `mapkit` object is available with `map` and `annotations` libraries loaded.

```js
const map = new mapkit.Map(container);
const annotation = new mapkit.MarkerAnnotation(new mapkit.Coordinate());
map.addAnnotation(annotation);
```

## Advanced server-side rendering integration

It is possible to generate a static `<script>` tag in server-side rendering,
and allows the `load()` call to "pick it up" later during application load.
Doing so starts loading MapKit JS bundles before the application loads.

See descriptions of `renderHTMLAttributes()` and `renderToHTMLString()` for details.
