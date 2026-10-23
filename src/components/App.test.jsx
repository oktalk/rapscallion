import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import * as game from '../game';

test('renders game title', () => {
  render(<App />);
  const titleElement = screen.getByText(/rapscallion/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders standard dungeon button', () => {
  render(<App />);
  const buttonElement = screen.getByText(/Standard Dungeon/i);
  expect(buttonElement).toBeInTheDocument();
});

test('renders play as queen of hearts button', () => {
  render(<App />);
  const buttonElement = screen.getByText(/Play As Queen of Hearts/i);
  expect(buttonElement).toBeInTheDocument();
});

test('renders play as king of hearts button', () => {
  render(<App />);
  const buttonElement = screen.getByText(/Play As King of Hearts/i);
  expect(buttonElement).toBeInTheDocument();
});

test('renders play as ace of hearts button', () => {
  render(<App />);
  const buttonElement = screen.getByText(/Play As Ace of Hearts/i);
  expect(buttonElement).toBeInTheDocument();
});

describe('playing a standard game', () => {
  const cardLabels = () => screen.queryAllByText(/^(Potion|Shield|Demon)$/);

  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0.999999);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('starting deals four cards and playing an enemy removes it and deals damage', () => {
    render(<App />);
    fireEvent.click(screen.getByText(/Standard Dungeon/i));

    expect(screen.getByText('Progress: 44')).toBeInTheDocument();
    expect(screen.getByText('Basic game')).toBeInTheDocument();
    expect(screen.getByText(/HP: 21/)).toBeInTheDocument();
    expect(cardLabels()).toHaveLength(4);
    expect(screen.getByText('Run')).toBeEnabled();
    expect(screen.getByText('Next Room')).toBeDisabled();

    const enemy = cardLabels()[0].closest('[data-test="card"]');
    fireEvent.click(enemy);
    fireEvent.animationEnd(enemy);

    expect(cardLabels()).toHaveLength(3);
    expect(screen.getByText(/HP: 10/)).toBeInTheDocument();
    expect(screen.getByText(/XP: 11/)).toBeInTheDocument();
    expect(screen.getByText('Run')).toBeDisabled();
  });

  test('running reshuffles the room back into the dungeon and disables Run', () => {
    render(<App />);
    fireEvent.click(screen.getByText(/Standard Dungeon/i));

    fireEvent.click(screen.getByText('Run'));

    expect(cardLabels()).toHaveLength(4);
    expect(screen.getByText('Progress: 44')).toBeInTheDocument();
    expect(screen.getByText('Run')).toBeDisabled();
  });
});

describe('starting each variant from the intro screen', () => {
  test.each([
    ['Standard Dungeon', /Standard Dungeon/i, 'Basic game'],
    ['Queen of Hearts', /Play As Queen of Hearts/i, 'No potion limit'],
    ['King of Hearts', /Play As King of Hearts/i, 'Unbreakable shield'],
    ['Ace of Hearts', /Play As Ace of Hearts/i, 'Heal 3 after each room'],
  ])('%s shows its variant description', (name, buttonText, description) => {
    render(<App />);
    fireEvent.click(screen.getByText(buttonText));

    expect(screen.getByText(description)).toBeInTheDocument();
  });
});

