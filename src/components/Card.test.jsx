import { render, screen } from '@testing-library/react';
import Card from './Card';

describe('Card Component', () => {
  const defaultProps = {
    suit: 'hearts',
    number: 2,
    centerPip: 'path/to/image.png',
    onClick: jest.fn(),
    hasShieldRank: false,
    shieldRank: 0
  };

  it('renders the card with correct suit and number', () => {
    render(<Card {...defaultProps} />);
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Potion')).toBeInTheDocument();
  });

  it('renders the shield rank when hasShieldRank is true', () => {
    render(<Card {...defaultProps} hasShieldRank={true} shieldRank={5} />);
    expect(screen.getByText('rank:')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});
