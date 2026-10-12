import PropTypes from 'prop-types';
import Card from './Card';
import IconShield from '../images/shield.svg';

const Shield = ({ suit, number, onPlay, className, onAnimationEnd }) => (
  <Card
    centerPip={IconShield}
    suit={suit}
    number={number}
    onClick={() => onPlay({ suit, number })}
    className={className}
    onAnimationEnd={onAnimationEnd}
  />
);

Shield.propTypes = {
  suit: PropTypes.string.isRequired,
  number: PropTypes.number.isRequired,
  onPlay: PropTypes.func.isRequired,
  className: PropTypes.string,
  onAnimationEnd: PropTypes.func,
};

export default Shield;
