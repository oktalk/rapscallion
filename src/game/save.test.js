import { initialGameState, newGame, run, nextRoom, playCard } from './dungeon';
import { VARIANTS } from './variants';
import {
  SAVE_KEY,
  serializeRun,
  parseSavedRun,
  saveRun,
  loadRun,
  clearRun,
  checksum,
} from './save';

const card = (suit, number) => ({ suit, number });

// Builds a save with a valid checksum around any data, so tests can reach the
// field and rule checks with values serializeRun would never write.
const sign = (data) => {
  const run = JSON.stringify(data);
  return JSON.stringify({ run, sum: checksum(run) });
};
const savedFields = (json) => JSON.parse(JSON.parse(json).run);

const midRun = {
  ...initialGameState,
  dungeon: [card('clubs', 4), card('hearts', 9)],
  dungeonSize: 48,
  room: [card('spades', 7), card('diamonds', 3)],
  hp: 13,
  xp: 8,
  shield: 5,
  shieldRank: 7,
  potionDrank: true,
  progress: 2,
  retreat: false,
  isRoomComplete: false,
  roomsEntered: 11,
  timesRun: 2,
  gameScene: 'room',
  gameMode: 'standard',
  gameVariant: 'Basic game',
  modal: true,
  shieldImpact: { id: 3, kind: 'break', shield: 5, shieldRank: 7 },
};

const fakeStorage = (initial = {}) => {
  const data = { ...initial };
  return {
    data,
    getItem: (key) => (key in data ? data[key] : null),
    setItem: (key, value) => {
      data[key] = String(value);
    },
    removeItem: (key) => {
      delete data[key];
    },
  };
};

const throwingStorage = () => {
  const fail = () => {
    throw new Error('blocked');
  };
  return { getItem: fail, setItem: fail, removeItem: fail };
};

describe('serializeRun / parseSavedRun', () => {
  test('a saved run round-trips every field needed to resume the room', () => {
    const restored = parseSavedRun(serializeRun(midRun));

    expect(restored).toEqual({
      dungeon: midRun.dungeon,
      dungeonSize: 48,
      regenerate: 0,
      room: midRun.room,
      hp: 13,
      xp: 8,
      shield: 5,
      shieldRank: 7,
      potionDrank: true,
      potionLimit: true,
      breakableShield: true,
      progress: 2,
      retreat: false,
      isRoomComplete: false,
      roomsEntered: 11,
      timesRun: 2,
      gameVariant: 'Basic game',
      gameMode: 'standard',
      gameScene: 'room',
      gameState: '',
    });
  });

  test('UI-only state is not saved', () => {
    const saved = savedFields(serializeRun(midRun));

    expect(saved).not.toHaveProperty('modal');
    expect(saved).not.toHaveProperty('shieldImpact');
    expect(saved).not.toHaveProperty('gameScene');
  });

  test('serializing does not mutate the state', () => {
    const before = structuredClone(midRun);
    serializeRun(midRun);
    expect(midRun).toEqual(before);
  });

  test('extra unknown fields in a save are dropped', () => {
    const json = sign({ ...savedFields(serializeRun(midRun)), cheat: 99 });
    expect(parseSavedRun(json)).not.toHaveProperty('cheat');
  });

  test.each([
    ['text that is not JSON', '{oops'],
    ['JSON null', 'null'],
    ['a JSON number', '42'],
    ['an empty object', '{}'],
  ])('rejects %s', (_label, json) => {
    expect(parseSavedRun(json)).toBeNull();
  });

  const savedWith = (overrides) => sign({ ...savedFields(serializeRun(midRun)), ...overrides });

  test.each([
    ['a missing hp', { hp: undefined }],
    ['a string hp', { hp: '13' }],
    ['zero hp', { hp: 0 }],
    ['a missing room', { room: undefined }],
    ['an empty room', { room: [] }],
    ['a malformed card', { room: [{ suit: 'spades' }] }],
    ['a dungeon that is not an array', { dungeon: 'cards' }],
    ['a non-boolean retreat', { retreat: 'yes' }],
    ['a non-boolean potionDrank', { potionDrank: 1 }],
    ['an unknown game mode', { gameMode: 'cheater' }],
    ['a missing roomsEntered (saved before run stats)', { roomsEntered: undefined }],
    ['a missing timesRun (saved before run stats)', { timesRun: undefined }],
  ])('rejects a save with %s', (_label, overrides) => {
    expect(parseSavedRun(savedWith(overrides))).toBeNull();
  });
});

