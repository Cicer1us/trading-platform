describe('checks 404 pages', () => {
  it('checks 404 temporary pages', () => {
    cy.visit('/');

    cy.get('footer').contains('Terms of Service').click();
    cy.get('h1').contains('404');

    cy.visit('blog', { failOnStatusCode: false });
    cy.get('h1').contains('404');
  });
});
