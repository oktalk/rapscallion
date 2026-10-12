import { equipShield } from './shield';

const diamond = (number) => ({ suit: 'diamonds', number });

describe('equipShield', () => {
  it('equips the card value with a fresh rank', () => {
    expect(equipShield({ shield: 0, shieldRank: 0 }, diamond(7))).toMatchObject({
      shield: 7,
      shieldRank: 0,
    });
  });

  it('replaces an existing ranked shield', () => {
    expect(equipShield({ shield: 10, shieldRank: 4 }, diamond(3))).toMatchObject({
      shield: 3,
      shieldRank: 0,
    });
  });

  it('caps the shield at 11', () => {
    expect(equipShield({ shield: 0, shieldRank: 0 }, diamond(13)).shield).toBe(11);
  });
});