describe('save checksum', () => {
  test('a save stores the run alongside its checksum', () => {
    const save = JSON.parse(serializeRun(midRun));

    expect(Object.keys(save).sort()).toEqual(['run', 'sum']);
    expect(save.sum).toBe(checksum(save.run));
  });

  test('a run edited by hand no longer matches its checksum', () => {
    const save = JSON.parse(serializeRun(midRun));
    const edited = save.run.replace('"hp":13', '"hp":21');
    expect(edited).not.toBe(save.run);

    expect(parseSavedRun(JSON.stringify({ ...save, run: edited }))).toBeNull();
  });

  test('a changed checksum is rejected', () => {
    const save = JSON.parse(serializeRun(midRun));
    expect(parseSavedRun(JSON.stringify({ ...save, sum: '0' }))).toBeNull();
  });

  test.each([
    ['a save with no checksum', (save) => ({ run: save.run })],
    ['a save whose run is an object', (save) => ({ ...save, run: JSON.parse(save.run) })],
    ['an unsigned run in the old format', (save) => JSON.parse(save.run)],
  ])('rejects %s', (_label, reshape) => {
    const save = JSON.parse(serializeRun(midRun));
    expect(parseSavedRun(JSON.stringify(reshape(save)))).toBeNull();
  });

  test('a signed run that is not a JSON object is rejected', () => {
    expect(parseSavedRun(JSON.stringify({ run: '42', sum: checksum('42') }))).toBeNull();
    expect(parseSavedRun(JSON.stringify({ run: '{oops', sum: checksum('{oops') }))).toBeNull();
  });

  test('the checksum is deterministic and sensitive to every character', () => {
    expect(checksum('abc')).toBe(checksum('abc'));
    expect(checksum('abc')).not.toBe(checksum('abd'));
  });
});

