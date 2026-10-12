# Game rules (`src/game/`)

All game rules live here as pure functions with the shape
`(state, ...args) => newState`. Nothing in this folder imports React.
`App.js` holds the state and calls these functions inside `setState`.

## Layout

| File | Responsibility |
|---|---|
| `constants.js` | Shared numbers (`MAX_HP`, `MAX_CARD_VALUE`, `ROOM_SIZE`) |
| `decks.js` | Card data for each deck |
| `deck.js` | `shuffleCards`, `drawRoom`, `isSameCard` |
| `variants.js` | One entry per game mode / character |
| `effects/` | One file per card type, plus `index.js` to route a card to its effect |
| `dungeon.js` | Room flow: `newGame`, `run`, `nextRoom`, `deal`, `playCard` |

## Rules for this folder

- Never mutate inputs. Return new objects and arrays.
- Anything that shuffles takes `random = Math.random` as its last argument.
  Tests pass `() => 0.999999` to keep deck order, or `() => 0` for a known permutation.
- Every rule change ships with a unit test next to the file.

## Adding a card type

1. Create `effects/<name>.js` exporting `(state, card) => newState`, plus `effects/<name>.test.js`.
2. Map the suit in `cardType` and add the effect to `EFFECTS` in `effects/index.js`.
3. Add a component in `src/components/` and register it in `CARD_COMPONENTS` in `Room.js`.

## Adding a variant

1. Add a deck to `decks.js` if the variant needs one.
2. Add an entry to `VARIANTS` in `variants.js` and a test in `variants.test.js`.
3. Add a button in `src/components/IntroScene.js` that calls `startGame('<mode>')`.

## Writing a test for a rule bug

Build a state with only the fields that matter on top of `initialGameState`,
call the function, and assert on the result:

```js
const next = playCard(
  { ...initialGameState, gameScene: 'room', dungeon, room: [lastCard], hp: 2 },
  lastCard
);
expect(next.gameState).toBe('Game over');
```

Tests marked `KNOWN BUG` in `dungeon.test.js` pin current, incorrect
behavior. When fixing one, flip its assertion to the correct behavior.
