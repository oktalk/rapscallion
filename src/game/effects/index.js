import { attackEnemy } from './enemy';
import { drinkPotion } from './potion';
import { equipShield } from './shield';

export { attackEnemy, calculateDamage, calculateShieldRank } from './enemy';
export { drinkPotion } from './potion';
export { equipShield } from './shield';

export const cardType = ({ suit }) => {
  if (suit === 'hearts') return 'potion';
  if (suit === 'diamonds') return 'shield';
  return 'enemy';
};

const EFFECTS = {
  potion: drinkPotion,
  shield: equipShield,
  enemy: attackEnemy,
};

export const applyCardEffect = (state, card) => EFFECTS[cardType(card)](state, card);

// How a play affected the equipped shield, so the UI can react to it.
export const shieldImpact = (before, after, card) => {
  if (cardType(card) !== 'enemy' || before.shield === 0) return null;
  return after.shield === 0 ? 'broken' : 'absorbed';
};