describe('parseSavedRun rejects saves the game rules could not produce', () => {
  // A legal opening for any mode: six cards left in the dungeon, four in the room.
  const runFor = (mode, overrides = {}) => {
    const { deck, description, regenerate, potionLimit, breakableShield, startingShield } =
      VARIANTS[mode];
    return {
      ...initialGameState,
      dungeon: deck.slice(0, 6),
      room: deck.slice(6, 10),
      dungeonSize: deck.length,
      progress: 6,
      regenerate,
      potionLimit,
      breakableShield,
      shield: startingShield,
      roomsEntered: 1,
      gameVariant: description,
      gameMode: mode,
      ...overrides,
    };
  };
  const parse = (run) => parseSavedRun(serializeRun(run));

  test.each(Object.keys(VARIANTS))('accepts a legal %s run', (mode) => {
    expect(parse(runFor(mode))).not.toBeNull();
  });

  // Guards against a check that is too strict, which would silently throw
  // away a real player's save. Plays seeded random games the way the UI
  // allows (Run when enabled, Next Room when the room is complete).
  test('accepts every room reached in real play', () => {
    let seed = 42;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    for (const mode of Object.keys(VARIANTS)) {
      for (let game = 0; game < 50; game++) {
        let state = newGame(initialGameState, mode, random);
        while (state.gameScene === 'room') {
          expect(parse(state), JSON.stringify(state)).not.toBeNull();
          if (state.retreat && random() < 0.2) {
            state = run(state, random);
          } else if (state.isRoomComplete && random() < 0.5) {
            state = nextRoom(state, random);
          } else {
            state = playCard(state, state.room[Math.floor(random() * state.room.length)]);
          }
        }
      }
    }
  });

  test('accepts a shield equipped from a diamond that has been played', () => {
    expect(parse(midRun)).not.toBeNull();
  });

  test.each([
    ['a card that is not in any deck', { room: [card('hearts', 21)] }],
    ['the same card twice', { dungeon: [card('spades', 7)], progress: 1 }],
    ['more cards in the room than a room holds', {
      dungeon: [],
      progress: 0,
      room: [card('spades', 2), card('spades', 3), card('spades', 4), card('spades', 5), card('spades', 6)],
    }],
    ['a dungeon size that does not match the deck', { dungeonSize: 40 }],
    ['progress that does not match the dungeon', { progress: 30 }],
    ['a variant label from another mode', { gameVariant: 'No potion limit' }],
    ['regeneration in a mode without it', { regenerate: 3 }],
    ['no potion limit in a mode that has one', { potionLimit: false }],
    ['an unbreakable shield in a mode without one', { breakableShield: false }],
    ['a shield whose diamond is still in the room', { shield: 3 }],
    ['a shield stronger than any diamond', { shield: 12 }],
    ['a shield rank above the strongest enemy', { shieldRank: 22 }],
    ['a shield rank with no shield', { shield: 0, shieldRank: 4 }],
    ['negative xp', { xp: -5 }],
    ['fractional hp', { hp: 12.5 }],
    ['no rooms entered', { roomsEntered: 0, timesRun: 0 }],
    ['as many runs as rooms entered', { roomsEntered: 3, timesRun: 3 }],
  ])('rejects %s', (_label, overrides) => {
    expect(parse({ ...midRun, ...overrides })).toBeNull();
  });

  test("rejects a card from another mode's deck", () => {
    const [, ...rest] = VARIANTS.nohearts.deck.slice(6, 10);
    expect(parse(runFor('nohearts', { room: [card('hearts', 5), ...rest] }))).toBeNull();
  });

  test('rejects a used potion in a mode with no potion limit', () => {
    expect(parse(runFor('potions', { potionDrank: true }))).toBeNull();
  });

  test.each([
    ['a different shield value', { shield: 9 }],
    ['a shield rank', { shieldRank: 5 }],
  ])("rejects the King of Hearts' unbreakable shield with %s", (_label, overrides) => {
    expect(parse(runFor('noshields', overrides))).toBeNull();
  });
});

describe('saveRun / loadRun / clearRun', () => {
  test('saveRun writes the run under SAVE_KEY and loadRun reads it back', () => {
    const storage = fakeStorage();

    saveRun(midRun, storage);

    expect(storage.data[SAVE_KEY]).toBe(serializeRun(midRun));
    expect(loadRun(storage)).toEqual(parseSavedRun(serializeRun(midRun)));
  });

  test('loadRun returns null when nothing is saved', () => {
    expect(loadRun(fakeStorage())).toBeNull();
  });

  test('loadRun discards a corrupted save', () => {
    const storage = fakeStorage({ [SAVE_KEY]: '{oops' });

    expect(loadRun(storage)).toBeNull();
    expect(storage.data).not.toHaveProperty(SAVE_KEY);
  });

  test('loadRun discards a save with missing fields', () => {
    const storage = fakeStorage({ [SAVE_KEY]: JSON.stringify({ hp: 10 }) });

    expect(loadRun(storage)).toBeNull();
    expect(storage.data).not.toHaveProperty(SAVE_KEY);
  });

  test('clearRun removes the save', () => {
    const storage = fakeStorage();
    saveRun(midRun, storage);

    clearRun(storage);

    expect(storage.data).not.toHaveProperty(SAVE_KEY);
    expect(loadRun(storage)).toBeNull();
  });

  test('storage errors are swallowed so the game keeps working', () => {
    const storage = throwingStorage();

    expect(() => saveRun(midRun, storage)).not.toThrow();
    expect(loadRun(storage)).toBeNull();
    expect(() => clearRun(storage)).not.toThrow();
  });

  test('the wrappers default to window.localStorage', () => {
    saveRun(midRun);
    expect(window.localStorage.getItem(SAVE_KEY)).toBe(serializeRun(midRun));

    clearRun();
    expect(window.localStorage.getItem(SAVE_KEY)).toBeNull();
  });
});
