import { Component } from 'react';
import classnames from 'classnames';
import * as game from '../game';
import { GameScene } from './GameScene';
import './App.css';

class App extends Component {
  state = {
    ...game.initialGameState,
    modal: false,
    shieldImpact: null,
  };

  startGame = (mode) => {
    this.setState((prevState) => game.newGame(prevState, mode));
  };

  run = () => {
    this.setState((prevState) => game.run(prevState));
  };

  nextRoom = () => {
    this.setState((prevState) => game.nextRoom(prevState));
  };

  playCard = (card) => {
    this.setState((prevState) => {
      const next = game.playCard(prevState, card);
      const kind = game.shieldImpact(prevState, next, card);
      if (!kind) return next;
      return {
        ...next,
        shieldImpact: {
          id: (prevState.shieldImpact?.id ?? 0) + 1,
          kind,
          shield: prevState.shield,
          shieldRank: prevState.shieldRank,
        },
      };
    });
  };

  backToIntro = () => {
    this.setState({ gameScene: 'intro' });
  };

  toggleModal = () => {
    this.setState((prevState) => ({ modal: !prevState.modal }));
  };

  render() {
    return (
      <div className='App mb3'>
        <header className='App-header'>
          <h1 className='App-title' data-test='App-title'>
            rapscallion
          </h1>
        </header>

        <GameScene
          initialState={this.state}
          backToIntro={this.backToIntro}
          playCard={this.playCard}
          run={this.run}
          nextRoom={this.nextRoom}
          toggleModal={this.toggleModal}
          startGame={this.startGame}
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
