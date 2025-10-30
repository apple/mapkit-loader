/**!
 *
 * Copyright (c) 2025 Apple Inc. Licensed under MIT License.
 */

/// <reference types="../../tests/vite.d.ts" />

import { mount } from "svelte";
import App from "./App.svelte";

const app = mount(App, {
  target: document.getElementById("root")!,
});

export default app;
