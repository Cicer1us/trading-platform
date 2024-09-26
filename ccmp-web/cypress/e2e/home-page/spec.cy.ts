const homePage = 'http://localhost:3003';

describe('homepage spec', () => {
  beforeEach(() => {
    cy.viewport(1600, 1600);
  });

  it('visits', () => {
    cy.visit(homePage);

    const retryOptions = {
      limit: 2,
      delay: 500,
    };

    cy.compareSnapshot('cross-chain-landing-1600-1600.png', 0.2, retryOptions);
  });
});
