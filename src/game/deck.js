import { ROOM_SIZE } from './constants';

export const shuffleCards = (cards, random = Math.random) => {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const drawRoom = (cards) => ({
  dungeon: cards.slice(0, Math.max(cards.length - ROOM_SIZE, 0)),
  room: cards.slice(-ROOM_SIZE),
});

export const isSameCard = (a, b) => a.suit === b.suit && a.number === b.number;
