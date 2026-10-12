import { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

const HEAVY_HIT = 10;
const MEDIUM_HIT = 5;

const changeClass = (delta) => {
  if (delta > 0) return 'hp-heal';
  if (-delta >= HEAVY_HIT) return 'hp-hit hp-hit-heavy';
  if (-delta >= MEDIUM_HIT) return 'hp-hit hp-hit-medium';
  return 'hp-hit hp-hit-light';
};

// Animates the HP readout when it changes. Healing pulses red and grows;
// damage shakes and dims, harder for bigger hits, and heavy hits also flash
// the edges of the screen. Each change floats its amount above the readout.
const HitPoints = ({ hp }) => {
  const [prevHp, setPrevHp] = useState(hp);
  const [change, setChange] = useState(null);

  if (hp !== prevHp) {
    setPrevHp(hp);
    setChange((current) => ({ id: (current?.id ?? 0) + 1, delta: hp - prevHp }));
  }

  // New keys remount the elements, which restarts their animations.
  return (
    <Fragment>
      <span className='hp-readout'>
        <span key={change?.id ?? 0} className={change ? `hp ${changeClass(change.delta)}` : 'hp'}>
          HP: {hp}
        </span>
        {change && (
          <span
            key={`float-${change.id}`}
            className={`hp-float ${change.delta > 0 ? 'hp-float-gain' : 'hp-float-loss'}`}
            aria-hidden='true'
          >
            {change.delta > 0 ? `+${change.delta}` : change.delta}
          </span>
        )}
      </span>
      {change && -change.delta >= HEAVY_HIT && (
        <span key={`flash-${change.id}`} className='damage-flash' aria-hidden='true' />
      )}
    </Fragment>
  );
};

HitPoints.propTypes = {
  hp: PropTypes.number.isRequired,
};

export default HitPoints;
