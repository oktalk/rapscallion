import React, { Component } from 'react';
import classnames from 'classnames';
import PlayerShield from './PlayerShield';
import { IntroScene } from './IntroScene';
import { RoomScene } from './RoomScene';
import './App.css';

const GameScene = ({
  initialState,
  backToIntro,
  updatePlayer,
  handleClick,
  gainXP,
  run,
  nextRoom,
  toggleModal,
  resetDungeon
}) => {
  console.log(initialState.gameScene);
  switch (initialState.gameScene) {
    case 'room':
      return (
        <RoomScene
          initialState={initialState}
          backToIntro={backToIntro}
          updatePlayer={updatePlayer}
          handleClick={handleClick}
          gainXP={gainXP}
          run={run}
          nextRoom={nextRoom}
        />
      );
    default:
      return (
        <IntroScene
          gameState={initialState.gameState}
          toggleModal={toggleModal}
          resetDungeon={resetDungeon}
        />
      );
  }
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
    gameState: '',
    gameVariant: '',
    gameScene: 'intro'
  }

  shuffle = (currentDungeon, currentRoom) => {
    const gatherCards = [...currentDungeon, ...currentRoom];
    for (let i = gatherCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gatherCards[i], gatherCards[j]] = [gatherCards[j], gatherCards[i]];
    }
    const dungeonRoom = gatherCards.splice(-4);
    this.setState((prevState) => ({
      ...prevState,
      dungeon: gatherCards,
      hp: prevState.hp + this.state.regenerate,
      room: dungeonRoom,
      progress: gatherCards.length,
      potionDrank: false,
      isRoomComplete: false,
      gameState: dungeonRoom.length === 0 ? 'You won!' : prevState.gameState,
      gameScene: dungeonRoom.length === 0 ? 'winGame' : prevState.gameScene,
    }));
  }

  deal = (dungeon) => {
    const room = dungeon.splice(-4);
    this.setState((prevState) => ({
      ...prevState,
      dungeon,
      room,
      hp: prevState.hp + this.state.regenerate,
      potionDrank: false,
      progress: dungeon.length,
      roomComplete: false,
      retreat: true,
      isRoomComplete: false,
      gameState: dungeon.length === 0 ? 'You won!' : '',
      gameScene: dungeon.length === 0 ? 'winGame' : prevState.gameScene,
    }));
  }

  run = () => {
    console.log('run');
    this.shuffle(this.state.dungeon, this.state.room);
    this.setState((prevState) => ({
      ...prevState,
      retreat: !prevState.retreat,
    }));
  }

  nextRoom = () => {
    this.shuffle(this.state.dungeon, this.state.room);
    this.setState((prevState) => ({
      ...prevState,
      retreat: this.state.breakableShield
    }));
  }

  resetDungeon = (deck, type) => {
    const gameDesc = {
      nohearts: 'Heal 3 after each room',
      noshields: 'Unbreakable shield',
      potions: 'No potion limit'
    }[type];

    this.shuffle(deck, []);
    this.setState((prevState) => ({
      ...prevState,
      dungeonSize: deck.length,
      regenerate: type === 'nohearts' ? 3 : 0,
      potionLimit: type === 'potions' ? false : true,
      breakableShield: type === 'noshields' ? false : true,
      hp: 21,
      xp: 0,
      shield: type === 'noshields' ? 7 : 0,
      shieldRank: 0,
      retreat: type === 'noshields' ? false : true,
      gameVariant: gameDesc,
      gameScene: 'room'
    }));
  }

  updatePlayer = (playerUpdate) => {
    this.setState(prevState => ({
      ...prevState, ...playerUpdate
    }));
  }

  handleClick = (target) => {
    const room = this.state.room.filter(card => card.suit !== target.suit || card.number !== target.number);
    this.setState((prevState) => ({
      ...prevState,
      room,
      isRoomComplete: room.length <= 1,
      retreat: false
    }), () => {
      if (room.length === 0) {
        this.deal(this.state.dungeon);
      }
    });
  }

  backToIntro = () => {
    this.setState((prevState) => ({
      ...prevState,
      gameScene: 'intro',
    }));
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
    this.setState((prevState) => ({ ...prevState, modal: !this.state.modal }));
  }

  render() {
    return (
      <div className='App mb3'>
        <header className='App-header'>
          <h1 className='App-title'>rapscallion</h1>
        </header>

        <GameScene
          initialState={this.state}
          backToIntro={this.backToIntro}
          updatePlayer={this.updatePlayer}
          handleClick={this.handleClick}
          gainXP={this.gainXP}
          run={this.run}
          nextRoom={this.nextRoom}
          toggleModal={this.toggleModal}
          resetDungeon={this.resetDungeon}
        />

        {this.state.modal && (
          <div
            className={classnames('modal', { 'is-active': this.state.modal })}
          >
            <div className='modal-background'></div>
            <div className='modal-card'>
              <header className='modal-card-head'>
                <p className='modal-card-title'>Instructions:</p>
                <button
                  className='delete'
                  aria-label='close'
                  onClick={this.toggleModal}
                ></button>
              </header>
              <section className='modal-card-body'>
                <p>
                  Your enemies are <strong>Spades</strong> and{' '}
                  <strong>Clubs</strong>. They will subtract their face value
                  from your <strong>HP</strong>. You can regain{' '}
                  <strong>HP</strong> by taking a <strong>potion</strong>. Cards
                  in the suit of <strong>Heart</strong> are potions and will add
                  to your <strong>HP</strong> up to 21. You may only have one{' '}
                  <strong>potion</strong> in a room. To help fight enemies equip
                  a <strong>shield</strong>. The <strong>Diamond</strong> cards
                  are shields. Equipping a <strong>shield</strong> and attacking
                  an enemy will set a new rank on your <strong>shield</strong>.
                  Attacking an enemy with a higher face value than your{' '}
                  <strong>shield</strong> rank will break your shield.{' '}
                </p>
              </section>
              <footer className='modal-card-foot'>
                <button className='button' onClick={this.toggleModal}>
                  Close
                </button>
              </footer>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default App;
