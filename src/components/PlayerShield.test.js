import React from 'react';
import { render, screen } from '@testing-library/react';
import PlayerShield from './PlayerShield';

describe('PlayerShield Component', () => {
  test('renders PlayerShield without shieldRank', () => {
    render(<PlayerShield shield={5} shieldRank={0} />);

    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });
});
