import { MAX_HP, MAX_CARD_VALUE } from '../constants';

export const drinkPotion = (state, { number }) => {
  if (state.potionDrank) {
    return state;
  }
  return {
    ...state,
    hp: Math.min(state.hp + Math.min(number, MAX_CARD_VALUE), MAX_HP),
    potionDrank: state.potionLimit,
  };
};
