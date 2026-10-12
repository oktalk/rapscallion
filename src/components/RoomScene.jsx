import { Fragment } from 'react';
import classnames from 'classnames';
import Room from './Room';
import EquippedShield from './EquippedShield';
import HitPoints from './HitPoints';
import './Animations.css';

export const RoomScene = ({
  initialState,
  backToIntro,
  playCard,
  run,
  nextRoom,
}) => {
  // Leaving a room heals in Ace of Hearts mode, so the exits pulse to draw the eye.
  const exitButtonClass = classnames('button lined thin', {
    'pulse-red': initialState.regenerate > 0,
  });

  return (
    <Fragment>
      <div>
        <button
          data-testid='end-game'
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
      <span data-test='progress label'>Progress: {initialState.progress}</span>
      {initialState.progress > 0 && (
        <p className='App-intro'>
          <button
            className={exitButtonClass}
            onClick={nextRoom}
            disabled={!initialState.isRoomComplete}
          >
            Next Room
          </button>
          <button
            className={exitButtonClass}
            onClick={run}
            disabled={!initialState.retreat}
          >
            Run
          </button>
        </p>
      )}
      <div className='App-stats'>
        <p className='text-white'>
          <HitPoints hp={initialState.hp} /> • Shield: {initialState.shield}/
          {initialState.breakableShield ? initialState.shieldRank : '∞'}
        </p>
        <small>
          XP: {initialState.xp} • Potions sickness:{' '}
          {initialState.potionLimit ? initialState.potionDrank && '1' : '∞'}
        </small>
      </div>
      <div className='App-room is-clearfix' data-test='cards'>
        <Room room={initialState.room} onPlay={playCard} />
      </div>
      {initialState.hp > 0 && initialState.room.length > 0 && (
        <div className='App-shield'>
          <EquippedShield
            shield={initialState.shield}
            shieldRank={initialState.shieldRank}
            impact={initialState.shieldImpact}
            golden={!initialState.breakableShield}
          />
        </div>
      )}
    </Fragment>
  );
};
