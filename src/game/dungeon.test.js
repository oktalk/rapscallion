import { initialGameState, newGame, run, nextRoom, deal, playCard, runStats } from './dungeon';
import { decks } from './decks';

const noShuffle = () => 0.999999;
const card = (suit, number) => ({ suit, number });
const state = (overrides) => ({ ...initialGameState, gameScene: 'room', ...overrides });

const s = [2, 3, 4, 5, 6].map((n) => card('spades', n));
const c = [2, 3, 4, 5].map((n) => card('clubs', n));

describe('newGame', () => {
  it('starts a standard game with a dealt room', () => {
    const next = newGame(initialGameState, 'standard', noShuffle);
    expect(next).toMatchObject({
      room: decks.standard.slice(-4),
      dungeon: decks.standard.slice(0, -4),
      progress: 44,
      dungeonSize: 48,
      hp: 21,
      xp: 0,
      shield: 0,
      shieldRank: 0,
      regenerate: 0,
      potionLimit: true,
      breakableShield: true,
      retreat: true,
      potionDrank: false,
      isRoomComplete: false,
      gameVariant: 'Basic game',
      gameScene: 'room',
      gameMode: 'standard',
    });
  });

  it('fully resets a finished game', () => {
    const finished = state({ hp: -2, xp: 40, shield: 5, shieldRank: 3, gameScene: 'endGame' });
    expect(newGame(finished, 'standard', noShuffle)).toMatchObject({
      hp: 21,
      xp: 0,
      shield: 0,
      shieldRank: 0,
      gameScene: 'room',
    });
  });

  it('KNOWN BUG #5 (possibly intended): carries over the previous gameState message', () => {
    const finished = state({ gameState: 'Game over' });
    expect(newGame(finished, 'standard', noShuffle).gameState).toBe('Game over');
  });

  it('King of Hearts starts with a 7 shield and cannot run', () => {
    expect(newGame(initialGameState, 'noshields', noShuffle)).toMatchObject({
      shield: 7,
      breakableShield: false,
      retreat: false,
      dungeonSize: 38,
      progress: 34,
    });
  });

  it('Ace of Hearts does not heal on the opening room', () => {
    const next = newGame(state({ regenerate: 3 }), 'nohearts', noShuffle);
    expect(next).toMatchObject({ hp: 21, regenerate: 3 });
  });

  it('Queen of Hearts removes the potion limit', () => {
    expect(newGame(initialGameState, 'potions', noShuffle)).toMatchObject({
      potionLimit: false,
      gameVariant: 'No potion limit',
      gameMode: 'potions',
    });
  });

  it('does not mutate the shared deck data', () => {
    newGame(initialGameState, 'standard');
    expect(decks.standard).toHaveLength(48);
  });
});

describe('run', () => {
  it('reshuffles the room into the dungeon, deals a new room, and uses up the retreat', () => {
    const next = run(state({ dungeon: s, room: c, retreat: true, hp: 10 }), noShuffle);
    expect(next).toMatchObject({
      dungeon: s,
      room: c,
      progress: 5,
      retreat: false,
      potionDrank: false,
      isRoomComplete: false,
      hp: 10,
    });
  });

  it('applies regeneration', () => {
    expect(run(state({ dungeon: s, room: c, hp: 10, regenerate: 3 }), noShuffle).hp).toBe(13);
  });

  it('shuffles dungeon then room in that order', () => {
    const next = run(state({ dungeon: s, room: [c[0]] }), noShuffle);
    expect(next.room).toEqual([s[2], s[3], s[4], c[0]]);
    expect(next.dungeon).toEqual([s[0], s[1]]);
  });

  it('declares victory when no cards remain', () => {
    expect(run(state({ dungeon: [], room: [] }), noShuffle)).toMatchObject({
      gameState: 'You won!',
      gameScene: 'endGame',
    });
  });

  it('does not mutate the input', () => {
    const before = state({ dungeon: [...s], room: [...c] });
    run(before);
    expect(before.dungeon).toEqual(s);
    expect(before.room).toEqual(c);
  });
});

describe('nextRoom', () => {
  it('shuffles the leftover card back in and allows a retreat', () => {
    const next = nextRoom(state({ dungeon: s, room: [c[0]], breakableShield: true }), noShuffle);
    expect(next).toMatchObject({
      room: [s[2], s[3], s[4], c[0]],
      dungeon: [s[0], s[1]],
      progress: 2,
      retreat: true,
    });
  });

  it('does not allow a retreat with an unbreakable shield', () => {
    const next = nextRoom(state({ dungeon: s, room: [c[0]], breakableShield: false }), noShuffle);
    expect(next.retreat).toBe(false);
  });
});

describe('deal', () => {
  it('deals the next four cards without shuffling', () => {
    const dungeon = [...s, c[0]];
    expect(deal(state({ dungeon, room: [], hp: 10, regenerate: 3 }))).toMatchObject({
      dungeon: [s[0], s[1]],
      room: [s[2], s[3], s[4], c[0]],
      progress: 2,
      hp: 13,
      retreat: true,
      potionDrank: false,
      isRoomComplete: false,
      gameState: '',
    });
  });

  it('does not mutate state.dungeon', () => {
    const dungeon = [...s];
    deal(state({ dungeon }));
    expect(dungeon).toEqual(s);
  });

  it('deals the final room instead of declaring victory', () => {
    const next = deal(state({ dungeon: c, room: [] }));
    expect(next).toMatchObject({
      dungeon: [],
      room: c,
      progress: 0,
      gameState: '',
      gameScene: 'room',
    });
  });

  it('declares victory once the final room is cleared', () => {
    const next = deal(state({ dungeon: [], room: [] }));
    expect(next).toMatchObject({ room: [], gameState: 'You won!', gameScene: 'endGame' });
  });
});

