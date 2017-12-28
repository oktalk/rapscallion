import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card from './Card';

class Shield extends Component {
  static propTypes = {
    potionDrank: PropTypes.bool.isRequired,
    hp: PropTypes.number.isRequired,
    number: PropTypes.number.isRequired,
    updatePlayer: PropTypes.func.isRequired,
    handleClick: PropTypes.func.isRequired,
    suit: PropTypes.string.isRequired
  };

  onClick = () => {
    const effect = this.props.number;
    this.props.updatePlayer({ shield: effect, shieldRank: 0 });
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

export default Shield;
