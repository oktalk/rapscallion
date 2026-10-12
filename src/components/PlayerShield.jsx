import PropTypes from 'prop-types';
import Card from './Card';
import IconShield from '../images/shield.svg';
import './PlayerShield.css';

const PlayerShield = ({ shield, shieldRank, recoilId = 0 }) => {
  return (
    <div className="Player-shield">
      {/* A new key remounts the card, which restarts the recoil animation. */}
      <Card
        key={recoilId}
        className={recoilId > 0 ? 'shield-recoil' : undefined}
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
  shieldRank: PropTypes.number.isRequired,
  recoilId: PropTypes.number
};

export default PlayerShield;
