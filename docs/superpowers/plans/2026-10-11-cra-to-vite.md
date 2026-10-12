# CRA to Vite Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace `react-scripts` (Create React App) with Vite for the dev server and build, Vitest for unit tests, and a standalone ESLint flat config, while keeping every existing workflow (`npm start`, `npm test`, `npm run e2e`, `npm run deploy`) working the same way.

**Architecture:** Vite serves `index.html` from the repo root and bundles `src/index.jsx`. A single `vite.config.js` holds the React plugin, the GitHub Pages `base` path, the `build/` output directory, port 3000, and the Vitest `test` block. ESLint moves from ESLint 8 with the legacy `eslintConfig` key in `package.json` (extending `eslint-config-react-app`, an unmaintained CRA package) to ESLint 9 with `eslint.config.js`. The GitHub Actions workflows keep their existing steps; only comments that describe `react-scripts` behavior change.

**Tech Stack:** React 19, Vite, `@vitejs/plugin-react`, Vitest + jsdom, React Testing Library, ESLint 9 flat config, Cypress 14, `gh-pages`.

**Spec:** No separate spec document. Requirements are captured in Global Constraints below.

## Global Constraints

- Package manager is npm only. Commit `package-lock.json`; never run `yarn` or `pnpm`.
- Dev server must run on `http://localhost:3000` (Cypress `baseUrl` in `cypress.config.js` depends on it).
- Production build output directory stays `build/` (used by `gh-pages -d build` and `.gitignore`).
- Production assets must load under `/rapscallion/` (GitHub Pages URL `http://oktalk.github.io/rapscallion`). Dev server serves from `/`.
- Script names stay the same: `start`, `build`, `test`, `test:coverage`, `lint`, `e2e`, `predeploy`, `deploy`. New script allowed: `preview`.
- `npm run lint` must keep `--max-warnings=0`. CI (`.github/workflows/lint.yml`) runs it on every PR.
- CI (`.github/workflows/github-actions.yml`) runs `npm ci`, `CI=true npm test`, `CI=true npm run build`, and Cypress against `npm start` waiting on `http://localhost:3000`. Every one of those commands must keep working unchanged; `CI=true npm test` must run the suite once and exit.
- Baseline unit test result to preserve: **5 test suites, 21 tests, all passing.**
- Node version: Vite's `engines` field is the floor. Check with `npm view vite engines` before Task 1 and copy that value into docs in Task 4. The local machine runs Node 22.
- Files that contain JSX must use the `.jsx` extension. Vite does not parse JSX in `.js` files by default, and renaming is preferred over overriding the esbuild loader.
- Prose in docs: no em dashes.

## Before Starting

Work happens on branch `chore/vite-migration` in a git worktree branched from `origin/main` at `bb95940`.

## File Map

| File | Action | Responsibility |
|---|---|---|
| `index.html` (repo root) | Create (moved from `public/index.html`) | Vite HTML entry; loads `/src/index.jsx` |
| `public/index.html` | Delete | Replaced by root `index.html` |
| `vite.config.js` | Create | Vite + Vitest configuration |
| `src/index.js` | Rename to `src/index.jsx` | App entry |
| `src/components/*.js` (all 17 files) | Rename to `.jsx` | Components and their tests |
| `src/setupTests.js` | Modify | Load jest-dom matchers for Vitest |
| `setupTests.js` (repo root) | Delete | Stray duplicate of `src/setupTests.js`, never loaded by CRA |
| `.github/workflows/github-actions.yml` | Modify | Update comments that describe `react-scripts` behavior |
| `.github/pull_request_template.md` | Modify | Lint checklist item points at `npm run lint` |
| `src/components/{Card,Room,Enemy}.test.jsx` | Modify | `jest.fn()` to `vi.fn()` |
| `eslint.config.js` | Create | ESLint flat config |
| `package.json` | Modify | Scripts, dependencies, remove `eslintConfig` and `browserslist`, ESLint 8 to 9 |
| `README.md`, `CONTRIBUTING.md` | Modify | Update commands, Node version, lint instructions |

Files left untouched: `src/reportWebVitals.js` (the `web-vitals` dynamic import works in Vite), SVG imports in components (Vite's default import of an `.svg` returns a URL string, matching CRA's default export), `public/favicon.ico`, `public/manifest.json`, `public/robots.txt`, `public/apple-touch-icon.png` (Vite copies `public/` as-is), `cypress.config.js`, `cypress/`.

