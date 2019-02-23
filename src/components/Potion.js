import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card from './Card';
import IconPotion from '../images/potion.svg';

class Potion extends Component {
  static propTypes = {
    potionDrank: PropTypes.bool.isRequired,
    hp: PropTypes.number.isRequired,
    number: PropTypes.number.isRequired,
    updatePlayer: PropTypes.func.isRequired,
    handleClick: PropTypes.func.isRequired,
    suit: PropTypes.string.isRequired
  };

  onClick = () => {
    if (!this.props.potionDrank) {
      const maxHeal = (this.props.number < 11) ? this.props.number : 11;
      let effect = this.props.hp + maxHeal;
      effect = (effect > 21) ? 21 : effect;
      this.props.updatePlayer({hp: effect, potionDrank: (this.props.potionLimit)});
    }
    this.props.handleClick({ suit: this.props.suit, number: this.props.number });
  }

  render() {
    return (
      <Card {...this.props}
            centerPip={IconPotion}
            suit={this.props.suit}
            number={this.props.number}
            onClick={this.onClick} />
    );
  }
}

export default Potion;
