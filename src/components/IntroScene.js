import React from 'react';
import Knot from '../images/knot.svg';
import Queen from '../images/queen.svg';
import King from '../images/king.svg';
import Ace from '../images/ace.svg';

const decks = {
  standard: [
    { suit: 'joker', number: 21 }, { suit: 'jack', number: 21 }, { suit: 'spades', number: 2 }, { suit: 'spades', number: 3 }, { suit: 'spades', number: 4 }, { suit: 'spades', number: 5 }, { suit: 'spades', number: 6 }, { suit: 'spades', number: 7 }, { suit: 'spades', number: 8 }, { suit: 'spades', number: 9 }, { suit: 'spades', number: 10 }, { suit: 'spades', number: 11 }, { suit: 'spades', number: 12 }, { suit: 'spades', number: 13 }, { suit: 'spades', number: 14 }, { suit: 'hearts', number: 2 }, { suit: 'hearts', number: 3 }, { suit: 'hearts', number: 4 }, { suit: 'hearts', number: 5 }, { suit: 'hearts', number: 6 }, { suit: 'hearts', number: 7 }, { suit: 'hearts', number: 8 }, { suit: 'hearts', number: 9 }, { suit: 'hearts', number: 10 }, { suit: 'hearts', number: 11 }, { suit: 'diamonds', number: 2 }, { suit: 'diamonds', number: 3 }, { suit: 'diamonds', number: 4 }, { suit: 'diamonds', number: 5 }, { suit: 'diamonds', number: 6 }, { suit: 'diamonds', number: 7 }, { suit: 'diamonds', number: 8 }, { suit: 'diamonds', number: 9 }, { suit: 'diamonds', number: 10 }, { suit: 'diamonds', number: 11 }, { suit: 'clubs', number: 2 }, { suit: 'clubs', number: 3 }, { suit: 'clubs', number: 4 }, { suit: 'clubs', number: 5 }, { suit: 'clubs', number: 6 }, { suit: 'clubs', number: 7 }, { suit: 'clubs', number: 8 }, { suit: 'clubs', number: 9 }, { suit: 'clubs', number: 10 }, { suit: 'clubs', number: 11 }, { suit: 'clubs', number: 12 }, { suit: 'clubs', number: 13 }, { suit: 'clubs', number: 14 }
  ],
  nohearts: [
    { suit: 'joker', number: 21 }, { suit: 'jack', number: 21 }, { suit: 'spades', number: 2 }, { suit: 'spades', number: 3 }, { suit: 'spades', number: 4 }, { suit: 'spades', number: 5 }, { suit: 'spades', number: 6 }, { suit: 'spades', number: 7 }, { suit: 'spades', number: 8 }, { suit: 'spades', number: 9 }, { suit: 'spades', number: 10 }, { suit: 'spades', number: 11 }, { suit: 'spades', number: 12 }, { suit: 'spades', number: 13 }, { suit: 'spades', number: 14 }, { suit: 'diamonds', number: 2 }, { suit: 'diamonds', number: 3 }, { suit: 'diamonds', number: 4 }, { suit: 'diamonds', number: 5 }, { suit: 'diamonds', number: 6 }, { suit: 'diamonds', number: 7 }, { suit: 'diamonds', number: 8 }, { suit: 'diamonds', number: 9 }, { suit: 'diamonds', number: 10 }, { suit: 'diamonds', number: 11 }, { suit: 'clubs', number: 2 }, { suit: 'clubs', number: 3 }, { suit: 'clubs', number: 4 }, { suit: 'clubs', number: 5 }, { suit: 'clubs', number: 6 }, { suit: 'clubs', number: 7 }, { suit: 'clubs', number: 8 }, { suit: 'clubs', number: 9 }, { suit: 'clubs', number: 10 }, { suit: 'clubs', number: 11 }, { suit: 'clubs', number: 12 }, { suit: 'clubs', number: 13 }, { suit: 'clubs', number: 14 }
  ],
  noshields: [
    { suit: 'joker', number: 21 }, { suit: 'jack', number: 21 }, { suit: 'spades', number: 2 }, { suit: 'spades', number: 3 }, { suit: 'spades', number: 4 }, { suit: 'spades', number: 5 }, { suit: 'spades', number: 6 }, { suit: 'spades', number: 7 }, { suit: 'spades', number: 8 }, { suit: 'spades', number: 9 }, { suit: 'spades', number: 10 }, { suit: 'spades', number: 11 }, { suit: 'spades', number: 12 }, { suit: 'spades', number: 13 }, { suit: 'spades', number: 14 }, { suit: 'hearts', number: 2 }, { suit: 'hearts', number: 3 }, { suit: 'hearts', number: 4 }, { suit: 'hearts', number: 5 }, { suit: 'hearts', number: 6 }, { suit: 'hearts', number: 7 }, { suit: 'hearts', number: 8 }, { suit: 'hearts', number: 9 }, { suit: 'hearts', number: 10 }, { suit: 'hearts', number: 11 }, { suit: 'clubs', number: 2 }, { suit: 'clubs', number: 3 }, { suit: 'clubs', number: 4 }, { suit: 'clubs', number: 5 }, { suit: 'clubs', number: 6 }, { suit: 'clubs', number: 7 }, { suit: 'clubs', number: 8 }, { suit: 'clubs', number: 9 }, { suit: 'clubs', number: 10 }, { suit: 'clubs', number: 11 }, { suit: 'clubs', number: 12 }, { suit: 'clubs', number: 13 }, { suit: 'clubs', number: 14 }
  ]
};

export const IntroScene = ({ gameState, toggleModal, resetDungeon }) => {
  return (
    <div>
      <h1 className='is-size-3'>{gameState}</h1>
      <br />
      <p>
        <button className='button lined thin' onClick={toggleModal}>
          How To Play
        </button>
      </p>
      <img src={Knot} className='knot' />
      <p className='mb3'>
        <button
          className='button lined thin'
          onClick={() => resetDungeon(decks.standard)}
        >
          Standard Dungeon
        </button>
      </p>

      <div className='container'>
        <div className='columns'>
          <div className='column'>
            <img src={Queen} width='150' className='img-responsive' />
            <button
              className='button lined thin'
              onClick={() => resetDungeon(decks.standard, 'potions')}
            >
              Play As Queen of Hearts
            </button>
            <p>
              There is no limit to how many potions you can use in a room.
              However, you still cannot have more than 21 HP.
            </p>
          </div>

          <div className='column'>
            <img src={King} width='150' className='img-responsive' />
            <button
              className='button lined thin'
              onClick={() => resetDungeon(decks.noshields, 'noshields')}
            >
              Play As King of Hearts
            </button>
            <p>
              You start with a shield. Your shield does not have a rank and
              cannot break. Unfortunately, you cannot run from a room.
            </p>
          </div>

          <div className='column'>
            <img src={Ace} width='150' className='img-responsive' />
            <button
              className='button lined thin'
              onClick={() => resetDungeon(decks.nohearts, 'nohearts')}
            >
              Play As Ace of Hearts
            </button>
            <p>
              After every room you heal 3 points, but potions have been removed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
