import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Room from './Room';

const room = [
  { suit: 'hearts', number: 3 },
  { suit: 'diamonds', number: 4 },
  { suit: 'spades', number: 5 },
];

describe('Room Component', () => {
  it('renders nothing for an empty room', () => {
    const { container } = render(<Room room={[]} onPlay={jest.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the matching card type for each suit', () => {
    render(<Room room={room} onPlay={jest.fn()} />);
    expect(screen.getByText('Potion')).toBeInTheDocument();
    expect(screen.getByText('Shield')).toBeInTheDocument();
    expect(screen.getByText('Demon')).toBeInTheDocument();
  });

  it('passes the clicked card to onPlay', () => {
    const onPlay = jest.fn();
    render(<Room room={room} onPlay={onPlay} />);
    fireEvent.click(screen.getByText('Potion'));
    fireEvent.click(screen.getByText('Shield'));
    expect(onPlay).toHaveBeenNthCalledWith(1, { suit: 'hearts', number: 3 });
    expect(onPlay).toHaveBeenNthCalledWith(2, { suit: 'diamonds', number: 4 });
  });
});
