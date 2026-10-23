import { initialGameState, serializeRun, SAVE_KEY } from '../../src/game';

describe('template spec', () => {
  beforeEach(() => {
    cy.visit('/')
  });

  context("Home page loads correctly", () => {
    it('passes', () => {
      cy.visit('/');
      cy.get('[data-test="App-title"]').contains('rapscallion');
    });
    it('the features on the homepage are correct', () => {
      cy.visit('/');
      cy.get('.knot');
      cy.get(':nth-child(1) > .img-responsive').should(
        'have.attr',
        'data-test',
        'queen'
      );
      cy.get(':nth-child(2) > .img-responsive').should(
        'have.attr',
        'data-test',
        'king'
      );
      cy.get(':nth-child(3) > .img-responsive').should(
        'have.attr',
        'data-test',
        'ace'
      );
    });
  });

  context("Can play standard game", () => {
    it("from the home page user can start a standard game", () => {
      cy.visit('/');
      cy.get('[data-test="start-standard-game"]').contains('Standard Dungeon').click();
      cy.get('[data-test="progress label"]').contains('Progress: 44');
      cy.get('[data-test="card"]').should('have.length', 4);
      // The deck is shuffled, so skip bosses (21), which would end the game at 21 HP.
      // The deck holds only two bosses, so at least two of the four cards are safe.
      cy.get('[data-test="card"] .corner > h1')
        .filter((_, h1) => !h1.textContent.includes('21'))
        .first()
        .click();
      cy.get('[data-testid="end-game"]').click();
      cy.get('[data-testid="how-to-play-button"]').contains('How To Play');
    });
  });

  context('Resuming a run after a refresh', () => {
    it('shows Continue after a reload and restores the room', () => {
      cy.get('[data-testid="continue-game"]').should('not.exist');
      cy.get('[data-test="start-standard-game"]').click();
      cy.get('[data-test="progress label"]').contains('Progress: 44');

      cy.get('[data-test="card"] .corner > h1').then(($corners) => {
        const before = [...$corners].map((el) => el.textContent);

        cy.reload();
        cy.get('[data-testid="continue-game"]').click();

        cy.get('[data-test="progress label"]').contains('Progress: 44');
        cy.get('[data-test="card"] .corner > h1').should(($after) => {
          expect([...$after].map((el) => el.textContent)).to.deep.equal(before);
        });
      });
    });

    it('End game clears the save', () => {
      cy.get('[data-test="start-standard-game"]').click();
      cy.get('[data-testid="end-game"]').click();

      cy.reload();
      cy.get('[data-testid="continue-game"]').should('not.exist');
    });
  });

  context('End game screen', () => {
    // A save with one potion left in the final room, so a single click wins.
    // The deck is shuffled, so seeding a save is the only way to reach the
    // end screen deterministically.
    const oneCardFromVictory = serializeRun({
      ...initialGameState,
      dungeonSize: 48,
      progress: 0,
      hp: 10,
      xp: 120,
      roomsEntered: 13,
      timesRun: 2,
      room: [{ suit: 'hearts', number: 4 }],
      gameScene: 'room',
    });

    it('shows the stats for a won run', () => {
      cy.window().then((win) => win.localStorage.setItem(SAVE_KEY, oneCardFromVictory));
      cy.reload();
      cy.get('[data-testid="continue-game"]').click();
      cy.get('[data-test="card"]').click();

      cy.get('[data-testid="end-game-result"]')
        .should('have.class', 'is-win')
        .and('contain', 'You won!');
      cy.get('[data-testid="stat-xp"]').should('contain', 'Final XP: 120');
      cy.get('[data-testid="stat-hp"]').should('contain', 'HP remaining: 14');
      cy.get('[data-testid="stat-cards"]').should('contain', 'Cards cleared: 48 / 48');
      cy.get('[data-testid="stat-rooms"]').should('contain', 'Rooms entered: 13');
      cy.get('[data-testid="stat-runs"]').should('contain', 'Times run: 2');
    });
  });
})
