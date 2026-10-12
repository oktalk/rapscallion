<a id="readme-top"></a>

# rapscallion

A single-player dungeon-crawling card game for the browser, based on [Scoundrel](http://www.stfj.net/art/2011/Scoundrel.pdf) by Zach Gage and Kurt Bieg. You make your way through a shuffled deck four cards at a time, fighting monsters, drinking potions, and equipping shields. When your HP reaches zero you lose, and when the deck runs out you win.

**Play it:** [oktalk.github.io/rapscallion](http://oktalk.github.io/rapscallion)

Built with React 19 and Vite, and tested with Vitest, React Testing Library, and Cypress.

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#getting-started">Getting Started</a></li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#how-to-play">How to Play</a></li>
    <li><a href="#project-structure">Project Structure</a></li>
    <li><a href="#testing">Testing</a></li>
    <li><a href="#deployment">Deployment</a></li>
    <li><a href="#resources">Resources</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

## Getting Started

The game runs entirely in the browser, so you do not need a backend, a database, or any API keys. The steps below get a local copy running.

### Prerequisites

* Node.js 22.22.2 or later on Node 22, 24.15 or later on Node 24, or Node 26 and newer; the project is developed on Node 22
* npm, which ships with Node. To update it to the latest version:
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo:
   ```sh
   git clone https://github.com/oktalk/rapscallion.git
   cd rapscallion
   ```
2. Install the npm packages:
   ```sh
   npm install
   ```
3. If you are working from a fork, point your git remote at it to avoid accidental pushes to the original project:
   ```sh
   git remote set-url origin git@github.com:<your_username>/rapscallion.git
   git remote -v # confirm the change
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

Start the development server:

```sh
npm start
```

Then open [http://localhost:3000](http://localhost:3000). The page reloads automatically when you edit files under `src/`.

From the title screen you can choose one of four ways to play:

| Mode | Deck | Twist |
|---|---|---|
| **Standard Dungeon** | 48 cards | The basic rules |
| **Queen of Hearts** | 48 cards | No limit on how many potions you can drink in a room. HP is still capped at 21 |
| **King of Hearts** | 38 cards, diamonds removed | You start with a 7 shield that has no rank and never breaks, but you cannot run from a room |
| **Ace of Hearts** | 38 cards, hearts removed | Potions are gone, and you heal 3 HP at the start of every room |

Click **How To Play** on the title screen for an in-game rules summary, or **End game** during play to return to the title screen.

### Available scripts

| Command | What it does |
|---|---|
| `npm start` | Runs the dev server on port 3000 |
| `npm test` | Runs the Vitest unit tests in watch mode |
| `npm run test:coverage` | Runs the unit tests once and prints a coverage report |
| `npm run e2e` | Runs the Cypress end-to-end tests headlessly (requires the dev server to be running) |
| `npm run build` | Creates an optimized production build in `build/` |
| `npm run preview` | Serves the production build locally at http://localhost:3000/rapscallion/ |
| `npm run lint` | Runs ESLint with warnings treated as errors |
| `npm run deploy` | Builds the app and publishes `build/` to GitHub Pages |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## How to Play

You start with **21 HP**. Each room deals four cards, and you click a card to resolve it.

| Card | Role | Effect |
|---|---|---|
| ♠ Spades and ♣ Clubs (2–A) | Enemy | Deals damage equal to its value. Aces are worth 14 |
| Joker and Jack (shown as "I") | Boss | An enemy worth 21 |
| ♥ Hearts (2–J) | Potion | Heals its value, up to a maximum of 11, and HP cannot exceed 21. Only one potion works per room, and any extra potions are discarded with no effect |
| ♦ Diamonds (2–J) | Shield | Equips a shield worth its value (up to 11), replacing your current one |

**Shields and rank.** A shield reduces enemy damage by its value. The first enemy you defeat with a fresh shield sets the shield's **rank** to that enemy's value. From then on, the shield holds only against enemies whose value is equal to or lower than the current rank, and each one lowers the rank further. If you attack an enemy stronger than the rank, the shield absorbs what it can for that fight and then breaks.

**Moving on.** Once a single card remains in the room, **Next Room** becomes available. You can also **Run** to shuffle the whole room back into the dungeon and draw a new one, but you cannot run from two rooms in a row.

Defeating enemies earns XP equal to their value. Clear the entire dungeon to win.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Project Structure

```
src/
├── decks.js                 # Card lists for each game mode
├── index.js                 # React entry point
├── images/                  # SVG art for cards and the title screen
└── components/
    ├── App.js               # Holds all game state and the shuffle/deal/run logic
    ├── GameScene.js         # Picks the intro, room, or end-game scene
    ├── IntroScene.js        # Title screen and mode selection
    ├── RoomScene.js         # Stats, progress bar, controls, and the current room
    ├── EndGameScene.js      # Win/loss screen with "Play again?"
    ├── Room.js              # Routes each card to Enemy, Potion, or Shield by suit
    ├── Enemy.js             # Combat logic (calculateDamage, calculateShieldRank)
    ├── Potion.js            # Healing logic
    ├── Shield.js            # Shield equip logic
    ├── PlayerShield.js      # Displays the equipped shield and its rank
    └── Card.js              # Presentational card with pips and labels
cypress/e2e/home.cy.js       # End-to-end tests
```

All game state lives in the `App` component and flows down as props. Card components compute their effect and report it back through `updatePlayer`, then remove themselves from the room with `handleClick`. The combat rules are written as pure functions in `Enemy.js`, which keeps them easy to unit test.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Testing

Unit tests sit next to the components they cover (`*.test.jsx`) and run with Vitest and React Testing Library:

```sh
npm test
```

The end-to-end tests drive a real browser against the dev server, so start the app first and run Cypress from a second terminal:

```sh
npm start
# in another terminal
npm run e2e
```

To open the interactive Cypress runner instead, use `npx cypress open`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Deployment

The game is hosted on GitHub Pages at the URL set in the `homepage` field of `package.json`. To publish a new version:

```sh
npm run deploy
```

This builds the app and pushes the `build/` folder to the `gh-pages` branch.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Resources

* [Scoundrel rules](http://www.stfj.net/art/2011/Scoundrel.pdf), the original solo card game this project adapts
* [Game variant idea](https://boardgamegeek.com/thread/1805997/seems-be-almost-identical-scoundrel), a BoardGameGeek thread on a Scoundrel variant
* [Donsol](https://hundredrabbits.itch.io/donsol) by Hundred Rabbits, which inspired the design

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
