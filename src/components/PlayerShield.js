import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card from './Card';
import './PlayerShield.css';

class PlayerShield extends Component {
  static propTypes = {
    shield: PropTypes.number.isRequired,
    shieldRank: PropTypes.number.isRequired
  };

  render() {
    return (
      <div className="Player-shield">
        {this.props.shieldRank > 0 &&
          <div className="Player-shieldRank">
            <Card suit='spades' number={this.props.shieldRank} />
          </div>
        }
        <Card suit='diamonds' number={this.props.shield} />
      </div>
    );
  }
}

export default PlayerShield;
