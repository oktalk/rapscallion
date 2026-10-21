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
})
