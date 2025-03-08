import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card from './Card';
import IconDragon from '../images/dragon.svg';

export const calculateDamage = ({ hp, number, shield }) => {
  if (shield === 0) {
    return hp - number;
  } else if (shield < number) {
    return hp - (number - shield);
  }
  return hp;
};

export const calculateShieldRank = ({ shield, shieldRank, number, breakableShield }) => {
  if (shield > 0 && shieldRank === 0) {
    return breakableShield ? [shield, number] : [shield, 0];
  } else if (shieldRank >= number) {
    return [shield, number];
  }
  return [0, 0];
};

class Enemy extends Component {
  static propTypes = {
    xp: PropTypes.number.isRequired,
    hp: PropTypes.number.isRequired,
    number: PropTypes.number.isRequired,
    updatePlayer: PropTypes.func.isRequired,
    handleClick: PropTypes.func.isRequired,
    shield: PropTypes.number.isRequired,
    shieldRank: PropTypes.number.isRequired,
    suit: PropTypes.string.isRequired,
    gameScene: PropTypes.string.isRequired,
    breakableShield: PropTypes.bool,
  };

  onClick = () => {
    const { xp, number, updatePlayer, handleClick, suit } = this.props;
    let setHp = calculateDamage(this.props);
    let setShield = calculateShieldRank(this.props)[0];
    let setShieldRank = calculateShieldRank(this.props)[1];
    let setXP = xp + number;
    let setGameState = '';
    let setGameScene = this.props.gameScene;

    if (setHp <= 0) {
      setGameState = 'Game over';
      setShield = 0;
      setShieldRank = 0;
      setXP = xp;
      setGameScene = 'endGame';
    }
    updatePlayer({
      hp: setHp,
      shield: setShield,
      shieldRank: setShieldRank,
      xp: setXP,
      gameState: setGameState,
      gameScene: setGameScene,
    });
    handleClick({ suit, number });
  };

  render() {
    const { suit, number } = this.props;
    return (
      <Card
        {...this.props}
        centerPip={IconDragon}
        suit={suit}
        number={number}
        onClick={this.onClick}
      />
    );
  }
}

export default Enemy;
