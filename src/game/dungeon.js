import { MAX_HP } from './constants';
import { shuffleCards, drawRoom, isSameCard } from './deck';
import { getVariant } from './variants';
import { applyCardEffect } from './effects';

export const initialGameState = {
  dungeon: [],
  dungeonSize: 0,
  regenerate: 0,
  room: [],
  hp: MAX_HP,
  xp: 0,
  shield: 0,
  shieldRank: 0,
  potionDrank: false,
  potionLimit: true,
  breakableShield: true,
  progress: 52,
  retreat: false,
  isRoomComplete: false,
  gameState: '',
  gameVariant: 'Basic game',
  gameScene: 'intro',
  gameMode: 'standard',
};

const enterNewRoom = (state, cards, random) => {
  const { dungeon, room } = drawRoom(shuffleCards(cards, random));
  const won = room.length === 0;
  return {
    ...state,
    dungeon,
    room,
    hp: state.hp + state.regenerate,
    progress: dungeon.length,
    potionDrank: false,
    isRoomComplete: false,
    gameState: won ? 'You won!' : state.gameState,
    gameScene: won ? 'endGame' : state.gameScene,
  };
};

export const newGame = (state, mode, random = Math.random) => {
  const variant = getVariant(mode);
  return {
    ...enterNewRoom(state, variant.deck, random),
    dungeonSize: variant.deck.length,
    regenerate: variant.regenerate,
    potionLimit: variant.potionLimit,
    breakableShield: variant.breakableShield,
    hp: MAX_HP,
    xp: 0,
    shield: variant.startingShield,
    shieldRank: 0,
    retreat: variant.breakableShield,
    gameVariant: variant.description,
    gameScene: 'room',
    gameMode: mode,
  };
};

export const run = (state, random = Math.random) => ({
  ...enterNewRoom(state, [...state.dungeon, ...state.room], random),
  retreat: !state.retreat,
});

export const nextRoom = (state, random = Math.random) => ({
  ...enterNewRoom(state, [...state.dungeon, ...state.room], random),
  retreat: state.breakableShield,
});

export const deal = (state) => {
  const { dungeon, room } = drawRoom(state.dungeon);
  const won = room.length === 0;
  return {
    ...state,
    dungeon,
    room,
    hp: state.hp + state.regenerate,
    potionDrank: false,
    progress: dungeon.length,
    retreat: true,
    isRoomComplete: false,
    gameState: won ? 'You won!' : '',
    gameScene: won ? 'endGame' : state.gameScene,
  };
};

export const playCard = (state, card) => {
  const afterEffect = applyCardEffect(state, card);
  const room = afterEffect.room.filter((roomCard) => !isSameCard(roomCard, card));
  const next = { ...afterEffect, room, isRoomComplete: room.length <= 1, retreat: false };
  return room.length === 0 ? deal(next) : next;
};
