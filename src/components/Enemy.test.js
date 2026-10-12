import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Enemy from './Enemy';

describe('Enemy Component', () => {
  it('renders as a demon card', () => {
    render(<Enemy suit='spades' number={5} onPlay={jest.fn()} />);
    expect(screen.getByText('Demon')).toBeInTheDocument();
    expect(screen.getByText('-5')).toBeInTheDocument();
  });

  it('reports the played card on click', () => {
    const onPlay = jest.fn();
    render(<Enemy suit='spades' number={5} onPlay={onPlay} />);
    fireEvent.click(screen.getByText('Demon'));
    expect(onPlay).toHaveBeenCalledWith({ suit: 'spades', number: 5 });
  });
});
