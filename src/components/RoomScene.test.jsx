import { render, screen } from '@testing-library/react';
import { RoomScene } from './RoomScene';
import { initialGameState } from '../game/dungeon';

const renderScene = (state) =>
  render(
    <RoomScene
      initialState={{ ...initialGameState, ...state }}
      backToIntro={() => {}}
      playCard={() => {}}
      run={() => {}}
      nextRoom={() => {}}
    />
  );

describe('RoomScene Component', () => {
  it('pulses the exit buttons when leaving a room heals', () => {
    renderScene({ regenerate: 3, isRoomComplete: true, retreat: true });

    expect(screen.getByText('Next Room')).toHaveClass('pulse-red');
    expect(screen.getByText('Run')).toHaveClass('pulse-red');
  });

  it('does not pulse the exit buttons in other modes', () => {
    renderScene({ regenerate: 0, isRoomComplete: true, retreat: true });

    expect(screen.getByText('Next Room')).not.toHaveClass('pulse-red');
    expect(screen.getByText('Run')).not.toHaveClass('pulse-red');
  });
});
