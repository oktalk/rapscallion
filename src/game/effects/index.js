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
