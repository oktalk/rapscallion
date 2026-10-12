import PropTypes from 'prop-types';
import Card from './Card';
import IconDragon from '../images/dragon.svg';

const Enemy = ({ suit, number, onPlay }) => (
  <Card
    centerPip={IconDragon}
    suit={suit}
    number={number}
    onClick={() => onPlay({ suit, number })}
  />
);

Enemy.propTypes = {
  suit: PropTypes.string.isRequired,
  number: PropTypes.number.isRequired,
  onPlay: PropTypes.func.isRequired,
};

export default Enemy;
