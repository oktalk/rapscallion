import { render, screen } from '@testing-library/react';
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