---

### Task 1: Serve and build the app with Vite

After this task, `npm start` and `npm run build` use Vite. `npm test` still uses `react-scripts test` temporarily (Jest under CRA handles `.jsx` files), so the unit suite acts as a regression check for the renames.

**Files:**
- Create: `index.html`, `vite.config.js`
- Delete: `public/index.html`
- Rename: `src/index.js` to `src/index.jsx`; every `src/components/*.js` to `.jsx`
- Modify: `package.json` (`scripts`, `devDependencies`)

**Interfaces:**
- Consumes: nothing.
- Produces: `vite.config.js` exporting `defineConfig(({ command }) => ({ ... }))`. Task 2 adds a `test` key to the returned object. Entry module path `/src/index.jsx`.

- [ ] **Step 1: Record the baseline**

Run: `CI=true npx react-scripts test --watchAll=false`
Expected: `Test Suites: 5 passed, 5 total` and `Tests: 21 passed, 21 total`.

- [ ] **Step 2: Install Vite**

```bash
npm install --save-dev vite @vitejs/plugin-react
```

Expected: both appear under `devDependencies` in `package.json`.

- [ ] **Step 3: Rename JSX files with git so history follows them**

```bash
git mv src/index.js src/index.jsx
for f in src/components/*.js; do git mv "$f" "${f%.js}.jsx"; done
```

Verify: `ls src/components` shows no `.js` files. No import paths need changing because none of them include a `.js` extension (confirmed with `grep -rn "from '.*\.js'" src`, which returns nothing), and Vite resolves `.jsx` automatically.

- [ ] **Step 4: Create `vite.config.js`**

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/rapscallion/' : '/',
  server: {
    port: 3000,
    strictPort: true,
  },
  preview: {
    port: 3000,
    strictPort: true,
  },
  build: {
    outDir: 'build',
  },
}));
```

`base` switches on `command` so the dev server (and Cypress) keep using `/`, while built asset URLs get the `/rapscallion/` prefix GitHub Pages needs. `strictPort` makes Vite fail loudly instead of silently moving to 3001, which would break Cypress.

- [ ] **Step 5: Move `index.html` to the repo root and adapt it**

```bash
git mv public/index.html index.html
```

Replace its contents with:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Rapscallion, a dungeon crawl card game" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/manifest.json" />
    <title>Rapscallion</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    <script type="module" src="/src/index.jsx"></script>
  </body>
</html>
```

Changes from the CRA version: `%PUBLIC_URL%` becomes `/` (Vite prefixes absolute URLs in `index.html` with `base` at build time), the module script tag is added explicitly, the CRA boilerplate comments are removed, and the apple-touch-icon now points at `apple-touch-icon.png`, which exists in `public/`, instead of the missing `logo192.png`. Keep the `<title>` and description as written above unless the README names the game differently.

- [ ] **Step 6: Update `package.json` scripts**

Change only these entries in `"scripts"`:

```json
"start": "vite",
"build": "vite build",
"preview": "vite preview",
```

Leave `test`, `test:coverage`, `e2e`, `eject`, `predeploy`, `deploy` as they are for now.

- [ ] **Step 7: Verify the unit tests still pass after the renames**

Run: `CI=true npm test -- --watchAll=false`
Expected: 5 suites, 21 tests passing.

- [ ] **Step 8: Verify the production build**

Run: `npm run build`
Expected: exits 0, writes `build/index.html` and `build/assets/*.js`, `build/assets/*.css`, and the SVGs as hashed files.

Run: `grep -o 'src="[^"]*"' build/index.html`
Expected: the script `src` starts with `/rapscallion/assets/`.

- [ ] **Step 9: Verify the dev server and E2E tests**

In one terminal run `npm start`. Expected: Vite reports `Local: http://localhost:3000/`.

In a second terminal run `npm run e2e`.
Expected: all specs in `cypress/e2e/home.cy.js` pass. If any fail, compare against the same spec run on `main` with CRA before changing code; a failure on both is pre-existing and out of scope.

Stop the dev server.

- [ ] **Step 10: Verify the built site under the Pages base path**

Run: `npm run preview`, then open `http://localhost:3000/rapscallion/`.
Expected: the intro scene renders with the queen, king, and ace card images, and the browser console shows no 404s. Stop the preview server.

