import { initialGameState } from './dungeon';
import {
  SAVE_KEY,
  serializeRun,
  parseSavedRun,
  saveRun,
  loadRun,
  clearRun,
} from './save';

const card = (suit, number) => ({ suit, number });

const midRun = {
  ...initialGameState,
  dungeon: [card('clubs', 4), card('hearts', 9)],
  dungeonSize: 48,
  room: [card('spades', 7), card('diamonds', 5)],
  hp: 13,
  xp: 8,
  shield: 5,
  shieldRank: 7,
  potionDrank: true,
  progress: 2,
  retreat: false,
  isRoomComplete: false,
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
      gameVariant: 'Basic game',
      gameMode: 'standard',
      gameScene: 'room',
      gameState: '',
    });
  });

  test('UI-only state is not saved', () => {
    const saved = JSON.parse(serializeRun(midRun));

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
    const json = JSON.stringify({ ...JSON.parse(serializeRun(midRun)), cheat: 99 });
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

  const savedWith = (overrides) =>
    JSON.stringify({ ...JSON.parse(serializeRun(midRun)), ...overrides });

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
  ])('rejects a save with %s', (_label, overrides) => {
    expect(parseSavedRun(savedWith(overrides))).toBeNull();
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
