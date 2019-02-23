import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card from './Card';
import IconShield from '../images/shield.svg';
import './PlayerShield.css';

class PlayerShield extends Component {
  static propTypes = {
    shield: PropTypes.number.isRequired,
    shieldRank: PropTypes.number.isRequired
  };

  render() {
    return (
      <div className="Player-shield">
        <Card
          hasShieldRank={this.props.shieldRank > 0}
          shieldRank={this.props.shieldRank}
          centerPip={IconShield}
          suit='diamonds'
          number={this.props.shield} />
      </div>
    );
  }
}

export default PlayerShield;
