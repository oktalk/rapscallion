import { cardType, applyCardEffect, shieldImpact } from './index';

describe('cardType', () => {
  it.each([
    ['hearts', 'potion'],
    ['diamonds', 'shield'],
    ['spades', 'enemy'],
    ['clubs', 'enemy'],
    ['joker', 'enemy'],
    ['jack', 'enemy'],
  ])('%s is a %s', (suit, type) => {
    expect(cardType({ suit, number: 2 })).toBe(type);
  });
});

describe('applyCardEffect', () => {
  const state = {
    hp: 10,
    xp: 0,
    shield: 0,
    shieldRank: 0,
    breakableShield: true,
    potionDrank: false,
    potionLimit: true,
    gameState: '',
    gameScene: 'room',
  };

  it('routes hearts to drinkPotion', () => {
    expect(applyCardEffect(state, { suit: 'hearts', number: 4 }).hp).toBe(14);
  });

  it('routes diamonds to equipShield', () => {
    expect(applyCardEffect(state, { suit: 'diamonds', number: 4 }).shield).toBe(4);
  });

  it('routes everything else to attackEnemy', () => {
    expect(applyCardEffect(state, { suit: 'clubs', number: 4 }).hp).toBe(6);
    expect(applyCardEffect(state, { suit: 'joker', number: 21 }).gameState).toBe('Game over');
  });
});

describe('shieldImpact', () => {
  const enemy = { suit: 'spades', number: 6 };

  it('is null when no shield is equipped', () => {
    expect(shieldImpact({ shield: 0 }, { shield: 0 }, enemy)).toBeNull();
  });

  it('is null for cards other than enemies', () => {
    expect(shieldImpact({ shield: 5 }, { shield: 4 }, { suit: 'diamonds', number: 4 })).toBeNull();
    expect(shieldImpact({ shield: 5 }, { shield: 5 }, { suit: 'hearts', number: 4 })).toBeNull();
  });

  it('is absorbed when the shield survives the attack', () => {
    expect(shieldImpact({ shield: 5 }, { shield: 5 }, enemy)).toBe('absorbed');
  });

  it('is broken when the attack destroys the shield', () => {
    expect(shieldImpact({ shield: 5 }, { shield: 0 }, enemy)).toBe('broken');
  });
});
