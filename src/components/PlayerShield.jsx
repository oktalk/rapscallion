import React from 'react';
import PropTypes from 'prop-types';
import Card from './Card';
import IconShield from '../images/shield.svg';
import './PlayerShield.css';

const PlayerShield = ({ shield, shieldRank }) => {
  return (
    <div className="Player-shield">
      <Card
        hasShieldRank={shieldRank > 0}
        shieldRank={shieldRank}
        centerPip={IconShield}
        suit='diamonds'
        number={shield} />
    </div>
  );
};

PlayerShield.propTypes = {
  shield: PropTypes.number.isRequired,
  shieldRank: PropTypes.number.isRequired
};

export default PlayerShield;
