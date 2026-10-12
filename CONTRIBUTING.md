# Contributing to rapscallion

Thanks for helping out with rapscallion. This guide covers how to get a local copy running, how to pick up an issue, how to name branches and open pull requests, and what needs to pass before a PR can be merged.

Everyone who participates in this project is expected to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Setup

You need Node.js 18 or newer (the project is developed on Node 22) and npm, which ships with Node. The game runs entirely in the browser, so there is no backend, database, or API key to configure.

1. Fork the repository on GitHub, then clone your fork:
   ```sh
   git clone git@github.com:<your_username>/rapscallion.git
   cd rapscallion
   ```
2. Add the original repository as `upstream` so you can pull in new changes:
   ```sh
   git remote add upstream https://github.com/oktalk/rapscallion.git
   ```
3. Install dependencies. The project uses npm and commits `package-lock.json`, so please avoid `yarn` or `pnpm`, which would generate a different lockfile:
   ```sh
   npm install
   ```
4. Start the dev server and open [http://localhost:3000](http://localhost:3000):
   ```sh
   npm start
   ```

The [README](README.md#project-structure) has a map of the source tree and a short explanation of how game state flows through the components.

## Claiming an issue

To avoid two people building the same thing, please claim an issue before you start writing code.

1. Find an open issue that has no assignee. Issues labeled `good first issue` are a good place to start if you are new to the codebase.
2. Leave a comment on the issue saying you would like to work on it.
3. Wait for a maintainer to assign it to you before you start. If two people ask for the same issue, the first comment wins.
4. Work on one issue at a time. Once your PR for that issue is open, you are welcome to claim another.

If you can no longer work on an issue, comment to say so and it will be unassigned. If an assigned issue has no linked PR or progress update within **48 hours**, a maintainer may unassign it so someone else can pick it up.

If you want to work on something that does not have an issue yet, open one first using the bug report or feature request template, and wait for a maintainer to confirm it fits the project before you build it.

## Branches

Create a branch from an up-to-date `main` in your fork. Branch names use a type prefix, the issue number, and a short description in kebab-case:

```
<type>/<issue-number>-<short-description>
```

| Prefix | Use it for |
|---|---|
| `feature/` | New gameplay, modes, or UI |
| `fix/` | Bug fixes |
| `test/` | Adding or improving tests without changing behavior |
| `docs/` | README, guides, and comments |
| `chore/` | Dependencies, tooling, and configuration |

For example:

```sh
git checkout main
git pull upstream main
git checkout -b fix/42-shield-rank-resets
```

## Pull requests

* **One issue per PR.** Keep each PR focused on the issue it closes. Small, unrelated cleanups belong in a separate PR.
* **Link the issue.** Put `Closes #<issue-number>` in the PR description so the issue closes automatically when the PR merges.
* **Fill out the template.** The PR template asks what changed, how you tested it, and for screenshots of any visual change.
* **Write a clear title.** Use a short summary in the imperative mood, such as "Fix shield rank resetting after Run".
* **Stay up to date.** If `main` moves ahead while your PR is open, rebase or merge `main` into your branch and resolve any conflicts.
* **Open a draft early if you like.** A draft PR is a good way to get feedback before the work is finished.

PRs are squash-merged, so the PR title becomes the commit message on `main`. Individual commits on your branch can be as granular as you find useful.

At least one maintainer review is required before merging. Please respond to review comments by pushing new commits; there is no need to force-push or open a new PR.

## Tests must pass

Every PR must pass the full test suite before it can be merged. GitHub Actions runs the unit tests, a production build, and the Cypress tests on every PR, and `main` is protected so a PR cannot merge until those checks pass. The CI build treats lint warnings as errors. Run both suites locally before you request a review so you catch failures early.

**Unit tests** (Jest and React Testing Library) sit next to the components they cover as `*.test.js` files:

```sh
npm run test:coverage
```

This runs every unit test once and prints a coverage report. During development, `npm test` runs the same tests in watch mode.

**End-to-end tests** (Cypress) drive a real browser against the dev server, so start the app first and run Cypress from a second terminal:

```sh
npm start
# in another terminal
npm run e2e
```

When you change behavior, add or update tests to cover it:

* Combat, healing, and shield rules belong in unit tests. The combat logic in `src/components/Enemy.js` is written as pure functions (`calculateDamage`, `calculateShieldRank`) so it can be tested directly.
* User-facing flows, such as choosing a mode, clearing a room, or reaching the end screen, belong in `cypress/e2e/`. Select elements by test attributes rather than CSS classes. The existing code uses both `data-testid` and `data-test`; please use `data-testid` for anything new.

A PR that breaks existing tests, or that changes game behavior without test coverage, will be sent back for changes.

## Code style

The project uses the ESLint configuration that ships with Create React App, plus the Cypress plugin for files under `cypress/`. Lint errors appear in your terminal and browser while `npm start` is running; please fix them before opening a PR. Beyond that, match the style of the surrounding code.

## Questions

If something in this guide is unclear, or you are stuck on an issue, leave a comment on the issue and a maintainer will help.
