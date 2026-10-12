import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Enemy, { calculateShieldRank } from './Enemy';

describe('Enemy Component', () => {
  const defaultProps = {
    xp: 10,
    hp: 20,
    number: 5,
    updatePlayer: jest.fn(),
    handleClick: jest.fn(),
    shield: 0,
    shieldRank: 0,
    suit: 'hearts',
    breakableShield: false
  };

  it('renders without crashing', () => {
    render(<Enemy {...defaultProps} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('calls updatePlayer and handleClick on click', () => {
    render(<Enemy {...defaultProps} />);
    fireEvent.click(screen.getByText('5'));
    expect(defaultProps.updatePlayer).toHaveBeenCalled();
    expect(defaultProps.handleClick).toHaveBeenCalled();
  });

  it('calculates effect correctly when shield is 0', () => {
    render(<Enemy {...defaultProps} />);
    fireEvent.click(screen.getByText('5'));
    expect(defaultProps.updatePlayer).toHaveBeenCalledWith(expect.objectContaining({ hp: 15 }));
  });

  it('calculates effect correctly when shield is less than number', () => {
    const props = { ...defaultProps, shield: 3 };
    render(<Enemy {...props} />);
    fireEvent.click(screen.getByText('5'));
    expect(defaultProps.updatePlayer).toHaveBeenCalledWith(expect.objectContaining({ hp: 18 }));
  });

  it('calculates effect correctly when shield is greater than or equal to number', () => {
    const props = { ...defaultProps, shield: 5 };
    render(<Enemy {...props} />);
    fireEvent.click(screen.getByText('5'));
    expect(defaultProps.updatePlayer).toHaveBeenCalledWith(expect.objectContaining({ hp: 20 }));
  });

  it('calculates shield rank correctly when shield is greater than 0 and shieldRank is 0', () => {
    const props = { ...defaultProps, shield: 5, shieldRank: 0, breakableShield: true };
    render(<Enemy {...props} />);
    fireEvent.click(screen.getByText('5'));
    expect(defaultProps.updatePlayer).toHaveBeenCalledWith(expect.objectContaining({ shieldRank: 5 }));
  });

  it('calculates shield rank correctly when shieldRank is greater than or equal to number', () => {
    const props = { ...defaultProps, shieldRank: 5 };
    render(<Enemy {...props} />);
    fireEvent.click(screen.getByText('5'));
    expect(defaultProps.updatePlayer).toHaveBeenCalledWith(expect.objectContaining({ shieldRank: 5 }));
  });

  it('sets game state to "Game over" when effect is less than 0', () => {
    const props = { ...defaultProps, hp: 3, number: 5 };
    render(<Enemy {...props} />);
    fireEvent.click(screen.getByText('5'));
    expect(defaultProps.updatePlayer).toHaveBeenCalledWith(expect.objectContaining({ gameState: 'Game over' }));
  });

  it('calculates shield should become lower rank', () => {
    expect(
      calculateShieldRank({
        shield: 10,
        shieldRank: 10,
        number: 5,
        breakableShield: true,
      })
    ).toStrictEqual([10, 5]);
  });
  it('calculates shield rank for unbreakable shield, should be 0', () => {
    expect(
      calculateShieldRank({
        shield: 10,
        shieldRank: 0,
        number: 5,
        breakableShield: false,
      })
    ).toStrictEqual([10, 0]);
  });
  it('calculates shield rank no shield then all zeros', () => {
    expect(
      calculateShieldRank({
        shield: 0,
        shieldRank: 0,
        number: 5,
        breakableShield: true,
      })
    ).toStrictEqual([0, 0]);
  });
  it('calculates shield rank low rank against high number should break shield', () => {
    expect(
      calculateShieldRank({
        shield: 10,
        shieldRank: 5,
        number: 10,
        breakableShield: true,
      })
    ).toStrictEqual([0, 0]);
  });
});
