import { decks } from './decks';

const BASE = {
  regenerate: 0,
  potionLimit: true,
  breakableShield: true,
  startingShield: 0,
};

export const VARIANTS = {
  standard: { ...BASE, description: 'Basic game', deck: decks.standard },
  potions: { ...BASE, description: 'No potion limit', deck: decks.potions, potionLimit: false },
  noshields: {
    ...BASE,
    description: 'Unbreakable shield',
    deck: decks.noshields,
    breakableShield: false,
    startingShield: 7,
  },
  nohearts: { ...BASE, description: 'Heal 3 after each room', deck: decks.nohearts, regenerate: 3 },
};

export const getVariant = (mode) => {
  const variant = VARIANTS[mode];
  if (!variant) {
    throw new Error(`Unknown game mode: ${mode}`);
  }
  return variant;
};
