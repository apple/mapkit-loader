/// <reference types="vite/client" />

declare const MAPKIT_TOKEN: string;

// Declaration for `.vue` files to typecheck Vue example project
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
