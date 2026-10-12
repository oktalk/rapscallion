import { VARIANTS, getVariant } from './variants';
import { decks } from './decks';

describe('getVariant', () => {
  it('returns the standard game', () => {
    expect(getVariant('standard')).toEqual({
      description: 'Basic game',
      deck: decks.standard,
      regenerate: 0,
      potionLimit: true,
      breakableShield: true,
      startingShield: 0,
    });
  });

  it('Queen of Hearts (potions) has no potion limit', () => {
    expect(getVariant('potions')).toMatchObject({
      description: 'No potion limit',
      potionLimit: false,
      deck: decks.potions,
    });
  });

  it('King of Hearts (noshields) starts with an unbreakable 7 shield', () => {
    expect(getVariant('noshields')).toMatchObject({
      description: 'Unbreakable shield',
      breakableShield: false,
      startingShield: 7,
      deck: decks.noshields,
    });
  });

  it('Ace of Hearts (nohearts) heals 3 per room', () => {
    expect(getVariant('nohearts')).toMatchObject({
      description: 'Heal 3 after each room',
      regenerate: 3,
      deck: decks.nohearts,
    });
  });

  it('throws on an unknown mode', () => {
    expect(() => getVariant('nope')).toThrow('Unknown game mode: nope');
  });

  it('has an entry for every deck', () => {
    expect(Object.keys(VARIANTS).sort()).toEqual(Object.keys(decks).sort());
  });
});
