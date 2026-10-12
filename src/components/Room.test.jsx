import { render, fireEvent, screen } from '@testing-library/react';
import Room from './Room';

const room = [
  { suit: 'hearts', number: 3 },
  { suit: 'diamonds', number: 4 },
  { suit: 'spades', number: 5 },
];

describe('Room Component', () => {
  it('renders nothing for an empty room', () => {
    const { container } = render(<Room room={[]} onPlay={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the matching card type for each suit', () => {
    render(<Room room={room} onPlay={vi.fn()} />);
    expect(screen.getByText('Potion')).toBeInTheDocument();
    expect(screen.getByText('Shield')).toBeInTheDocument();
    expect(screen.getByText('Demon')).toBeInTheDocument();
  });

  const cardFor = (label) => screen.getByText(label).closest('[data-test="card"]');

  it('plays the exit animation for the card type before calling onPlay', () => {
    const onPlay = vi.fn();
    render(<Room room={room} onPlay={onPlay} />);
    fireEvent.click(cardFor('Potion'));
    fireEvent.click(cardFor('Demon'));

    expect(cardFor('Potion')).toHaveClass('card-exit-potion');
    expect(cardFor('Demon')).toHaveClass('card-exit-enemy');
    expect(onPlay).not.toHaveBeenCalled();
  });

  it('passes the clicked card to onPlay once its exit animation ends', () => {
    const onPlay = vi.fn();
    render(<Room room={room} onPlay={onPlay} />);
    fireEvent.click(cardFor('Potion'));
    fireEvent.click(cardFor('Shield'));
    fireEvent.animationEnd(cardFor('Potion'));
    fireEvent.animationEnd(cardFor('Shield'));
    expect(onPlay).toHaveBeenNthCalledWith(1, { suit: 'hearts', number: 3 });
    expect(onPlay).toHaveBeenNthCalledWith(2, { suit: 'diamonds', number: 4 });
  });

  it('ignores animation ends from cards that were not played', () => {
    const onPlay = vi.fn();
    render(<Room room={room} onPlay={onPlay} />);
    fireEvent.animationEnd(cardFor('Potion'));
    expect(onPlay).not.toHaveBeenCalled();
  });

  it('plays a card only once when clicked repeatedly', () => {
    const onPlay = vi.fn();
    render(<Room room={room} onPlay={onPlay} />);
    fireEvent.click(cardFor('Demon'));
    fireEvent.click(cardFor('Demon'));
    fireEvent.animationEnd(cardFor('Demon'));
    expect(onPlay).toHaveBeenCalledTimes(1);
  });
});
