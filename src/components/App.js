import React, { Component } from 'react';
import classnames from 'classnames';
import Room from './Room';
import PlayerShield from './PlayerShield';
import './App.css';

const decks = {
    standard: [
      {suit: 'joker', number: 21},{suit: 'jack', number: 21},{suit: 'spades', number: 2},{suit: 'spades', number: 3},{suit: 'spades', number: 4},{suit: 'spades', number: 5},{suit: 'spades', number: 6},{suit: 'spades', number: 7},{suit: 'spades', number: 8},{suit: 'spades', number: 9},{suit: 'spades', number: 10},{suit: 'spades', number: 11},{suit: 'spades', number: 12},{suit: 'spades', number: 13},{suit: 'spades', number: 14},{suit: 'hearts', number: 2},{suit: 'hearts', number: 3},{suit: 'hearts', number: 4},{suit: 'hearts', number: 5},{suit: 'hearts', number: 6},{suit: 'hearts', number: 7},{suit: 'hearts', number: 8},{suit: 'hearts', number: 9},{suit: 'hearts', number: 10},{suit: 'hearts', number: 11},{suit: 'diamonds', number: 2},{suit: 'diamonds', number: 3},{suit: 'diamonds', number: 4},{suit: 'diamonds', number: 5},{suit: 'diamonds', number: 6},{suit: 'diamonds', number: 7},{suit: 'diamonds', number: 8},{suit: 'diamonds', number: 9},{suit: 'diamonds', number: 10},{suit: 'diamonds', number: 11},{suit: 'clubs', number: 2},{suit: 'clubs', number: 3},{suit: 'clubs', number: 4},{suit: 'clubs', number: 5},{suit: 'clubs', number: 6},{suit: 'clubs', number: 7},{suit: 'clubs', number: 8},{suit: 'clubs', number: 9},{suit: 'clubs', number: 10},{suit: 'clubs', number: 11},{suit: 'clubs', number: 12},{suit: 'clubs', number: 13},{suit: 'clubs', number: 14}
    ],
    nohearts: [
      {suit: 'joker', number: 21},{suit: 'jack', number: 21},{suit: 'spades', number: 2},{suit: 'spades', number: 3},{suit: 'spades', number: 4},{suit: 'spades', number: 5},{suit: 'spades', number: 6},{suit: 'spades', number: 7},{suit: 'spades', number: 8},{suit: 'spades', number: 9},{suit: 'spades', number: 10},{suit: 'spades', number: 11},{suit: 'spades', number: 12},{suit: 'spades', number: 13},{suit: 'spades', number: 14},{suit: 'diamonds', number: 2},{suit: 'diamonds', number: 3},{suit: 'diamonds', number: 4},{suit: 'diamonds', number: 5},{suit: 'diamonds', number: 6},{suit: 'diamonds', number: 7},{suit: 'diamonds', number: 8},{suit: 'diamonds', number: 9},{suit: 'diamonds', number: 10},{suit: 'diamonds', number: 11},{suit: 'clubs', number: 2},{suit: 'clubs', number: 3},{suit: 'clubs', number: 4},{suit: 'clubs', number: 5},{suit: 'clubs', number: 6},{suit: 'clubs', number: 7},{suit: 'clubs', number: 8},{suit: 'clubs', number: 9},{suit: 'clubs', number: 10},{suit: 'clubs', number: 11},{suit: 'clubs', number: 12},{suit: 'clubs', number: 13},{suit: 'clubs', number: 14}
    ],
    noshields: [
      {suit: 'joker', number: 21},{suit: 'jack', number: 21},{suit: 'spades', number: 2},{suit: 'spades', number: 3},{suit: 'spades', number: 4},{suit: 'spades', number: 5},{suit: 'spades', number: 6},{suit: 'spades', number: 7},{suit: 'spades', number: 8},{suit: 'spades', number: 9},{suit: 'spades', number: 10},{suit: 'spades', number: 11},{suit: 'spades', number: 12},{suit: 'spades', number: 13},{suit: 'spades', number: 14},{suit: 'hearts', number: 2},{suit: 'hearts', number: 3},{suit: 'hearts', number: 4},{suit: 'hearts', number: 5},{suit: 'hearts', number: 6},{suit: 'hearts', number: 7},{suit: 'hearts', number: 8},{suit: 'hearts', number: 9},{suit: 'hearts', number: 10},{suit: 'hearts', number: 11},{suit: 'clubs', number: 2},{suit: 'clubs', number: 3},{suit: 'clubs', number: 4},{suit: 'clubs', number: 5},{suit: 'clubs', number: 6},{suit: 'clubs', number: 7},{suit: 'clubs', number: 8},{suit: 'clubs', number: 9},{suit: 'clubs', number: 10},{suit: 'clubs', number: 11},{suit: 'clubs', number: 12},{suit: 'clubs', number: 13},{suit: 'clubs', number: 14}
    ]
  };

