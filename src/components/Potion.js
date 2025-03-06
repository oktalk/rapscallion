import React from 'react';
import PropTypes from 'prop-types';
import Card from './Card';
import IconPotion from '../images/potion.svg';

const Potion = ({ potionDrank, hp, number, updatePlayer, handleClick, suit }) => {
  const onClick = () => {
    if (!potionDrank) {
      const maxHeal = number < 11 ? number : 11;
      const effect = Math.min(hp + maxHeal, 21);
      updatePlayer({ hp: effect, potionDrank: true });
    }
    handleClick({ suit, number });
  };

  return (
    <Card
      centerPip={IconPotion}
      suit={suit}
      number={number}
      onClick={onClick}
    />
  );
};

Potion.propTypes = {
  potionDrank: PropTypes.bool.isRequired,
  hp: PropTypes.number.isRequired,
  number: PropTypes.number.isRequired,
  updatePlayer: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired,
  suit: PropTypes.string.isRequired,
};

export default Potion;