- [ ] **Step 11: Commit**

```bash
git add -A index.html public vite.config.js src package.json package-lock.json
git commit -m "build: serve and build with Vite instead of react-scripts"
```

---

### Task 2: Run unit tests with Vitest and remove react-scripts

**Files:**
- Modify: `vite.config.js`, `src/setupTests.js`, `src/components/Card.test.jsx`, `src/components/Room.test.jsx`, `src/components/Enemy.test.jsx`, `package.json`, `.github/workflows/github-actions.yml`
- Delete: `setupTests.js` (repo root)

**Interfaces:**
- Consumes: `vite.config.js` from Task 1.
- Produces: Vitest globals (`describe`, `test`, `expect`, `vi`) available in every test file. Task 3's ESLint config declares these as globals for `**/*.test.jsx`.

- [ ] **Step 1: Install Vitest and jsdom**

```bash
npm install --save-dev vitest jsdom @vitest/coverage-v8
```

- [ ] **Step 2: Add the `test` block to `vite.config.js`**

Add this key to the object returned from `defineConfig`, after `build`:

```js
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
  },
```

`globals: true` keeps the existing test files working without adding `import { test, expect } from 'vitest'` to each one, which matches how they were written for Jest.

- [ ] **Step 3: Point the setup file at the Vitest entry of jest-dom**

Replace the contents of `src/setupTests.js` with:

```js
// jest-dom adds custom matchers for asserting on DOM nodes, for example:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 4: Delete the stray root setup file**

```bash
git rm setupTests.js
```

CRA only ever loaded `src/setupTests.js`, so this file has never run. The current `lint` script names `setupTests.js` explicitly, so remove that argument from the `lint` script in `package.json` in the same step:

```json
"lint": "eslint --max-warnings=0 src cypress cypress.config.js",
```

Task 3 rewrites this script again; this edit only keeps `npm run lint` from erroring on a missing file in the meantime.

- [ ] **Step 5: Switch test scripts to Vitest and see which tests fail**

In `package.json` `"scripts"`:

```json
"test": "vitest",
"test:coverage": "vitest run --coverage",
```

Run: `npx vitest run`
Expected: FAIL in `Card.test.jsx`, `Room.test.jsx`, and `Enemy.test.jsx` with `ReferenceError: jest is not defined`. `App.test.jsx` and `PlayerShield.test.jsx` pass.

- [ ] **Step 6: Replace `jest.fn()` with `vi.fn()`**

```bash
sed -i '' 's/jest\.fn(/vi.fn(/g' src/components/Card.test.jsx src/components/Room.test.jsx src/components/Enemy.test.jsx
```

Verify: `grep -rn "jest\." src` returns nothing.

- [ ] **Step 7: Run the full suite**

Run: `npx vitest run`
Expected: `Test Files  5 passed (5)` and `Tests  21 passed (21)`, matching the baseline.

Run: `npm run test:coverage`
Expected: same pass counts plus a coverage table.

Run: `CI=true npm test`
Expected: runs the suite once and exits 0 (Vitest disables watch mode when `CI` is set). This is the exact command CI uses.

- [ ] **Step 8: Remove react-scripts and tidy dependencies**

```bash
npm uninstall react-scripts
```

Then edit `package.json`:
- Delete the `"eject"` script.
- Delete the `"browserslist"` block. Vite ignores it; its default `build.target` already covers modern browsers.
- Move `@testing-library/dom`, `@testing-library/jest-dom`, `@testing-library/react`, and `@testing-library/user-event` from `dependencies` to `devDependencies` (they are only used by tests). Run `npm install` afterwards so the lockfile reflects the move.
- Leave the `"eslintConfig"` block and the ESLint dependencies for now; Task 3 replaces them.

Then update the comments in `.github/workflows/github-actions.yml`. Replace:

```yaml
      # CI=true makes react-scripts run the tests once instead of in watch mode,
      # and makes the build fail on lint warnings.
```

with:

```yaml
      # CI=true makes Vitest run the tests once instead of in watch mode.
      # Lint warnings are enforced by the separate Lint workflow.
