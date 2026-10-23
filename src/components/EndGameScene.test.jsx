import { render, screen, fireEvent } from '@testing-library/react';
import { EndGameScene } from './EndGameScene';

describe('EndGameScene', () => {
  const lostStats = {
    won: false,
    xp: 42,
    hp: 0,
    cardsCleared: 17,
    deckSize: 38,
    roomsEntered: 6,
    timesRun: 0,
  };

  const setup = (overrides = {}) => {
    const startGame = vi.fn();
    const backToIntro = vi.fn();
    render(
      <EndGameScene
        backToIntro={backToIntro}
        startGame={startGame}
        gameMode='noshields'
        gameVariant='Unbreakable shield'
        gameState='Game over'
        stats={lostStats}
        {...overrides}
      />
    );
    return { startGame, backToIntro };
  };

  test('Play again restarts with the same game mode', () => {
    const { startGame } = setup();

    fireEvent.click(screen.getByText('Play again?'));

    expect(startGame).toHaveBeenCalledTimes(1);
    expect(startGame).toHaveBeenCalledWith('noshields');
  });

  test('Back to Title Screen returns to the intro', () => {
    const { backToIntro } = setup();

    fireEvent.click(screen.getByText('Back to Title Screen'));

    expect(backToIntro).toHaveBeenCalledTimes(1);
  });

  test('a loss is styled as a loss', () => {
    setup();

    const result = screen.getByTestId('end-game-result');
    expect(result).toHaveTextContent('Game over');
    expect(result).toHaveClass('is-loss');
    expect(result).not.toHaveClass('is-win');
  });

  test('a win is styled as a win', () => {
    setup({
      gameState: 'You won!',
      stats: { ...lostStats, won: true, hp: 9, cardsCleared: 38 },
    });

    const result = screen.getByTestId('end-game-result');
    expect(result).toHaveTextContent('You won!');
    expect(result).toHaveClass('is-win');
    expect(result).not.toHaveClass('is-loss');
  });

  test('shows every stat for the run', () => {
    setup({ stats: { ...lostStats, timesRun: 3 } });

    expect(screen.getByTestId('stat-xp')).toHaveTextContent('Final XP: 42');
    expect(screen.getByTestId('stat-hp')).toHaveTextContent('HP remaining: 0');
    expect(screen.getByTestId('stat-cards')).toHaveTextContent('Cards cleared: 17 / 38');
    expect(screen.getByTestId('stat-rooms')).toHaveTextContent('Rooms entered: 6');
    expect(screen.getByTestId('stat-runs')).toHaveTextContent('Times run: 3');
  });

  test('still names the variant that was played', () => {
    setup();

    expect(screen.getByText('"Unbreakable shield"')).toBeInTheDocument();
  });
});
