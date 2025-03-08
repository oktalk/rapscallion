import React, { Fragment } from 'react';
import Room from './Room';
import PlayerShield from './PlayerShield';

export const RoomScene = ({
  initialState,
  backToIntro,
  updatePlayer,
  handleClick,
  run,
  nextRoom,
}) => {
  return (
    <Fragment>
      <div>
        <button
          className='delete'
          aria-label='close'
          onClick={backToIntro}
        ></button>
        End game
      </div>
      {initialState.gameVariant}
      <div className='progress-bar'>
        <span
          className='progress-bar-rating'
          style={{
            width: `${
              ((initialState.dungeonSize - initialState.progress) /
                initialState.dungeonSize) *
              100
            }%`,
          }}
        >
          {`${Math.ceil(((48 - initialState.progress) / 48) * 100)}% Complete`}
        </span>
      </div>
      Progress: {initialState.progress}
      {initialState.progress > 0 && (
        <p className='App-intro'>
          <button
            className='button lined thin'
            onClick={nextRoom}
            disabled={!initialState.isRoomComplete}
          >
            Next Room
          </button>
          <button
            className='button lined thin'
            onClick={run}
            disabled={!initialState.retreat}
          >
            Run
          </button>
        </p>
      )}
      <div className='App-stats'>
        <p className='text-white'>
          HP: {initialState.hp} • Shield: {initialState.shield}/
          {initialState.shieldRank}
        </p>
        <small>
          XP: {initialState.xp} • Potions sickness:{' '}
          {initialState.potionDrank && '1'}
        </small>
      </div>
      <div className='App-room is-clearfix'>
        <Room
          room={initialState.room}
          hp={initialState.hp}
          potionDrank={initialState.potionDrank}
          potionLimit={initialState.potionLimit}
          breakableShield={initialState.breakableShield}
          updatePlayer={updatePlayer}
          handleClick={handleClick}
          shield={initialState.shield}
          shieldRank={initialState.shieldRank}
          gameScene={initialState.gameScene}
          xp={initialState.xp}
        />
      </div>
      {initialState.hp > 0 && initialState.room.length > 0 && (
        <div className='App-shield'>
          {initialState.shield > 0 && (
            <PlayerShield
              shield={initialState.shield}
              shieldRank={initialState.shieldRank}
            />
          )}
        </div>
      )}
    </Fragment>
  );
};
