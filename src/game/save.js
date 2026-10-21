import { VARIANTS } from './variants';
import { cardType } from './effects';
import { MAX_CARD_VALUE, ROOM_SIZE } from './constants';

export const SAVE_KEY = 'rapscallion:run';

const isCount = (value) => Number.isInteger(value) && value >= 0;
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
  dungeonSize: isCount,
  regenerate: isCount,
  room: (value) => isCardList(value) && value.length > 0,
  hp: (value) => isCount(value) && value > 0,
  xp: isCount,
  shield: isCount,
  shieldRank: isCount,
  potionDrank: isBoolean,
  potionLimit: isBoolean,
  breakableShield: isBoolean,
  progress: isCount,
  retreat: isBoolean,
  isRoomComplete: isBoolean,
  gameVariant: isString,
  gameMode: (value) => isString(value) && Object.hasOwn(VARIANTS, value),
};

const cardKey = ({ suit, number }) => `${suit}:${number}`;

// In a breakable-shield mode, an equipped shield must come from a diamond
// that has already left the dungeon, and its rank is the last enemy it blocked.
const isPlausibleShield = (run, variant, cardsInPlay) => {
  if (!variant.breakableShield) {
    return run.shield === variant.startingShield && run.shieldRank === 0;
  }
  if (run.shield === 0) return run.shieldRank === 0;

  const equippable = variant.deck
    .filter((card) => cardType(card) === 'shield' && !cardsInPlay.has(cardKey(card)))
    .map((card) => Math.min(card.number, MAX_CARD_VALUE));
  const strongestEnemy = Math.max(
    ...variant.deck.filter((card) => cardType(card) === 'enemy').map((card) => card.number)
  );
  return equippable.includes(run.shield) && run.shieldRank <= strongestEnemy;
};

// The field checks only confirm a save is well-formed. These confirm the game
// rules could have produced it, which rejects most hand edits made in DevTools.
const isPlausibleRun = (run) => {
  const variant = VARIANTS[run.gameMode];
  const deck = new Set(variant.deck.map(cardKey));
  const keysInPlay = [...run.dungeon, ...run.room].map(cardKey);
  const cardsInPlay = new Set(keysInPlay);

  return (
    keysInPlay.every((key) => deck.has(key)) &&
    cardsInPlay.size === keysInPlay.length &&
    run.room.length <= ROOM_SIZE &&
    run.dungeonSize === variant.deck.length &&
    run.progress === run.dungeon.length &&
    run.gameVariant === variant.description &&
    run.regenerate === variant.regenerate &&
    run.potionLimit === variant.potionLimit &&
    run.breakableShield === variant.breakableShield &&
    (run.potionLimit || !run.potionDrank) &&
    isPlausibleShield(run, variant, cardsInPlay)
  );
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
  if (!valid || !isPlausibleRun(data)) return null;

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
