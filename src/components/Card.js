import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Card.css';

class Card extends Component {
  static propTypes = {
    suit: PropTypes.string.isRequired,
    number: PropTypes.number.isRequired
  };

  suitColor() {
    switch (this.props.suit) {
      case 'hearts':
        return 'red';
      case 'diamonds':
        return 'red';
      default:
        return 'black';
    }
  }

  centerPipsStyle() {
    switch (this.props.number) {
      case 14:
        return [
          { left: '50%', top: '50%' }
        ];
      case 2:
        return [
          { left: '50%', top: '20%' },
          { left: '50%', top: '80%', transform: 'translate(-50%, -50%) rotate(180deg)' }
        ];
      case 3:
        return [
          { left: '50%', top: '50%' },
          { left: '50%', top: '20%' },
          { left: '50%', top: '80%', transform: 'translate(-50%, -50%) rotate(180deg)' }
        ];
      case 4:
        return [
          { left: '33%', top: '20%' },
          { left: '33%', top: '80%', transform: 'translate(-50%, -50%) rotate(180deg)' },
          { left: '67%', top: '20%' },
          { left: '67%', top: '80%', transform: 'translate(-50%, -50%) rotate(180deg)' }
        ];
      case 5:
        return [
          { left: '50%', top: '50%' },
          { left: '33%', top: '20%' },
          { left: '33%', top: '80%', transform: 'translate(-50%, -50%) rotate(180deg)' },
          { left: '67%', top: '20%' },
          { left: '67%', top: '80%', transform: 'translate(-50%, -50%) rotate(180deg)' }
        ];
      case 6:
        return [
          { left: '33%', top: '50%' },
          { left: '33%', top: '20%' },
          { left: '33%', top: '80%', transform: 'translate(-50%, -50%) rotate(180deg)' },
          { left: '67%', top: '50%' },
          { left: '67%', top: '20%' },
          { left: '67%', top: '80%', transform: 'translate(-50%, -50%) rotate(180deg)' }
        ];
      case 7:
        return [
          { left: '33%', top: '50%' },
          { left: '33%', top: '20%' },
          { left: '33%', top: '80%', transform: 'translate(-50%, -50%) rotate(180deg)' },
          { left: '67%', top: '50%' },
          { left: '67%', top: '20%' },
          { left: '67%', top: '80%', transform: 'translate(-50%, -50%) rotate(180deg)' },
          { left: '50%', top: '35%' }
        ];
      case 8:
        return [
          { left: '33%', top: '20%' },
          { left: '33%', top: '40%' },
          { left: '33%', top: '60%', transform: 'translate(-50%, -50%) rotate(180deg)' },
          { left: '33%', top: '80%', transform: 'translate(-50%, -50%) rotate(180deg)' },
          { left: '67%', top: '20%' },
          { left: '67%', top: '40%' },
          { left: '67%', top: '60%', transform: 'translate(-50%, -50%) rotate(180deg)' },
          { left: '67%', top: '80%', transform: 'translate(-50%, -50%) rotate(180deg)' }
        ];
      case 9:
        return [
          { left: '50%', top: '50%' },
          { left: '33%', top: '20%' },
          { left: '33%', top: '40%' },
          { left: '33%', top: '60%', transform: 'translate(-50%, -50%) rotate(180deg)' },
          { left: '33%', top: '80%', transform: 'translate(-50%, -50%) rotate(180deg)' },
          { left: '67%', top: '20%' },
          { left: '67%', top: '40%' },
          { left: '67%', top: '60%', transform: 'translate(-50%, -50%) rotate(180deg)' },
          { left: '67%', top: '80%', transform: 'translate(-50%, -50%) rotate(180deg)' }
        ];
      case 10:
        return [
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
        ];
      default:
        return [];
    }
  }

  renderCenterPips = () => {
    const faceCards = [11, 12, 13, 14, 21];
    let pips = [];
    if (faceCards.includes(this.props.number)) {
      function face(number) {
        switch (number) {
          case 11:
            return 'J';
          case 12:
            return 'Q';
          case 13:
            return 'K';
          case 14:
            return 'A';
          case 21:
            return 'I';
          default:
            return;
        }
      }
      pips = <h1 key={this.props.suit + this.props.number}>{face(this.props.number)}</h1>;
    } else {
      const pipStyle = this.centerPipsStyle();
      for (let i = 0; i < this.props.number; i++) {
        pips.push(<div key={this.props.suit + this.props.number + i} className={'pip ' + this.props.suit} style={pipStyle[i]}></div>);
      }
    }
    return pips;
  }

  render() {
    return (
      <div className={'card ' + this.suitColor()} onClick={this.props.onClick}>
        <div className="corner top left">
          <h1>{this.props.number}</h1>
          <div className={'pip ' + this.props.suit}><p></p></div>
        </div>
        <div className="pips">
          {this.renderCenterPips()}
        </div>
        <div className="corner bottom right">
          <h1>{this.props.number}</h1>
          <div className={'pip ' + this.props.suit}><p></p></div>
        </div>
      </div>
    );
  }
}

export default Card;
