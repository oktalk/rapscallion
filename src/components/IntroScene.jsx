import Knot from '../images/knot.svg';
import Queen from '../images/queen.svg';
import King from '../images/king.svg';
import Ace from '../images/ace.svg';

export const IntroScene = ({ gameState, toggleModal, startGame }) => {
  return (
    <div>
      <h1 className='is-size-3'>{gameState}</h1>
      <br />
      <p>
        <button data-testid='how-to-play-button' className='button lined thin' onClick={toggleModal}>
          How To Play
        </button>
      </p>
      <img src={Knot} alt='' className='knot' />
      <p className='mb3'>
        <button
          data-test='start-standard-game'
          className='button lined thin'
          onClick={() => startGame('standard')}
        >
          Standard Dungeon
        </button>
      </p>

      <div className='container'>
        <div className='columns'>
          <div className='column'>
            <img src={Queen} alt='Queen of Hearts' width='150' className='img-responsive' data-test='queen' />
            <button
              className='button lined thin'
              onClick={() => startGame('potions')}
            >
              Play As Queen of Hearts
            </button>
            <p>
              There is no limit to how many potions you can use in a room.
              However, you still cannot have more than 21 HP.
            </p>
          </div>

          <div className='column'>
            <img src={King} alt='King of Hearts' width='150' className='img-responsive' data-test='king' />
            <button
              className='button lined thin'
              onClick={() => startGame('noshields')}
            >
              Play As King of Hearts
            </button>
            <p>
              You start with a shield. Your shield does not have a rank and
              cannot break. Unfortunately, you cannot run from a room.
            </p>
          </div>

          <div className='column'>
            <img src={Ace} alt='Ace of Hearts' width='150' className='img-responsive' data-test='ace' />
            <button
              className='button lined thin'
              onClick={() => startGame('nohearts')}
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
