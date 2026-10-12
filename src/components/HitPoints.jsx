import { useState } from 'react';
import PropTypes from 'prop-types';

// Pulses the HP readout whenever it changes (damage, potions, healing).
const HitPoints = ({ hp }) => {
  const [prevHp, setPrevHp] = useState(hp);
  const [changes, setChanges] = useState(0);

  if (hp !== prevHp) {
    setPrevHp(hp);
    setChanges((count) => count + 1);
  }

  // A new key remounts the span, which restarts the pulse animation.
  return (
    <span key={changes} className={changes > 0 ? 'hp hp-pulse' : 'hp'}>
      HP: {hp}
    </span>
  );
};

HitPoints.propTypes = {
  hp: PropTypes.number.isRequired,
};

export default HitPoints;
