import { cardType, applyCardEffect } from './index';

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