```

Do not change any workflow steps.

- [ ] **Step 9: Re-verify everything still works without react-scripts**

Run: `npx vitest run`
Expected: 5 files, 21 tests passing.

Run: `CI=true npm run build`
Expected: exits 0.

Run: `npm run lint`
Expected: exits 0. `eslint-config-react-app` is a standalone package, so the old config should still load without `react-scripts`. If it fails only because test files now use `vi`, add `"globals": { "vi": "readonly" }` to the `eslintConfig` block as a stopgap; Task 3 replaces the whole config.

Run: `grep -rn "react-scripts" package.json .github`
Expected: no output.

- [ ] **Step 10: Commit**

```bash
git add -A vite.config.js src setupTests.js package.json package-lock.json .github/workflows/github-actions.yml
git commit -m "test: run unit tests with Vitest and remove react-scripts"
```

---

### Task 3: Move ESLint to version 9 with a flat config

The project lints with ESLint 8 and the legacy `eslintConfig` block in `package.json`, which extends `eslint-config-react-app` (CRA's lint preset, unmaintained) and `react-app/jest` (Jest-specific rules that no longer apply). ESLint 8 is end-of-life. This task moves to ESLint 9 and `eslint.config.js` while keeping `npm run lint` and its `--max-warnings=0` behavior, which CI enforces.

**Files:**
- Create: `eslint.config.js`
- Modify: `package.json` (`scripts.lint`, `devDependencies`, remove `eslintConfig`), `.github/pull_request_template.md`
- Possibly modify: any source file with a lint error surfaced in Step 4

**Interfaces:**
- Consumes: Vitest globals from Task 2 (`vi`, `describe`, `test`, `expect`, etc.).
- Produces: `npm run lint` (script name unchanged) used by `.github/workflows/lint.yml` and the docs in Task 4.

- [ ] **Step 1: Swap ESLint dependencies**

```bash
npm uninstall eslint-config-react-app
npm install --save-dev eslint@^9 @eslint/js@^9 globals eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-cypress@^4
```

`eslint-plugin-cypress` v4 supports ESLint 9 and exports its flat config from `eslint-plugin-cypress/flat`. Pin `eslint` and `@eslint/js` to v9 because ESLint 10, if released, may not yet be supported by every plugin. If `npm install` reports a peer dependency conflict, resolve it by choosing compatible versions; do not use `--force` or `--legacy-peer-deps`.

- [ ] **Step 2: Create `eslint.config.js`**

```js
import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import pluginCypress from 'eslint-plugin-cypress/flat';

