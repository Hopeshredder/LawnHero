describe('Authentication Flow', () => {
    it('navigates to login and logs in', () => {

        // Mock auth response
        cy.intercept('GET', '**/users/auth/me/', { statusCode: 200, body: { email: null, is_super: false } }).as('initialAuth');
        // Mock get_yards response
        cy.intercept('GET', '**/yards/', { statusCode: 200, body: [] }).as('yardList');

        // Go to landing page
        cy.visit('/');
        // Logic checks if user is logged in to display private/public routes
        // Uses mock respose set above
        cy.wait('@initialAuth');


        // Since no user is logged in, we should see the GetStarted button and click it
        cy.contains('Get Started').click();
        // Checks if it takes us to the login page
        cy.url().should('include', '/login');
        // Makes sure page header is "Login"
        cy.get("h1").contains('Login').should('be.visible');

        // Mock user login request and response 
        cy.intercept('POST', '**/users/login/', { statusCode: 200, body: { email: 'test@example.com' } }).as('login');
        // Mock auth response
        cy.intercept('GET', '**/users/auth/me/', { statusCode: 200, body: { email: 'test@example.com', is_super: false } }).as('authMe');

        // set email input
        cy.get('input#email').type('test@example.com');
        // set password input - not used for testing only to fulfill form requirements
        cy.get('input#password').type('password');

        cy.contains('button', 'Login').click();

        // logs in
        cy.wait('@login');
        // validates user
        cy.wait('@authMe');
        // Yards list is requested for the ToDo page
        cy.wait('@yardList');

        // If login works, it redirects to ToDo page
        cy.url().should('include', '/todo');
    });
});

// // Test for Register page
// describe('New User Registration Flow', () => { 
//     it('navigates to register and makes a new user', () => {
//         // Mock auth_me response
//         cy.intercept('')
//         // mock get_yards response

//     })
//  })