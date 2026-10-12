import PropTypes from 'prop-types';
import Card from './Card';
import IconShield from '../images/shield.svg';

const Shield = ({ suit, number, onPlay }) => (
  <Card
    centerPip={IconShield}
    suit={suit}
    number={number}
    onClick={() => onPlay({ suit, number })}
  />
);

Shield.propTypes = {
  suit: PropTypes.string.isRequired,
  number: PropTypes.number.isRequired,
  onPlay: PropTypes.func.isRequired,
};

export default Shield;
