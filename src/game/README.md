# Game rules (`src/game/`)

All game rules live here as pure functions with the shape
`(state, ...args) => newState`. Nothing in this folder imports React.
`App.jsx` holds the state and calls these functions inside `setState`.

## Layout

| File | Responsibility |
|---|---|
| `constants.js` | Shared numbers (`MAX_HP`, `MAX_CARD_VALUE`, `ROOM_SIZE`) |
| `decks.js` | Card data for each deck |
| `deck.js` | `shuffleCards`, `drawRoom`, `isSameCard` |
| `variants.js` | One entry per game mode / character |
| `effects/` | One file per card type, plus `index.js` to route a card to its effect |
| `dungeon.js` | Room flow: `newGame`, `run`, `nextRoom`, `deal`, `playCard` |
| `save.js` | Save and restore a run: pure `serializeRun` / `parseSavedRun` plus thin `localStorage` wrappers (`saveRun`, `loadRun`, `clearRun`) |
| `index.js` | Public API: re-exports what components need |

## Rules for this folder

- Never mutate inputs. Return new objects and arrays.
- Anything that shuffles takes `random = Math.random` as its last argument.
  Tests pass `() => 0.999999` to keep deck order, or `() => 0` for a known permutation.
- Every rule change ships with a unit test next to the file.

## Adding a card type

1. Create `effects/<name>.js` exporting `(state, card) => newState`, plus `effects/<name>.test.js`.
2. Map the suit in `cardType` and add the effect to `EFFECTS` in `effects/index.js`.
3. Add a component in `src/components/` and register it in `CARD_COMPONENTS` in `Room.jsx`.
4. Update `cardLabel` and the negative-value suit list in `src/components/Card.jsx` so the new card shows the right label.

## Adding a variant

1. Add a deck to `decks.js` if the variant needs one.
2. Add an entry to `VARIANTS` in `variants.js` and a test in `variants.test.js`.
3. Add a button in `src/components/IntroScene.jsx` that calls `startGame('<mode>')`.

## Writing a test for a rule bug

Build a state with only the fields that matter on top of `initialGameState`,
call the function, and assert on the result:

```js
import { initialGameState, playCard } from './index';

const card = (suit, number) => ({ suit, number });

test('a potion heals up to 21', () => {
  const potion = card('hearts', 7);
  const state = {
    ...initialGameState,
    gameScene: 'room',
    hp: 18,
    room: [potion, card('spades', 2)],
  };
  expect(playCard(state, potion).hp).toBe(21);
});
```

Tests marked `KNOWN BUG` in `dungeon.test.js` pin current, incorrect
behavior so the bug is visible. To fix one, change its assertion to the
correct behavior, watch it fail, then change the code until it passes.
