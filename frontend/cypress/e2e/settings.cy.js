describe('Checks the setting page values are correctly displayed', () => {
    it('Checks proper display for normal user', () => {
        // Mock auth response
        cy.intercept('GET', '**/users/auth/me/', { statusCode: 200, body: { email: 'test@example.com', is_super: false } }).as('authMe');
        // Mock get_yards response
        cy.intercept('GET', '**/users/info/', { statusCode: 200, body: {"email": "test@example.com", "is_super": false } }).as('userInfo');

        // Go to settings page
        cy.visit('/settings');
        // Logic checks if user is logged in to display private/public routes
        // Uses mock respose set above
        cy.wait('@authMe');
        // Provides user info to settings page to be displayed
        cy.wait('@userInfo');

        // Checks if it takes us to the login page
        cy.url().should('include', '/settings');
        // Makes sure page header is "Login"
        cy.get("h1").contains('Settings').should('be.visible');

        // Makes sure the page has an email field that shows the current user's email address
        cy.get('#emailDiv').contains('Email:').should('be.visible');
        cy.get('#emailDiv').contains('test@example.com').should('be.visible');

        // Makes sure the page has a user type field that shows the current user's account type
        cy.get('#accountTypeDiv').contains('Account Type:').should('be.visible');
        cy.get('#accountTypeDiv').contains('User').should('be.visible');
    }),
    it('Checks proper display for super user', () => {
        // Mock auth response
        cy.intercept('GET', '**/users/auth/me/', { statusCode: 200, body: { email: 'testAdmin@example.com', is_super: true } }).as('authMe');
        // Mock get_yards response
        cy.intercept('GET', '**/users/info/', { body: {"email": "testAdmin@example.com", "is_super": true } }).as('userInfo');

        // Go to settings page
        cy.visit('/settings');
        // Logic checks if user is logged in to display private/public routes
        // Uses mock respose set above
        cy.wait('@authMe');
        // Provides user info to settings page to be displayed
        cy.wait('@userInfo');

        // Checks if it takes us to the login page
        cy.url().should('include', '/settings');
        // Makes sure page header is "Login"
        cy.get("h1").contains('Settings').should('be.visible');

        // Makes sure the page has an email field that shows the current user's email address
        cy.get('#emailDiv').contains('Email:').should('be.visible');
        cy.get('#emailDiv').contains('testAdmin@example.com').should('be.visible');

        // Makes sure the page has a user type field that shows the current user's account type
        cy.get('#accountTypeDiv').contains('Account Type:').should('be.visible');
        cy.get('#accountTypeDiv').contains('Administrator').should('be.visible');
    });
});