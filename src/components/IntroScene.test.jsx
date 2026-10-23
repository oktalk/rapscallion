import { render, screen, fireEvent } from '@testing-library/react';
import { IntroScene } from './IntroScene';

describe('IntroScene', () => {
  const setup = (props) => {
    const continueGame = vi.fn();
    render(
      <IntroScene
        toggleModal={() => {}}
        startGame={() => {}}
        continueGame={continueGame}
        {...props}
      />
    );
    return { continueGame };
  };

  test('hides Continue when there is no saved run', () => {
    setup({ canContinue: false });
    expect(screen.queryByTestId('continue-game')).not.toBeInTheDocument();
  });

  test('shows Continue when a saved run exists and calls continueGame on click', () => {
    const { continueGame } = setup({ canContinue: true });

    fireEvent.click(screen.getByTestId('continue-game'));

    expect(continueGame).toHaveBeenCalledTimes(1);
  });
});
