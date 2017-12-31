import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card from './Card';

class Enemy extends Component {
  static propTypes = {
    xp: PropTypes.number.isRequired,
    hp: PropTypes.number.isRequired,
    number: PropTypes.number.isRequired,
    updatePlayer: PropTypes.func.isRequired,
    handleClick: PropTypes.func.isRequired,
    shield: PropTypes.number.isRequired,
    shieldRank: PropTypes.number.isRequired,
    suit: PropTypes.string.isRequired
  };

  onClick = () => {
    let effect = this.props.hp;
    let setShield = this.props.shield;
    let setShieldRank = this.props.shieldRank;
    let setXP = this.props.xp + this.props.number;
    let setGameState = '';

    if(this.props.shield === 0) {
      effect = this.props.hp - this.props.number;
    } else if (this.props.shield < this.props.number) {
      effect = this.props.hp - (Math.abs( this.props.shield - this.props.number ));
    }

    if (this.props.shield > 0 && this.props.shieldRank === 0) {
      setShieldRank = (this.props.breakableShield) ? this.props.number : 0;
    } else if (this.props.shieldRank >= this.props.number) {
      setShieldRank = this.props.number;
    } else {
      setShield = 0;
      setShieldRank = 0;
    }
    if (effect < 0) {
      setGameState = 'Game over';
      setShield = 0;
      setShieldRank = 0;
      setXP = this.props.xp
    }

    this.props.updatePlayer({ hp: effect, shield: setShield, shieldRank: setShieldRank, xp: setXP, gameState: setGameState });
    this.props.handleClick({ suit: this.props.suit, number: this.props.number });
  }

  render() {
    return (
      <Card suit={this.props.suit}
            number={this.props.number}
            onClick={this.onClick} />
    );
  }
}

export default Enemy;
