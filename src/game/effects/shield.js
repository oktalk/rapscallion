import { MAX_CARD_VALUE } from '../constants';

export const equipShield = (state, { number }) => ({
  ...state,
  shield: Math.min(number, MAX_CARD_VALUE),
  shieldRank: 0,
});
