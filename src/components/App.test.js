import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

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
    jest.spyOn(Math, 'random').mockReturnValue(0.999999);
  });

  afterEach(() => {
    jest.restoreAllMocks();
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

    fireEvent.click(cardLabels()[0]);

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
