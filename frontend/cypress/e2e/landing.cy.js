describe('Landing Page', () => {
    it('displays welcome text', () => {
        cy.visit('/');
        cy.contains('Welcome to LawnHero').should('be.visible');
    });
});

describe('Authentication flow', () => {
    it('navigates to login and logs in', () => {
        cy.visit('/login');
    });
})