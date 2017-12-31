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
    updatePlayer: PropTypes.func.isRequired,
    handleClick: PropTypes.func.isRequired,
    shield: PropTypes.number.isRequired,
    shieldRank: PropTypes.number.isRequired
  };

  render() {
    return (
      <Fragment>
        {this.props.room.map((card) => {
          switch (card.suit) {
            case 'hearts':
              return (<Potion
                {...card}
                key={card.suit + card.number}
                hp={this.props.hp}
                potionLimit={this.props.potionLimit}
                potionDrank={this.props.potionDrank}
                updatePlayer={this.props.updatePlayer}
                handleClick={this.props.handleClick} />);
            case 'diamonds':
              return (<Shield
                {...card}
                key={card.suit + card.number}
                hp={this.props.hp}
                potionDrank={this.props.potionDrank}
                updatePlayer={this.props.updatePlayer}
                handleClick={this.props.handleClick} />);
            default:
              return (<Enemy
                {...card}
                xp={this.props.xp}
                shield={this.props.shield}
                shieldRank={this.props.shieldRank}
                key={card.suit + card.number}
                hp={this.props.hp}
                updatePlayer={this.props.updatePlayer}
                handleClick={this.props.handleClick} />);
          }
        })}
      </Fragment>
    );
  }
}

export default Room;
