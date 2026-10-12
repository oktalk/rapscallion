import React from 'react';
import { render, screen, act } from '@testing-library/react';
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


test('dying on the last card of a room preserves Game over state', () => {
  const ref = React.createRef();
  render(<App ref={ref} />);
  const app = ref.current;

  act(() => {
    app.setState({
      hp: 0,
      gameState: 'Game over',
      gameScene: 'endGame',
      dungeon: [],
      room: [{ suit: 'spades', number: 5 }],
    });
  });

  act(() => {
    app.deal([]);
  });

  expect(app.state.gameState).toBe('Game over');
  expect(app.state.gameScene).toBe('endGame');
});
