import PropTypes from 'prop-types';
import classnames from 'classnames';
import Card from './Card';
import IconShield from '../images/shield.svg';
import IconShieldGold from '../images/shield-gold.svg';
import './PlayerShield.css';

const PlayerShield = ({ shield, shieldRank, recoilId = 0, golden = false }) => {
  return (
    <div className="Player-shield">
      {/* A new key remounts the card, which restarts the recoil animation. */}
      <Card
        key={recoilId}
        className={classnames({ 'shield-recoil': recoilId > 0, 'shield-golden': golden }) || undefined}
        hasShieldRank={shieldRank > 0}
        shieldRank={shieldRank}
        centerPip={golden ? IconShieldGold : IconShield}
        suit='diamonds'
        number={shield} />
    </div>
  );
};

PlayerShield.propTypes = {
  shield: PropTypes.number.isRequired,
  shieldRank: PropTypes.number.isRequired,
  recoilId: PropTypes.number,
  golden: PropTypes.bool
};

export default PlayerShield;
