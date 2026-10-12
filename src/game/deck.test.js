import { shuffleCards, drawRoom, isSameCard } from './deck';

const card = (suit, number) => ({ suit, number });
const a = card('spades', 2);
const b = card('spades', 3);
const c = card('hearts', 4);
const d = card('diamonds', 5);
const e = card('clubs', 6);
const f = card('clubs', 7);

describe('shuffleCards', () => {
  it('returns a new array and leaves the input untouched', () => {
    const input = [a, b, c, d];
    const result = shuffleCards(input, () => 0);
    expect(result).not.toBe(input);
    expect(input).toEqual([a, b, c, d]);
  });

  it('keeps every card exactly once', () => {
    const result = shuffleCards([a, b, c, d, e, f]);
    expect(result).toHaveLength(6);
    expect(result).toEqual(expect.arrayContaining([a, b, c, d, e, f]));
  });

  it('is a Fisher-Yates shuffle driven by the injected random', () => {
    expect(shuffleCards([a, b, c, d], () => 0)).toEqual([b, c, d, a]);
  });

  it('keeps order when random is just below 1 (no swaps)', () => {
    expect(shuffleCards([a, b, c, d], () => 0.999999)).toEqual([a, b, c, d]);
  });
});

describe('drawRoom', () => {
  it('takes the last four cards as the room', () => {
    expect(drawRoom([a, b, c, d, e, f])).toEqual({
      dungeon: [a, b],
      room: [c, d, e, f],
    });
  });

  it('puts every card in the room when fewer than four remain', () => {
    expect(drawRoom([a, b, c])).toEqual({ dungeon: [], room: [a, b, c] });
  });

  it('returns empty piles for an empty dungeon', () => {
    expect(drawRoom([])).toEqual({ dungeon: [], room: [] });
  });

  it('does not mutate the input', () => {
    const input = [a, b, c, d, e];
    drawRoom(input);
    expect(input).toEqual([a, b, c, d, e]);
  });
});

describe('isSameCard', () => {
  it('matches on suit and number', () => {
    expect(isSameCard(card('spades', 2), card('spades', 2))).toBe(true);
    expect(isSameCard(card('spades', 2), card('clubs', 2))).toBe(false);
    expect(isSameCard(card('spades', 2), card('spades', 3))).toBe(false);
  });
});
