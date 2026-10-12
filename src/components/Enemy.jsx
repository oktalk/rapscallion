import PropTypes from 'prop-types';
import Card from './Card';
import IconDragon from '../images/dragon.svg';

const Enemy = ({ suit, number, onPlay, className, onAnimationEnd }) => (
  <Card
    centerPip={IconDragon}
    suit={suit}
    number={number}
    onClick={() => onPlay({ suit, number })}
    className={className}
    onAnimationEnd={onAnimationEnd}
  />
);

Enemy.propTypes = {
  suit: PropTypes.string.isRequired,
  number: PropTypes.number.isRequired,
  onPlay: PropTypes.func.isRequired,
  className: PropTypes.string,
  onAnimationEnd: PropTypes.func,
};

export default Enemy;