describe('playCard', () => {
  const room = [card('spades', 5), card('hearts', 3), card('diamonds', 4), card('clubs', 6)];

  it('applies the card effect and removes it from the room', () => {
    const next = playCard(state({ dungeon: s, room, hp: 20, retreat: true }), room[0]);
    expect(next.hp).toBe(15);
    expect(next.room).toEqual([room[1], room[2], room[3]]);
    expect(next).toMatchObject({ isRoomComplete: false, retreat: false });
  });

  it('marks the room complete when one card is left', () => {
    const next = playCard(state({ dungeon: s, room: [room[1], room[2]] }), room[2]);
    expect(next).toMatchObject({ room: [room[1]], isRoomComplete: true });
  });

  it('removes a potion even when potion sickness blocks its effect', () => {
    const next = playCard(state({ dungeon: s, room, hp: 10, potionDrank: true }), room[1]);
    expect(next.hp).toBe(10);
    expect(next.room).toHaveLength(3);
  });

  it('deals a fresh room after the last card is played', () => {
    const next = playCard(state({ dungeon: [...s, c[0]], room: [room[2]] }), room[2]);
    expect(next).toMatchObject({
      room: [s[2], s[3], s[4], c[0]],
      dungeon: [s[0], s[1]],
      shield: 4,
      retreat: true,
      isRoomComplete: false,
    });
  });

  it('ends the game on a killing blow mid-room', () => {
    const next = playCard(state({ dungeon: s, room, hp: 3 }), room[0]);
    expect(next).toMatchObject({ gameState: 'Game over', gameScene: 'endGame' });
  });

  it('keeps "Game over" when the killing blow is the last card in a room', () => {
    const next = playCard(
      state({ dungeon: s, room: [room[3]], hp: 2, regenerate: 3 }),
      room[3]
    );
    expect(next).toMatchObject({
      gameState: 'Game over',
      gameScene: 'endGame',
      hp: -4,
      dungeon: s,
    });
  });

  it('keeps "Game over" when the killing blow clears the final room', () => {
    const next = playCard(state({ dungeon: [], room: [room[3]], hp: 2 }), room[3]);
    expect(next).toMatchObject({ gameState: 'Game over', gameScene: 'endGame' });
  });

  it('KNOWN BUG #3: clearing a room lets King of Hearts run', () => {
    const next = playCard(
      state({ dungeon: s, room: [room[2]], breakableShield: false }),
      room[2]
    );
    expect(next.retreat).toBe(true);
  });
});

describe('run stats counters', () => {
  it('newGame counts the opening room and no runs', () => {
    expect(newGame(initialGameState, 'standard', noShuffle)).toMatchObject({
      roomsEntered: 1,
      timesRun: 0,
    });
  });

  it('newGame resets the counters from a finished game', () => {
    const finished = state({ roomsEntered: 9, timesRun: 3, gameScene: 'endGame' });
    expect(newGame(finished, 'standard', noShuffle)).toMatchObject({
      roomsEntered: 1,
      timesRun: 0,
    });
  });

  it('run counts a run and the room it leads to', () => {
    const next = run(state({ dungeon: s, room: c, roomsEntered: 2, timesRun: 1 }), noShuffle);
    expect(next).toMatchObject({ roomsEntered: 3, timesRun: 2 });
  });

  it('nextRoom counts the new room but not a run', () => {
    const next = nextRoom(state({ dungeon: s, room: [c[0]], roomsEntered: 2, timesRun: 1 }), noShuffle);
    expect(next).toMatchObject({ roomsEntered: 3, timesRun: 1 });
  });

  it('deal counts the room dealt after clearing one', () => {
    const next = deal(state({ dungeon: s, room: [], roomsEntered: 4 }));
    expect(next.roomsEntered).toBe(5);
  });

  it('reaching the empty winning room does not count as a room', () => {
    expect(deal(state({ dungeon: [], room: [], roomsEntered: 4 })).roomsEntered).toBe(4);
    expect(nextRoom(state({ dungeon: [], room: [], roomsEntered: 4 }), noShuffle).roomsEntered).toBe(
      4
    );
  });
});

describe('runStats', () => {
  it('summarizes a won run', () => {
    const won = state({
      dungeon: [],
      room: [],
      dungeonSize: 48,
      hp: 12,
      xp: 150,
      roomsEntered: 14,
      timesRun: 2,
      gameState: 'You won!',
      gameScene: 'endGame',
    });
    expect(runStats(won)).toEqual({
      won: true,
      xp: 150,
      hp: 12,
      cardsCleared: 48,
      deckSize: 48,
      roomsEntered: 14,
      timesRun: 2,
    });
  });

  it('counts cards left in the dungeon and the room as not cleared on a loss', () => {
    const lost = state({
      dungeon: s,
      room: [c[0], c[1]],
      dungeonSize: 48,
      hp: 3,
      gameState: 'Game over',
      gameScene: 'endGame',
    });
    expect(runStats(lost)).toMatchObject({ won: false, cardsCleared: 41, deckSize: 48 });
  });

  it('shows no less than 0 HP after a killing blow', () => {
    expect(runStats(state({ hp: -6, gameState: 'Game over' })).hp).toBe(0);
  });
});
