import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import Potion from './Potion';
import Enemy from './Enemy';
import Shield from './Shield';

class Room extends Component {
  static propTypes = {
    room: PropTypes.array.isRequired,
    hp: PropTypes.number.isRequired,
    potionDrank: PropTypes.bool.isRequired,
    potionLimit: PropTypes.bool.isRequired,
    breakableShield: PropTypes.bool.isRequired,
    updatePlayer: PropTypes.func.isRequired,
    handleClick: PropTypes.func.isRequired,
    shield: PropTypes.number.isRequired,
    shieldRank: PropTypes.number.isRequired,
    gameScene: PropTypes.string.isRequired,
    xp: PropTypes.number.isRequired,
  };

  renderCard = (card) => {
    const commonProps = {
      ...card,
      hp: this.props.hp,
      gameScene: this.props.gameScene,
      updatePlayer: this.props.updatePlayer,
      handleClick: this.props.handleClick,
    };

    switch (card.suit) {
      case 'hearts':
        return (
          <Potion
            {...commonProps}
            key={`${card.suit}${card.number}`}
            potionLimit={this.props.potionLimit}
            potionDrank={this.props.potionDrank}
          />
        );
      case 'diamonds':
        return (
          <Shield
            {...commonProps}
            key={`${card.suit}${card.number}`}
            potionDrank={this.props.potionDrank}
          />
        );
      default:
        return (
          <Enemy
            {...commonProps}
            key={`${card.suit}${card.number}`}
            xp={this.props.xp}
            shield={this.props.shield}
            shieldRank={this.props.shieldRank}
            breakableShield={this.props.breakableShield}
          />
        );
    }
  };

  render() {
    return <Fragment>{this.props.room.map(this.renderCard)}</Fragment>;
  }
}

export default Room;
