describe('Error Page', () => {
    it('navigates to an invalid URL route and displays the error page with working buttons', () => {
        // Navigates to a URL route that DNE
        cy.visit('/errorpage/');
        // Checks the contents of the page to make sure it is as expected
        cy.contains('404 - Page Not Found').should('be.visible');

        // Clicks the go back home button
        cy.contains('Go Back Home').click();
        // Checks to make sure it routes back to the landing page
        cy.contains('Welcome to LawnHero').should('be.visible');
    });
});