import classnames from 'classnames';

export const EndGameScene = ({
  backToIntro,
  startGame,
  gameVariant,
  gameMode,
  gameState,
  stats,
}) => {
  return (
    <div>
      <div
        data-testid='end-game-result'
        className={classnames('end-game-result mb3', {
          'is-win': stats.won,
          'is-loss': !stats.won,
        })}
      >
        <h1 className='is-size-3'>{gameState}</h1>

        <ul className='end-game-stats text-white is-size-5'>
          <li data-testid='stat-xp'>Final XP: {stats.xp}</li>
          <li data-testid='stat-hp'>HP remaining: {stats.hp}</li>
          <li data-testid='stat-cards'>
            Cards cleared: {stats.cardsCleared} / {stats.deckSize}
          </li>
          <li data-testid='stat-rooms'>Rooms entered: {stats.roomsEntered}</li>
          <li data-testid='stat-runs'>Times run: {stats.timesRun}</li>
        </ul>
      </div>

      <p className='text-white is-size-4 mb3'>
        You were playing:
        <br />
        <span className='has-text-weight-bold'>&quot;{gameVariant}&quot;</span>
      </p>

      <p className='mb3'>
        <button className='button lined thin' onClick={backToIntro}>
          <span className='delete' aria-label='close' />
          Back to Title Screen
        </button>
        &nbsp;&nbsp;
        <button
          className='button lined thin'
          onClick={() => startGame(gameMode)}
        >
          Play again?
        </button>
      </p>
    </div>
  );
};
