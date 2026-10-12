import { render, screen } from '@testing-library/react';
import PlayerShield from './PlayerShield';

describe('PlayerShield Component', () => {
  test('renders PlayerShield without shieldRank', () => {
    render(<PlayerShield shield={5} shieldRank={0} />);

    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  test('renders a golden shield card when golden', () => {
    render(<PlayerShield shield={7} shieldRank={0} golden />);

    expect(screen.getByText('7').closest('[data-test="card"]')).toHaveClass('shield-golden');
  });
});
