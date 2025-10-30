# Testing

Add test files to `tests/e2e` folder.

Make sure your Playwright is setup locally, meaning you ran `npx playwright install --with-deps`.

Run all tests with `npm run test`.

If you have Playwright extension for VSCode you can run individual tests right from IDE.

## Debugging tests

Repo contains a launch configuration for Playwright UI with debug enabled. Open "Run" panel in VSCode, select "Playwright UI - Debug mode" and run it. It will launch Playwright UI tool where you can start individual tests and step through them exploring content of a webpage. It also configured to stop on IDE breakpoints.

## Structure notes

### `tests/dev-server`

Contains a test page for testing during development.

Access it by running `npm run start` which will open it automatically, or by running `npm run dev` and navigating to `http://localhost:5080/tests/dev-server/index.html`

If you have Playwright plugin for VSCode installed it might run that dev server in the background for quick test runs in IDE, so you might have the dev server running on a different port.

### `tests/playwright`

Contains setup scripts for Playwright and health check file for Playwrights test server.

### `tests/e2e`

Contains Playwright tests.

#### Integration tests

`examples.spec.ts` contains integration tests for popular frameworks from `/examples` folder. Each example setup implements a page with a map and a button to interact with MapKits API and navigate to another place without re-rendering the map DOM node.
