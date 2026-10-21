import { VARIANTS } from './variants';

export const SAVE_KEY = 'rapscallion:run';

const isNumber = (value) => Number.isFinite(value);
const isBoolean = (value) => typeof value === 'boolean';
const isString = (value) => typeof value === 'string';
const isCard = (value) =>
  value !== null &&
  typeof value === 'object' &&
  isString(value.suit) &&
  Number.isInteger(value.number);
const isCardList = (value) => Array.isArray(value) && value.every(isCard);

// Every field a room needs to resume, with the check its saved value must pass.
const SAVED_FIELDS = {
  dungeon: isCardList,
  dungeonSize: isNumber,
  regenerate: isNumber,
  room: (value) => isCardList(value) && value.length > 0,
  hp: (value) => isNumber(value) && value > 0,
  xp: isNumber,
  shield: isNumber,
  shieldRank: isNumber,
  potionDrank: isBoolean,
  potionLimit: isBoolean,
  breakableShield: isBoolean,
  progress: isNumber,
  retreat: isBoolean,
  isRoomComplete: isBoolean,
  gameVariant: isString,
  gameMode: (value) => isString(value) && Object.hasOwn(VARIANTS, value),
};

const pickSavedFields = (source) =>
  Object.fromEntries(Object.keys(SAVED_FIELDS).map((key) => [key, source[key]]));

export const serializeRun = (state) => JSON.stringify(pickSavedFields(state));

export const parseSavedRun = (json) => {
  let data;
  try {
    data = JSON.parse(json);
  } catch {
    return null;
  }
  if (data === null || typeof data !== 'object') return null;

  const valid = Object.entries(SAVED_FIELDS).every(([key, check]) => check(data[key]));
  if (!valid) return null;

  return { ...pickSavedFields(data), gameScene: 'room', gameState: '' };
};

// localStorage can throw when it is full or blocked (for example in some
// private browsing modes). Saving is a convenience, so failures are ignored.
export const saveRun = (state, storage) => {
  try {
    (storage ?? window.localStorage).setItem(SAVE_KEY, serializeRun(state));
  } catch {
    // Keep playing without a save.
  }
};

export const loadRun = (storage) => {
  try {
    const store = storage ?? window.localStorage;
    const json = store.getItem(SAVE_KEY);
    if (json === null) return null;
    const run = parseSavedRun(json);
    if (!run) store.removeItem(SAVE_KEY);
    return run;
  } catch {
    return null;
  }
};

export const clearRun = (storage) => {
  try {
    (storage ?? window.localStorage).removeItem(SAVE_KEY);
  } catch {
    // Nothing to clear if storage is unavailable.
  }
};
