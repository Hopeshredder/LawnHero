describe("Dashboard page empty DB", () => {
    beforeEach(() => {
        // Mocks Authme
        cy.intercept('GET', '**/users/auth/me/', { statusCode: 200, body: { email: "test@example.com", is_super: false } }).as('authMe');
        // Mock get_yards response with no yards
        cy.intercept('GET', '**/yards/', {
            statusCode: 200, body: []
        }).as('yardList');

        cy.visit('/supertips');
        cy.wait('@authMe');
        cy.wait('@yardList');
    })

    // Subtest to check empty dashboard page loads correctly
    it("Visits dashboard page with empty DB", () => {
        cy.get('h1').contains('Super Tips').should('be.visible');
        cy.get('span').contains('Super Tip 1: Create a Yard').should('be.visible');
        cy.get('p').contains('No yards created yet. Go to the Dashboard to add one.').should('be.visible');
    })
})