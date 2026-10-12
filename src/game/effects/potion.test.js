import { drinkPotion } from './potion';

const heart = (number) => ({ suit: 'hearts', number });
const player = (overrides) => ({ hp: 10, potionDrank: false, potionLimit: true, ...overrides });

describe('drinkPotion', () => {
  it('heals by the card value and marks the potion as drunk', () => {
    expect(drinkPotion(player(), heart(5))).toMatchObject({ hp: 15, potionDrank: true });
  });

  it('caps hp at 21', () => {
    expect(drinkPotion(player({ hp: 18 }), heart(7)).hp).toBe(21);
  });

  it('caps the heal at 11 for high cards', () => {
    expect(drinkPotion(player({ hp: 5 }), heart(13)).hp).toBe(16);
  });

  it('does nothing when a potion was already drunk this room', () => {
    const state = player({ potionDrank: true });
    expect(drinkPotion(state, heart(5))).toBe(state);
  });

  it('never sets potion sickness when there is no potion limit', () => {
    const once = drinkPotion(player({ potionLimit: false }), heart(3));
    expect(once).toMatchObject({ hp: 13, potionDrank: false });
    expect(drinkPotion(once, heart(4)).hp).toBe(17);
  });
});
