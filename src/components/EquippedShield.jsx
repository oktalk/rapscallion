import { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import Card from './Card';
import PlayerShield from './PlayerShield';
import IconShield from '../images/shield.svg';

const shieldImpactShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  kind: PropTypes.oneOf(['absorbed', 'broken']).isRequired,
  shield: PropTypes.number.isRequired,
  shieldRank: PropTypes.number.isRequired,
});

// The broken shield splits along a jagged crack and both halves fall away.
const ShatteredShield = ({ shield, shieldRank, onDone }) => {
  const shard = (side) => (
    <div
      className={`shield-shard shield-shard-${side}`}
      onAnimationEnd={side === 'right' ? onDone : undefined}
    >
      <Card
        hasShieldRank={shieldRank > 0}
        shieldRank={shieldRank}
        centerPip={IconShield}
        suit='diamonds'
        number={shield}
      />
    </div>
  );

  return (
    <div className='Player-shield shield-shatter' data-testid='shattered-shield' aria-hidden='true'>
      {shard('left')}
      {shard('right')}
    </div>
  );
};

ShatteredShield.propTypes = {
  shield: PropTypes.number.isRequired,
  shieldRank: PropTypes.number.isRequired,
  onDone: PropTypes.func.isRequired,
};

// Shows the player's shield and reacts to attacks: a recoil when the shield
// absorbs a hit, and a shatter when the hit breaks it.
const EquippedShield = ({ shield, shieldRank, impact = null }) => {
  const [seenImpact, setSeenImpact] = useState(impact);
  const [recoil, setRecoil] = useState(null);
  const [shattered, setShattered] = useState(null);

  // Only react to impacts that happen while mounted, so returning to a room
  // does not replay an old hit.
  if (impact !== seenImpact) {
    setSeenImpact(impact);
    if (impact?.kind === 'absorbed') setRecoil(impact);
    if (impact?.kind === 'broken') setShattered(impact);
  }

  const recoilId = recoil && recoil.shield === shield ? recoil.id : 0;

  return (
    <Fragment>
      {shield > 0 && (
        <PlayerShield key={shield} shield={shield} shieldRank={shieldRank} recoilId={recoilId} />
      )}
      {shattered && (
        <ShatteredShield
          key={shattered.id}
          shield={shattered.shield}
          shieldRank={shattered.shieldRank}
          onDone={(event) => {
            if (event.target === event.currentTarget) setShattered(null);
          }}
        />
      )}
    </Fragment>
  );
};

EquippedShield.propTypes = {
  shield: PropTypes.number.isRequired,
  shieldRank: PropTypes.number.isRequired,
  impact: shieldImpactShape,
};

export default EquippedShield;
