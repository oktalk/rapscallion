// jest-dom adds custom matchers for asserting on DOM nodes, for example:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/vitest';

// jsdom has no AnimationEvent, which makes React listen for the prefixed
// webkitAnimationEnd instead of animationend. Stub it before React loads so
// fireEvent.animationEnd reaches onAnimationEnd handlers.
if (typeof window.AnimationEvent === 'undefined') {
  window.AnimationEvent = class AnimationEvent extends Event {};
}

// Starting a game saves it to localStorage. Clear it so one test's run
// does not show up as a "Continue" button in the next test.
afterEach(() => {
  window.localStorage.clear();
});
