import * as game from '../game';
import { IntroScene } from './IntroScene';
import { RoomScene } from './RoomScene';
import { EndGameScene } from './EndGameScene';
import './App.css';

export const GameScene = ({
  initialState,
  backToIntro,
  playCard,
  run,
  nextRoom,
  toggleModal,
  startGame,
  continueGame,
}) => {
  switch (initialState.gameScene) {
    case 'room':
      return (
        <RoomScene
          initialState={initialState}
          backToIntro={backToIntro}
          playCard={playCard}
          run={run}
          nextRoom={nextRoom}
        />
      );
    case 'endGame':
      return (
        <EndGameScene
          backToIntro={backToIntro}
          startGame={startGame}
          gameMode={initialState.gameMode}
          gameVariant={initialState.gameVariant}
          gameState={initialState.gameState}
          stats={game.runStats(initialState)}
        />
      );

    default:
      return (
        <IntroScene
          gameState={initialState.gameState}
          toggleModal={toggleModal}
          startGame={startGame}
          canContinue={Boolean(initialState.savedRun)}
          continueGame={continueGame}
        />
      );
  }
};
