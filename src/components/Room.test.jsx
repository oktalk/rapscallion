import React from 'react';
import { render } from '@testing-library/react';
import Room from './Room';

const mockUpdatePlayer = jest.fn();
const mockHandleClick = jest.fn();

const defaultProps = {
  room: [],
  hp: 100,
  potionDrank: false,
  potionLimit: false,
  breakableShield: false,
  updatePlayer: mockUpdatePlayer,
  handleClick: mockHandleClick,
  shield: 50,
  shieldRank: 1
};

describe('Room Component', () => {
  it('renders without crashing', () => {
    render(<Room {...defaultProps} />);
  });
});
