import PropTypes from 'prop-types';
import Card from './Card';
import IconPotion from '../images/potion.svg';

const Potion = ({ suit, number, onPlay }) => (
  <Card
    centerPip={IconPotion}
    suit={suit}
    number={number}
    onClick={() => onPlay({ suit, number })}
  />
);

Potion.propTypes = {
  suit: PropTypes.string.isRequired,
  number: PropTypes.number.isRequired,
  onPlay: PropTypes.func.isRequired,
};

export default Potion;
