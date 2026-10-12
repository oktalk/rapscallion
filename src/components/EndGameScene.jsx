import React from "react";
import { decks } from "../decks";

export const EndGameScene = ({
  backToIntro,
  resetDungeon,
  gameVariant,
  gameMode,
  gameState,
}) => {
  return (
    <div>
      <h1 className='text-white is-size-3 mb3'>{gameState}</h1>

      <p className='text-white is-size-4 mb3'>
        You were playing:
        <br />
        <span className='has-text-weight-bold'>"{gameVariant}"</span>
      </p>

      <p className='mb3'>
        <button className='button lined thin' onClick={backToIntro}>
          <span className='delete' aria-label='close' />
          Back to Title Screen
        </button>
        &nbsp;&nbsp;
        <button
          className='button lined thin'
          onClick={() => resetDungeon(decks[gameMode], gameMode)}
        >
          Play again?
        </button>
      </p>
    </div>
  );
};
