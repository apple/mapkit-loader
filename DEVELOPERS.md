# Setup

Run `npm run setup`. It will install all dependencies, setup git hooks and configure Playwright.

# Dev server

Run `npm run dev` to start a Vite dev server with mapkit loader example, it will open `tests/dev-server/index.html` with .

To have working map add your token to `MAPKIT_TOKEN` in `.env.local`

## Tests

Run tests via: `npm run test`.

To debug tests use `npm run test:e2e:debug`, pick a test and run it, it will open the browser window with test page and pause on first page interaction, at which point you will be able to step through actions in debugger window and inspect page at every step. You can open devtools on the page as usual, with `Inspect` menu or with `CMD+OPT+I` shortcut.