class App extends Component {
  state = {
    dungeon: [],
    dungeonType: 'nohearts',
    regenerate: 0,
    room: [],
    hp: 21,
    xp: 0,
    shield: 0,
    shieldRank: 0,
    potionDrank: false,
    potionLimit: true,
    breakableShield: true,
    progress: 52,
    retreat: false,
    isRoomComplete: false,
    modal: false,
    gameState: ''
  }

  shuffle = (currentDungeon, currentRoom) => {
    const gatherCards = currentDungeon.concat(currentRoom);
    let counter = gatherCards.length;

    while (counter > 0) {
      let index = Math.floor(Math.random() * counter);
      counter--;
      let temp = gatherCards[counter];
      gatherCards[counter] = gatherCards[index];
      gatherCards[index] = temp;
    }
    const dungeonRoom = gatherCards.splice(-4, gatherCards.length);
    this.setState(prevState => ({
      dungeon: gatherCards,
      hp: prevState.hp + this.state.regenerate,
      room: dungeonRoom,
      progress: gatherCards.length,
      potionDrank: false,
      isRoomComplete: false,
      gameState: ((dungeonRoom.length === 0 ) ? 'You won!' : this.state.gameState)
    }));
  }

  deal = (dungeon) => {
    const room = dungeon.splice(-4, dungeon.length);
    this.setState(prevState => ({
      dungeon,
      room,
      hp: prevState.hp + this.state.regenerate,
      potionDrank: false,
      progress: dungeon.length,
      roomComplete: false,
      retreat: true,
      isRoomComplete: false,
      gameState: ((dungeon.length === 0 ) ? 'You won!' : '')
    }));
  }

  run = () => {
    this.shuffle(this.state.dungeon, this.state.room);
    this.setState({ retreat: !this.state.retreat });
  }

  nextRoom = () => {
    this.shuffle(this.state.dungeon, this.state.room);
    this.setState({ retreat: this.state.breakableShield});
  }

  resetDungeon = (deck, type) => {
    this.shuffle(deck, []);
    this.setState({
      dungeonSize: deck.length,
      regenerate: (type === 'nohearts') ? 3 : 0,
      potionLimit: (type === 'potions') ? false : true,
      breakableShield: (type === 'noshields') ? false : true,
      hp: 21,
      xp: 0,
      shield: (type === 'noshields') ? 7 : 0,
      shieldRank: 0,
      retreat: (type === 'noshields') ? false : true,
    });
  }

  updatePlayer = (playerUpdate) => {
    this.setState(prevState => ({
      ...prevState, ...playerUpdate
    }));
  }

  handleClick = (target) => {
    const room = this.state.room.filter(card => {return card.suit !== target.suit || card.number !== target.number});
    this.setState({
      room,
      isRoomComplete: (room.length <= 1) ? true : false,
      retreat: false
    }, () => {
      if (room.length === 0) {
        this.deal(this.state.dungeon);
      }
    });
  }

