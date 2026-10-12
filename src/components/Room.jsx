import { Fragment, useState } from 'react';
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

const cardKey = (card) => `${card.suit}${card.number}`;

// A played card first runs its exit animation; the move is only sent to the
// game once that animation ends, so stat changes land after the card is gone.
const Room = ({ room, onPlay }) => {
  const [leaving, setLeaving] = useState({});
  const [prevRoom, setPrevRoom] = useState(room);

  // Drop exit flags for cards that left the room some other way (e.g. Run),
  // so a reshuffled card does not replay its exit when it is dealt again.
  if (room !== prevRoom) {
    setPrevRoom(room);
    setLeaving((current) =>
      Object.fromEntries(room.map(cardKey).filter((key) => current[key]).map((key) => [key, true]))
    );
  }

  const startExit = (card) => {
    setLeaving((current) => ({ ...current, [cardKey(card)]: true }));
  };

  const finishExit = (card) => (event) => {
    const key = cardKey(card);
    if (event.target !== event.currentTarget || !leaving[key]) return;
    setLeaving((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
    onPlay(card);
  };

  return (
    <Fragment>
      {room.map((card) => {
        const type = cardType(card);
        const CardComponent = CARD_COMPONENTS[type];
        const key = cardKey(card);
        return (
          <CardComponent
            key={key}
            suit={card.suit}
            number={card.number}
            onPlay={leaving[key] ? () => {} : startExit}
            className={leaving[key] ? `card-exit-${type}` : undefined}
            onAnimationEnd={finishExit(card)}
          />
        );
      })}
    </Fragment>
  );
};

Room.propTypes = {
  room: PropTypes.array.isRequired,
  onPlay: PropTypes.func.isRequired,
};

export default Room;
