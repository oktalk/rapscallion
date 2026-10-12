import { render, screen } from '@testing-library/react';
import HitPoints from './HitPoints';

const readout = () => screen.getByText(/^HP:/);

describe('HitPoints Component', () => {
  it('shows HP without animating on first render', () => {
    const { container } = render(<HitPoints hp={21} />);
    expect(readout()).toHaveTextContent('HP: 21');
    expect(readout()).not.toHaveClass('hp-heal', 'hp-hit');
    expect(container.querySelector('.hp-float')).toBeNull();
  });

  it('pulses and floats the amount when healed', () => {
    const { rerender, container } = render(<HitPoints hp={10} />);
    rerender(<HitPoints hp={15} />);
    expect(readout()).toHaveClass('hp-heal');
    expect(container.querySelector('.hp-float-gain')).toHaveTextContent('+5');
  });

  it.each([
    [3, 'hp-hit-light'],
    [6, 'hp-hit-medium'],
    [11, 'hp-hit-heavy'],
  ])('shakes harder as damage grows (%i damage)', (damage, tier) => {
    const { rerender, container } = render(<HitPoints hp={21} />);
    rerender(<HitPoints hp={21 - damage} />);
    expect(readout()).toHaveClass('hp-hit', tier);
    expect(container.querySelector('.hp-float-loss')).toHaveTextContent(`-${damage}`);
  });

  it('flashes the screen only for heavy hits', () => {
    const { rerender } = render(<HitPoints hp={21} />);
    rerender(<HitPoints hp={12} />);
    expect(document.querySelector('.damage-flash')).toBeNull();
    rerender(<HitPoints hp={2} />);
    expect(document.querySelector('.damage-flash')).not.toBeNull();
  });
});
