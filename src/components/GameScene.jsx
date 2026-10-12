import React from 'react';
import { IntroScene } from './IntroScene';
import { RoomScene } from './RoomScene';
import { EndGameScene } from './EndGameScene';
import './App.css';

export const GameScene = ({
  initialState,
  backToIntro,
  updatePlayer,
  handleClick,
  run,
  nextRoom,
  toggleModal,
  resetDungeon,
}) => {
  switch (initialState.gameScene) {
    case 'room':
      return (
        <RoomScene
          initialState={initialState}
          backToIntro={backToIntro}
          updatePlayer={updatePlayer}
          handleClick={handleClick}
          run={run}
          nextRoom={nextRoom}
        />
      );
    case 'endGame':
      return (
        <EndGameScene
          backToIntro={backToIntro}
          resetDungeon={resetDungeon}
          gameMode={initialState.gameMode}
          gameVariant={initialState.gameVariant}
          gameState={initialState.gameState}
        />
      );

    default:
      return (
        <IntroScene
          gameState={initialState.gameState}
          toggleModal={toggleModal}
          resetDungeon={resetDungeon}
        />
      );
  }
};
