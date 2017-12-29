import React, { Component } from 'react';
import Room from './Room';
import PlayerShield from './PlayerShield';
import './App.css';

class App extends Component {
  state = {
    dungeon: [
      {suit: 'spades', number: 2},{suit: 'spades', number: 3},{suit: 'spades', number: 4},{suit: 'spades', number: 5},{suit: 'spades', number: 6},{suit: 'spades', number: 7},{suit: 'spades', number: 8},{suit: 'spades', number: 9},{suit: 'spades', number: 10},{suit: 'spades', number: 11},{suit: 'spades', number: 12},{suit: 'spades', number: 13},{suit: 'spades', number: 14},{suit: 'hearts', number: 2},{suit: 'hearts', number: 3},{suit: 'hearts', number: 4},{suit: 'hearts', number: 5},{suit: 'hearts', number: 6},{suit: 'hearts', number: 7},{suit: 'hearts', number: 8},{suit: 'hearts', number: 9},{suit: 'hearts', number: 10},{suit: 'hearts', number: 11},{suit: 'hearts', number: 12},{suit: 'hearts', number: 13},{suit: 'hearts', number: 14},{suit: 'diamonds', number: 2},{suit: 'diamonds', number: 3},{suit: 'diamonds', number: 4},{suit: 'diamonds', number: 5},{suit: 'diamonds', number: 6},{suit: 'diamonds', number: 7},{suit: 'diamonds', number: 8},{suit: 'diamonds', number: 9},{suit: 'diamonds', number: 10},{suit: 'diamonds', number: 11},{suit: 'diamonds', number: 12},{suit: 'diamonds', number: 13},{suit: 'diamonds', number: 14},{suit: 'clubs', number: 2},{suit: 'clubs', number: 3},{suit: 'clubs', number: 4},{suit: 'clubs', number: 5},{suit: 'clubs', number: 6},{suit: 'clubs', number: 7},{suit: 'clubs', number: 8},{suit: 'clubs', number: 9},{suit: 'clubs', number: 10},{suit: 'clubs', number: 11},{suit: 'clubs', number: 12},{suit: 'clubs', number: 13},{suit: 'clubs', number: 14}
    ],
    room: [],
    roomContents: {
      enemies: 0,
      enemiesCount: 0,
      potions: 0,
      potionsCount: 0,
      shields: 0,
      shieldsCount: 0,
    },
    hp: 10,
    xp: 0,
    shield: 0,
    shieldRank: 0,
    potionDrank: false,
    progress: 52,
    retreat: true,
    roomComplete: false,
    gameState: ''
  }

  shuffle = () => {
    const gatherCards = this.state.dungeon.concat(this.state.room);
    let counter = gatherCards.length;
    while (counter > 0) {
      let index = Math.floor(Math.random() * counter);
      counter--;
      let temp = gatherCards[counter];
      gatherCards[counter] = gatherCards[index];
      gatherCards[index] = temp;
    }
    const dungeonRoom = gatherCards.splice(-4, gatherCards.length);

    this.setState({
      dungeon: gatherCards,
      room: dungeonRoom,
      progress: gatherCards.length,
      potionDrank: false,
      roomComplete: false,
      gameState: ((dungeonRoom.length === 0 ) ? 'You won!' : this.state.gameState)
    });
  }

  deal = (dungeon) => {
    const room = dungeon.splice(-4, dungeon.length);
    this.setState({
      dungeon,
      room,
      potionDrank: false,
      progress: dungeon.length,
      roomComplete: false,
      retreat: true,
      gameState: ((dungeon.length === 0 ) ? 'You won!' : this.state.gameState)
    });
  }

  returnCards = () => {
    const returnToDeck = this.state.dungeon.concat(this.state.room);
    this.shuffle(returnToDeck);
    this.setState({
      room: [],
      retreat: !this.state.retreat,
      roomComplete: true
    });
  }

  run = () => {
    this.shuffle();
    this.setState({ retreat: !this.state.retreat });
  }

  nextRoom = () => {
    this.shuffle();
    this.setState({ retreat: true });
  }

  updatePlayer = (playerUpdate) => {
    this.setState({...this.state, ...playerUpdate});
  }

  handleClick = (target) => {
    const room = this.state.room.filter(card => {return card.suit !== target.suit || card.number !== target.number});
    this.setState({
      room,
      roomComplete: (this.state.room.length <= 2) ? true : false,
      retreat: false
    });
    if (room.length === 0) {
      this.shuffle();
      this.setState({ retreat: true });
    }
  }

  renderRoom = () => {
    if (this.state.hp > 0 && this.state.room.length > 0) {
      return (<Room {...this.state} updatePlayer={this.updatePlayer} handleClick={this.handleClick} />);
    } else {
      return (<p>{this.state.gameState}</p>);
    }
  }

  componentDidMount() {
    this.shuffle(this.state.dungeon);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Scoundrel</h1>
        </header>
        <p className="App-intro">
          <button onClick={this.nextRoom} disabled={!this.state.roomComplete}>Next Room</button>
          <button onClick={this.run} disabled={!this.state.retreat }>Run</button>
        </p>
        <p>HP: {this.state.hp} Shield: {this.state.shield}/{this.state.shieldRank} XP: {this.state.xp} Progress: {this.state.progress} Potions drank: {this.state.potionDrank}</p>

        <div className="App-room is-clearfix">
          {this.renderRoom()}
        </div>

        <div className="App-shield">
          {this.state.shield > 0 && <PlayerShield shield={this.state.shield} shieldRank={this.state.shieldRank} />}
        </div>
      </div>
    );
  }
}

export default App;
