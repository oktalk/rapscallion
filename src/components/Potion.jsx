import PropTypes from 'prop-types';
import Card from './Card';
import IconPotion from '../images/potion.svg';

const Potion = ({ suit, number, onPlay, className, onAnimationEnd }) => (
  <Card
    centerPip={IconPotion}
    suit={suit}
    number={number}
    onClick={() => onPlay({ suit, number })}
    className={className}
    onAnimationEnd={onAnimationEnd}
  />
);

Potion.propTypes = {
  suit: PropTypes.string.isRequired,
  number: PropTypes.number.isRequired,
  onPlay: PropTypes.func.isRequired,
  className: PropTypes.string,
  onAnimationEnd: PropTypes.func,
};

export default Potion;
