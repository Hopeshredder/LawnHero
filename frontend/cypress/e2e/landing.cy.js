describe('Landing Page', () => {
    it('displays welcome text', () => {
        cy.visit('/');
        cy.contains('Welcome to LawnHero').should('be.visible');
    });
});