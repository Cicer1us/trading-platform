describe('checks content of links on index page ', () => {
  beforeEach('sets big resolution', () => {
    cy.viewport(1920, 1080);
  });

  it('check href attribute of links on header and footer', () => {
    cy.visit('/');

    cy.get('header').contains('Swap').should('have.attr', 'href', '/trading/swap');
    cy.get('header').contains('Leverage').should('have.attr', 'href', '/trading/leverage');
    cy.get('header').contains('Cross Chain').should('have.attr', 'href', '/trading/cross-chain');
    cy.get('header').contains('Fiat').should('have.attr', 'href', '/fiat-exchange');
    cy.get('header').contains('Markets').should('have.attr', 'href', '/markets');

    cy.get('footer')
      .contains('Request A Feature')
      .should('have.attr', 'href', 'https://bitoftrade.canny.io/request-features');

    cy.get('footer').contains('Help Center').should('have.attr', 'href', 'https://bitoftrade.zendesk.com/hc/en-us');
  });
});
