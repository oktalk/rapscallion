import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Card.css';

class Card extends Component {
  static propTypes = {
    suit: PropTypes.string.isRequired,
    number: PropTypes.number.isRequired,
    centerPip: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    hasShieldRank: PropTypes.bool,
    shieldRank: PropTypes.number
  };

  suitColor = () => {
    const { suit } = this.props;
    return suit === 'hearts' || suit === 'diamonds' ? 'red' : 'black';
  };

  centerPipsStyle = () => {
    const { number } = this.props;
    const styles = {
      14: [{ left: '50%', top: '50%' }],
      2: [
        { left: '50%', top: '20%' },
        { left: '50%', top: '80%', transform: 'translate(-50%, -50%) rotate(180deg)' }
      ],
      3: [
        { left: '50%', top: '50%' },
        { left: '50%', top: '20%' },
        { left: '50%', top: '80%', transform: 'translate(-50%, -50%) rotate(180deg)' }
      ],
      4: [
        { left: '33%', top: '20%' },
        { left: '33%', top: '80%', transform: 'translate(-50%, -50%) rotate(180deg)' },
        { left: '67%', top: '20%' },
        { left: '67%', top: '80%', transform: 'translate(-50%, -50%) rotate(180deg)' }
      ],
      5: [
        { left: '50%', top: '50%' },
        { left: '33%', top: '20%' },
        { left: '33%', top: '80%', transform: 'translate(-50%, -50%) rotate(180deg)' },
        { left: '67%', top: '20%' },
        { left: '67%', top: '80%', transform: 'translate(-50%, -50%) rotate(180deg)' }
      ],
      6: [
        { left: '33%', top: '50%' },
        { left: '33%', top: '20%' },
        { left: '33%', top: '80%', transform: 'translate(-50%, -50%) rotate(180deg)' },
        { left: '67%', top: '50%' },
        { left: '67%', top: '20%' },
        { left: '67%', top: '80%', transform: 'translate(-50%, -50%) rotate(180deg)' }
      ],
      7: [
        { left: '33%', top: '50%' },
        { left: '33%', top: '20%' },
        { left: '33%', top: '80%', transform: 'translate(-50%, -50%) rotate(180deg)' },
        { left: '67%', top: '50%' },
        { left: '67%', top: '20%' },
        { left: '67%', top: '80%', transform: 'translate(-50%, -50%) rotate(180deg)' },
        { left: '50%', top: '35%' }
      ],
      8: [
        { left: '33%', top: '20%' },
        { left: '33%', top: '40%' },
        { left: '33%', top: '60%', transform: 'translate(-50%, -50%) rotate(180deg)' },
        { left: '33%', top: '80%', transform: 'translate(-50%, -50%) rotate(180deg)' },
        { left: '67%', top: '20%' },
        { left: '67%', top: '40%' },
        { left: '67%', top: '60%', transform: 'translate(-50%, -50%) rotate(180deg)' },
        { left: '67%', top: '80%', transform: 'translate(-50%, -50%) rotate(180deg)' }
      ],
      9: [
        { left: '50%', top: '50%' },
        { left: '33%', top: '20%' },
        { left: '33%', top: '40%' },
        { left: '33%', top: '60%', transform: 'translate(-50%, -50%) rotate(180deg)' },
        { left: '33%', top: '80%', transform: 'translate(-50%, -50%) rotate(180deg)' },
        { left: '67%', top: '20%' },
        { left: '67%', top: '40%' },
        { left: '67%', top: '60%', transform: 'translate(-50%, -50%) rotate(180deg)' },
        { left: '67%', top: '80%', transform: 'translate(-50%, -50%) rotate(180deg)' }
      ],
      10: [
        { left: '50%', top: '35%' },
        { left: '50%', top: '65%', transform: 'translate(-50%, -50%) rotate(180deg)' },
        { left: '33%', top: '20%' },
        { left: '33%', top: '40%' },
        { left: '33%', top: '60%', transform: 'translate(-50%, -50%) rotate(180deg)' },
        { left: '33%', top: '80%', transform: 'translate(-50%, -50%) rotate(180deg)' },
        { left: '67%', top: '20%' },
        { left: '67%', top: '40%' },
        { left: '67%', top: '60%', transform: 'translate(-50%, -50%) rotate(180deg)' },
        { left: '67%', top: '80%', transform: 'translate(-50%, -50%) rotate(180deg)' }
      ]
    };
    return styles[number] || [];
  };

  face = (number) => {
    const faces = { 11: 'J', 12: 'Q', 13: 'K', 14: 'A', 21: 'I' };
    return faces[number] || number;
  };

  renderCenterPips = () => {
    const { suit, number } = this.props;
    const faceCards = [11, 12, 13, 14, 21];
    if (faceCards.includes(number)) {
      return <h1 key={suit + number}>{this.face(number)}</h1>;
    } else {
      return this.centerPipsStyle().map((style, i) => (
        <div key={suit + number + i} className={`pip ${suit}`} style={style}></div>
      ));
    }
  };

  cardLabel = () => {
    const { suit } = this.props;
    const labels = { hearts: 'Potion', diamonds: 'Shield' };
    return labels[suit] || 'Demon';
  };

  render() {
    const { suit, number, centerPip, onClick, hasShieldRank, shieldRank } = this.props;
    const divStyle = { backgroundImage: `url(${centerPip})` };
    return (
      <div data-test="card" className={`card ${this.suitColor()}`} onClick={onClick}>
        {hasShieldRank && <p className="card-rank">rank: <span className="text-black">{shieldRank}</span></p>}
        <div className="corner top left">
          <h1>{['clubs', 'spades', 'jack', 'joker'].includes(suit) ? '-' : ''}{number}</h1>
          <div className={`pip ${suit}`}><p></p></div>
        </div>
        <div role="img" className="pips center-pip" style={divStyle} />
        <div className="card-label">{this.cardLabel()}</div>
      </div>
    );
  }
}

export default Card;