  renderRoom = () => {
    if (this.state.hp > 0 && this.state.room.length > 0) {
      return (<Room {...this.state} gainXP={this.gainXP} updatePlayer={this.updatePlayer} handleClick={this.handleClick} />);
    } else {
      return (
        <div>
          <p>{this.state.gameState}</p>
          <p><button className="button lined thin" onClick={this.toggleModal}>How To Play</button></p>
          <p>
            <button className="button lined thin" onClick={() => this.resetDungeon(decks.standard)}>Standard Dungeon</button>
          </p>

          <button className="button lined thin" onClick={() => this.resetDungeon(decks.standard, 'potions')}>Play As Queen of Hearts</button>
          <p>
            There is no limit to how many potions you can use in a room. However, you still cannot have more than 21 HP.
          </p>

          <button className="button lined thin" onClick={() => this.resetDungeon(decks.noshields, 'noshields')}>Play As King of Hearts</button>
          <p>
            You start with a shield. Your shield does not have a rank and cannot break. Unfortunately, you cannot run from a room.
          </p>

          <button className="button lined thin" onClick={() => this.resetDungeon(decks.nohearts, 'nohearts')}>Play As Ace of Hearts</button>
          <p>
            After every room you heal 3 points, but potions have been removed.
          </p>
        </div>
      );
    }
  }

  renderShield = () => {
    if (this.state.hp > 0 && this.state.room.length > 0) {
      return (
        <div className="App-shield">
          {this.state.shield > 0 && <PlayerShield shield={this.state.shield} shieldRank={this.state.shieldRank} />}
        </div>
      );
    }
  }

  toggleModal = () => {
    this.setState({ modal: !this.state.modal });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">rapscallion</h1>
        </header>
        <div className="progress-bar">
          <span className="progress-bar-rating" style={{width: ((this.state.dungeonSize - this.state.progress) / this.state.dungeonSize * 100) + '%'}}>{(Math.ceil((48 - this.state.progress) / 48 * 100)) + '% Complete'}</span>
        </div>
        { this.state.progress > 0 &&
          <p className="App-intro">
            <button className="button lined thin" onClick={this.nextRoom} disabled={!this.state.isRoomComplete}>Next Room</button>
            <button className="button lined thin" onClick={this.run} disabled={!this.state.retreat }>Run</button>
          </p>
        }
        <p>HP: {this.state.hp} Shield: {this.state.shield}/{this.state.shieldRank} XP: {this.state.xp} Progress: {this.state.progress} Potions drank: {this.state.potionDrank && '1'}</p>

        <div className="App-room is-clearfix">
          {this.renderRoom()}
        </div>

        {this.renderShield()}

        {this.state.modal &&
          <div className={classnames('modal', {'is-active' : this.state.modal})}>
            <div className="modal-background"></div>
            <div className="modal-card">
              <header className="modal-card-head">
                <p className="modal-card-title">Instructions:</p>
                <button className="delete" aria-label="close" onClick={this.toggleModal}></button>
              </header>
              <section className="modal-card-body">
                <p>Your enemies are <strong>Spades</strong> and <strong>Clubs</strong>. They will subtract their face value from your <strong>HP</strong>. You can regain <strong>HP</strong> by taking a <strong>potion</strong>. Cards in the suit of <strong>Heart</strong> are potions and will add to your <strong>HP</strong> up to 21. You may only have one <strong>potion</strong> in a room. To help fight enemies equip a <strong>shield</strong>. The <strong>Diamond</strong> cards are shields. Equipping a <strong>shield</strong> and attacking an enemy will set a new rank on your <strong>shield</strong>. Attacking an enemy with a higher face value than your <strong>shield</strong> rank will break your shield. </p>
              </section>
              <footer className="modal-card-foot">
                <button className="button" onClick={this.toggleModal}>Close</button>
              </footer>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default App;
