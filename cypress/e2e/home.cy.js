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
      cy.get('[data-test="card"]')
        .eq(0)
        .find('.corner > h1')
        .should('not.contain', '21')
        .click();
      cy.get('[data-testid="end-game"]').click();
      cy.get('[data-testid="how-to-play-button"]').contains('How To Play');
    });
  });
})
