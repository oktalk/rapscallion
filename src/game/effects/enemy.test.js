import { attackEnemy, calculateShieldRank } from './enemy';

const player = (overrides) => ({
  hp: 20,
  xp: 10,
  shield: 0,
  shieldRank: 0,
  breakableShield: true,
  gameState: '',
  gameScene: 'room',
  ...overrides,
});
const spade = (number) => ({ suit: 'spades', number });

describe('attackEnemy', () => {
  it('takes full damage and gains xp with no shield', () => {
    const next = attackEnemy(player(), spade(5));
    expect(next).toMatchObject({ hp: 15, xp: 15, gameState: '', gameScene: 'room' });
  });

  it('subtracts the shield from the damage when the enemy is stronger', () => {
    expect(attackEnemy(player({ shield: 3 }), spade(5)).hp).toBe(18);
  });

  it('blocks all damage when the shield is at least the enemy value', () => {
    expect(attackEnemy(player({ shield: 5 }), spade(5)).hp).toBe(20);
  });

  it('ranks a fresh breakable shield to the enemy value', () => {
    const next = attackEnemy(player({ shield: 5, shieldRank: 0 }), spade(5));
    expect(next).toMatchObject({ shield: 5, shieldRank: 5 });
  });

  it('breaks the shield when the enemy is above the shield rank', () => {
    const next = attackEnemy(player({ shield: 10, shieldRank: 5 }), spade(10));
    expect(next).toMatchObject({ shield: 0, shieldRank: 0 });
  });

  it('never ranks an unbreakable shield', () => {
    const next = attackEnemy(player({ shield: 7, breakableShield: false }), spade(9));
    expect(next).toMatchObject({ shield: 7, shieldRank: 0, hp: 18 });
  });

  it('ends the game at 0 hp, clearing the shield and withholding xp', () => {
    const next = attackEnemy(player({ hp: 5, shield: 0 }), spade(5));
    expect(next).toMatchObject({
      hp: 0,
      xp: 10,
      shield: 0,
      shieldRank: 0,
      gameState: 'Game over',
      gameScene: 'endGame',
    });
  });

  it('does not mutate the input state', () => {
    const state = player();
    attackEnemy(state, spade(5));
    expect(state.hp).toBe(20);
  });
});

describe('calculateShieldRank', () => {
  it('lowers the rank when fighting a weaker enemy', () => {
    expect(
      calculateShieldRank({ shield: 10, shieldRank: 10, number: 5, breakableShield: true })
    ).toStrictEqual([10, 5]);
  });

  it('keeps rank 0 for an unbreakable shield', () => {
    expect(
      calculateShieldRank({ shield: 10, shieldRank: 0, number: 5, breakableShield: false })
    ).toStrictEqual([10, 0]);
  });

  it('returns zeros with no shield', () => {
    expect(
      calculateShieldRank({ shield: 0, shieldRank: 0, number: 5, breakableShield: true })
    ).toStrictEqual([0, 0]);
  });

  it('breaks the shield when the enemy is above the rank', () => {
    expect(
      calculateShieldRank({ shield: 10, shieldRank: 5, number: 10, breakableShield: true })
    ).toStrictEqual([0, 0]);
  });
});
