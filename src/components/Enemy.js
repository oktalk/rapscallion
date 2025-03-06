import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card from './Card';
import IconDragon from '../images/dragon.svg';

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
    breakableShield: PropTypes.bool
  };

  calculateEffect = () => {
    const { hp, number, shield } = this.props;
    if (shield === 0) {
      return hp - number;
    } else if (shield < number) {
      return hp - (number - shield);
    }
    return hp;
  };

  calculateShieldRank = () => {
    const { shield, shieldRank, number, breakableShield } = this.props;
    if (shield > 0 && shieldRank === 0) {
      return breakableShield ? number : 0;
    } else if (shieldRank >= number) {
      return number;
    }
    return 0;
  };

  onClick = () => {
    const { xp, number, shield, updatePlayer, handleClick, suit } = this.props;
    let effect = this.calculateEffect();
    let setShield = shield;
    let setShieldRank = this.calculateShieldRank();
    let setXP = xp + number;
    let setGameState = '';

    if (effect < 0) {
      setGameState = 'Game over';
      setShield = 0;
      setShieldRank = 0;
      setXP = xp;
    }

    updatePlayer({ hp: effect, shield: setShield, shieldRank: setShieldRank, xp: setXP, gameState: setGameState });
    handleClick({ suit, number });
  };

  render() {
    const { suit, number } = this.props;
    return (
      <Card {...this.props}
            centerPip={IconDragon}
            suit={suit}
            number={number}
            onClick={this.onClick} />
    );
  }
}

export default Enemy;
