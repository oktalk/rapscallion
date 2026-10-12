import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { cardType } from '../game';
import Potion from './Potion';
import Enemy from './Enemy';
import Shield from './Shield';

const CARD_COMPONENTS = {
  potion: Potion,
  shield: Shield,
  enemy: Enemy,
};

const Room = ({ room, onPlay }) => (
  <Fragment>
    {room.map((card) => {
      const CardComponent = CARD_COMPONENTS[cardType(card)];
      return (
        <CardComponent
          key={`${card.suit}${card.number}`}
          suit={card.suit}
          number={card.number}
          onPlay={onPlay}
        />
      );
    })}
  </Fragment>
);

Room.propTypes = {
  room: PropTypes.array.isRequired,
  onPlay: PropTypes.func.isRequired,
};

export default Room;
