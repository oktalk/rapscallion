import { render, screen, fireEvent } from '@testing-library/react';
import { EndGameScene } from './EndGameScene';

describe('EndGameScene', () => {
  const setup = () => {
    const startGame = jest.fn();
    const backToIntro = jest.fn();
    render(
      <EndGameScene
        backToIntro={backToIntro}
        startGame={startGame}
        gameMode='noshields'
        gameVariant='Unbreakable shield'
        gameState='Game over'
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
});