describe('saving and resuming a run', () => {
  const card = (suit, number) => ({ suit, number });
  const cardLabels = () => screen.queryAllByText(/^(Potion|Shield|Demon)$/);
  const savedRun = () => window.localStorage.getItem(game.SAVE_KEY);

  const seedRun = (overrides) => {
    window.localStorage.setItem(
      game.SAVE_KEY,
      game.serializeRun({
        ...game.initialGameState,
        dungeonSize: 48,
        progress: 0,
        roomsEntered: 1,
        gameScene: 'room',
        ...overrides,
      })
    );
  };

  const playFirstCard = (label) => {
    const target = screen.getAllByText(label)[0].closest('[data-test="card"]');
    fireEvent.click(target);
    fireEvent.animationEnd(target);
  };

  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0.999999);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Continue is hidden when nothing is saved', () => {
    render(<App />);
    expect(screen.queryByTestId('continue-game')).not.toBeInTheDocument();
  });

  test('starting a game saves the run', () => {
    render(<App />);
    fireEvent.click(screen.getByText(/Standard Dungeon/i));

    expect(game.loadRun()).toMatchObject({ progress: 44, hp: 21, gameMode: 'standard' });
  });

  test('a refresh mid-room restores the same room, stats, and Run state', () => {
    const { unmount } = render(<App />);
    fireEvent.click(screen.getByText(/Standard Dungeon/i));
    playFirstCard('Demon');
    const before = savedRun();
    unmount();

    render(<App />);
    expect(screen.getByText(/Standard Dungeon/i)).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('continue-game'));

    expect(screen.getByText('Progress: 44')).toBeInTheDocument();
    expect(screen.getByText(/HP: 10/)).toBeInTheDocument();
    expect(screen.getByText(/XP: 11/)).toBeInTheDocument();
    expect(cardLabels()).toHaveLength(3);
    expect(screen.getByText('Run')).toBeDisabled();
    expect(savedRun()).toBe(before);
  });

  test('End game clears the save and hides Continue', () => {
    seedRun({ room: [card('spades', 2), card('hearts', 3)] });
    render(<App />);
    fireEvent.click(screen.getByTestId('continue-game'));

    fireEvent.click(screen.getByTestId('end-game'));

    expect(savedRun()).toBeNull();
    expect(screen.queryByTestId('continue-game')).not.toBeInTheDocument();
  });

  test('losing clears the save', () => {
    seedRun({ hp: 5, room: [card('spades', 14), card('hearts', 3)] });
    render(<App />);
    fireEvent.click(screen.getByTestId('continue-game'));

    playFirstCard('Demon');

    expect(screen.getByText('Game over')).toBeInTheDocument();
    expect(savedRun()).toBeNull();
  });

  test('losing shows the stats for the run', () => {
    seedRun({
      hp: 5,
      xp: 30,
      roomsEntered: 6,
      timesRun: 2,
      room: [card('spades', 14), card('hearts', 3)],
    });
    render(<App />);
    fireEvent.click(screen.getByTestId('continue-game'));

    playFirstCard('Demon');

    expect(screen.getByTestId('end-game-result')).toHaveClass('is-loss');
    expect(screen.getByTestId('stat-xp')).toHaveTextContent('30');
    expect(screen.getByTestId('stat-hp')).toHaveTextContent('0');
    expect(screen.getByTestId('stat-cards')).toHaveTextContent('47 / 48');
    expect(screen.getByTestId('stat-rooms')).toHaveTextContent('6');
    expect(screen.getByTestId('stat-runs')).toHaveTextContent('2');
  });

  test('winning clears the save', () => {
    seedRun({ hp: 10, dungeon: [], room: [card('hearts', 3)] });
    render(<App />);
    fireEvent.click(screen.getByTestId('continue-game'));

    playFirstCard('Potion');

    expect(screen.getByText('You won!')).toBeInTheDocument();
    expect(savedRun()).toBeNull();
  });

  test('winning shows a full deck cleared and the HP left', () => {
    seedRun({ hp: 10, dungeon: [], room: [card('hearts', 3)] });
    render(<App />);
    fireEvent.click(screen.getByTestId('continue-game'));

    playFirstCard('Potion');

    expect(screen.getByTestId('end-game-result')).toHaveClass('is-win');
    expect(screen.getByTestId('stat-hp')).toHaveTextContent('13');
    expect(screen.getByTestId('stat-cards')).toHaveTextContent('48 / 48');
  });

  test('a win does not follow the player back to the title screen', () => {
    seedRun({ hp: 10, dungeon: [], room: [card('hearts', 3)] });
    render(<App />);
    fireEvent.click(screen.getByTestId('continue-game'));
    playFirstCard('Potion');

    fireEvent.click(screen.getByText('Back to Title Screen'));
    expect(screen.queryByText('You won!')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText(/Standard Dungeon/i));
    fireEvent.click(screen.getByTestId('end-game'));
    expect(screen.queryByText('You won!')).not.toBeInTheDocument();
  });

  test('a loss does not follow the player into the next game', () => {
    seedRun({ hp: 5, room: [card('spades', 14), card('hearts', 3)] });
    render(<App />);
    fireEvent.click(screen.getByTestId('continue-game'));
    playFirstCard('Demon');

    fireEvent.click(screen.getByText('Play again?'));
    fireEvent.click(screen.getByTestId('end-game'));

    expect(screen.queryByText('Game over')).not.toBeInTheDocument();
  });

  test('a corrupted save is discarded and the title screen loads normally', () => {
    window.localStorage.setItem(game.SAVE_KEY, '{oops');

    render(<App />);

    expect(screen.getByText(/Standard Dungeon/i)).toBeInTheDocument();
    expect(screen.queryByTestId('continue-game')).not.toBeInTheDocument();
    expect(savedRun()).toBeNull();
  });

  test('a save with missing fields is discarded', () => {
    window.localStorage.setItem(game.SAVE_KEY, JSON.stringify({ hp: 12 }));

    render(<App />);

    expect(screen.queryByTestId('continue-game')).not.toBeInTheDocument();
    expect(savedRun()).toBeNull();
  });
});