export default [
  { ignores: ['build', 'coverage', 'node_modules'] },
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: { react: { version: 'detect' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.flat.recommended.rules,
      ...react.configs.flat['jsx-runtime'].rules,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/prop-types': 'off',
    },
  },
  {
    files: ['src/**/*.test.{js,jsx}', 'src/setupTests.js'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.vitest },
    },
  },
  {
    ...pluginCypress.configs.recommended,
    files: ['cypress/**/*.js'],
  },
  {
    files: ['*.config.js'],
    languageOptions: { globals: globals.node },
  },
];
```

Why each choice:
- `react/prop-types` is off because the codebase does not use PropTypes and `eslint-config-react-app` did not enforce them.
- The `jsx-runtime` rules turn off `react-in-jsx-scope`, since React 19 uses the automatic JSX runtime.
- `eslint-plugin-react`'s recommended set includes `jsx-uses-vars`, which stops core `no-unused-vars` from flagging components that are only referenced in JSX.
- Only the two classic hooks rules are enabled, matching what `eslint-config-react-app` enforced. Recent `eslint-plugin-react-hooks` versions add React Compiler rules to their `recommended` preset; adopting those is a separate decision.
- `cypress.config.js` uses CommonJS (`require`, `module.exports`). If ESLint reports parse or `no-undef` errors on it, add `sourceType: 'commonjs'` to the `*.config.js` block's `languageOptions` and lint `vite.config.js` and `eslint.config.js` with a separate `sourceType: 'module'` block.

- [ ] **Step 3: Update the script and remove the old config**

In `package.json`:
- Set `"lint": "eslint --max-warnings=0 ."`
- Delete the entire `"eslintConfig"` block.

- [ ] **Step 4: Run lint**

Run: `npm run lint`
Expected: exits 0 with no warnings. If it reports problems, fix each one in the source file it names. Do not disable or downgrade a rule to make a problem go away unless `eslint-config-react-app` also had that rule off or at a lower level; record any such case in the commit message.

- [ ] **Step 5: Update the PR template**

In `.github/pull_request_template.md`, replace:

```markdown
- [ ] There are no new lint warnings in the `npm start` output
```

with:

```markdown
- [ ] `npm run lint` passes with no warnings
```

Vite's dev server does not run ESLint, so the old checklist item no longer describes anything.

- [ ] **Step 6: Re-run the unit tests and build**

Run: `npx vitest run`
Expected: 5 files, 21 tests passing (guards against behavior changes from lint fixes).

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 7: Commit**

```bash
git add -A eslint.config.js package.json package-lock.json src cypress .github/pull_request_template.md
git commit -m "chore: move to ESLint 9 with a flat config"
```

---

### Task 4: Update docs and do a final end-to-end check

**Files:**
- Modify: `README.md`, `CONTRIBUTING.md`

**Interfaces:**
- Consumes: scripts from Tasks 1 to 3 (`start`, `build`, `preview`, `test`, `test:coverage`, `lint`, `e2e`, `deploy`).
- Produces: nothing.

- [ ] **Step 1: Find every CRA-specific statement in the docs**

Run: `grep -n "Create React App\|react-scripts\|Jest\|Node.js 18\|Node 18\|ESLint\|eject" README.md CONTRIBUTING.md`

- [ ] **Step 2: Update `README.md`**

Make these edits (line numbers are from `bb95940`; match on the text):
- Line 9: "Built with React 19 and Create React App, and tested with Jest, React Testing Library, and Cypress." becomes "Built with React 19 and Vite, and tested with Vitest, React Testing Library, and Cypress."
- Line 31: "Node.js 18 or newer" becomes the Vite floor recorded from `npm view vite engines` (for example, "Node.js 20.19 or newer"). Keep "(the project is developed on Node 22)".
- Line 82: "Runs the Jest unit tests in watch mode" becomes "Runs the Vitest unit tests in watch mode".
- In the same scripts table, add a row after `npm run build`: `| \`npm run preview\` | Serves the production build locally at http://localhost:3000/rapscallion/ |`. If the table has no `npm run lint` row, add `| \`npm run lint\` | Runs ESLint with warnings treated as errors |`.
- Line 137: "(`*.test.js`) and run with Jest and React Testing Library" becomes "(`*.test.jsx`) and run with Vitest and React Testing Library".

- [ ] **Step 3: Update `CONTRIBUTING.md`**

- Line 9: "Node.js 18 or newer" becomes the same Vite floor used in the README.
- Line 83: "The CI build treats lint warnings as errors." becomes "A separate Lint check runs `npm run lint`, which treats warnings as errors."
- Line 85: "**Unit tests** (Jest and React Testing Library) sit next to the components they cover as `*.test.js` files:" becomes "**Unit tests** (Vitest and React Testing Library) sit next to the components they cover as `*.test.jsx` files:"
- Line 110: replace the paragraph with: "The project uses ESLint with a flat config in `eslint.config.js`, including the Cypress plugin for files under `cypress/`. Run `npm run lint` and fix any errors or warnings before opening a PR; CI runs the same command. Beyond that, match the style of the surrounding code."

Then re-run `grep -n "Create React App\|react-scripts\|Jest\|Node.js 18\|npm start. output" README.md CONTRIBUTING.md .github` and confirm it returns nothing.

- [ ] **Step 4: Final verification from a clean install**

```bash
rm -rf node_modules build coverage
npm ci
npm run lint
CI=true npm test
CI=true npm run build
```

Expected: every command exits 0, and Vitest reports 5 files, 21 tests passing. These are the same commands CI runs.

Then run `npm start` in one terminal and `npm run e2e` in another. Expected: all Cypress specs pass.

- [ ] **Step 5: Commit**

```bash
git add README.md CONTRIBUTING.md
git commit -m "docs: update commands and requirements for Vite"
```

---

## Out of Scope

- **Deploying.** `npm run deploy` publishes to the live GitHub Pages site. Run it only after the branch is merged and the maintainer chooses to.
- **Adding new CI jobs.** The existing workflows already run lint, tests, build, and Cypress; this migration only keeps them working.
- **React Compiler lint rules** from newer `eslint-plugin-react-hooks` presets.
- **Upgrading `web-vitals`.** v2 still works; v3+ renames its exports (`getCLS` to `onCLS`) and would change `src/reportWebVitals.js`.
