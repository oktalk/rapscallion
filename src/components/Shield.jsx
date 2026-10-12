import React from 'react';
import PropTypes from 'prop-types';
import Card from './Card';
import IconShield from '../images/shield.svg';

const Shield = ({ potionDrank, hp, number, updatePlayer, handleClick, suit }) => {
  const onClick = () => {
    const effect = (number < 11) ? number : 11;
    updatePlayer({ shield: effect, shieldRank: 0 });
    handleClick({ suit, number });
  };

  return (
    <Card
      potionDrank={potionDrank}
      hp={hp}
      centerPip={IconShield}
      suit={suit}
      number={number}
      onClick={onClick}
    />
  );
};

Shield.propTypes = {
  potionDrank: PropTypes.bool.isRequired,
  hp: PropTypes.number.isRequired,
  number: PropTypes.number.isRequired,
  updatePlayer: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired,
  suit: PropTypes.string.isRequired
};

export default Shield;
