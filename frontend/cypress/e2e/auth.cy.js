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

describe('New User Registration Flow', () => {
    it('navigates to register and makes a new user', () => {
        // Mock auth_me response
        cy.intercept('GET', '**/users/auth/me/', { statusCode: 200, body: { email: null, is_super: false } }).as('initialAuth');
        // mock get_yards response
        cy.intercept('GET', '**/yards/', { statusCode: 200, body: [] }).as('yardList');

        // Go to landing page
        cy.visit('/');
        // Logic checks if user is logged in to display private/public routes
        // Uses mock respose set above
        cy.wait('@initialAuth');

        // Since no user is logged in, we should see the REGISTER button and click it
        cy.get('nav').contains('Register').click();
        // Checks if it takes us to the register page
        cy.url().should('include', '/register');
        // Makes sure page header is "Register"
        cy.get("h1").contains('Register').should('be.visible');

        // Mock user register request and response 
        cy.intercept('POST', '**/users/signup/', { statusCode: 201, body: { email: 'test@example.com' } }).as('signup');
        // Mock user login request and response (Signup calls on Login once user is created)
        cy.intercept('POST', '**/users/login/', { statusCode: 200, body: { email: 'test@example.com' } }).as('login');
        // Mock auth response
        cy.intercept('GET', '**/users/auth/me/', { statusCode: 200, body: { email: 'test@example.com', is_super: false } }).as('authMe');

        // set name input
        cy.get('input#name').type('Testname');
        // set email input
        cy.get('input#email').type('test@example.com');
        // set password input - not used for testing only to fulfill form requirements
        cy.get('input#password').type('password');

        cy.get('main').contains('button', 'Register').click();

        // registers a user
        cy.wait('@signup');
        // validates user
        cy.wait('@authMe');
        // Yards list is requested for the ToDo page
        cy.wait('@yardList');

        // If register works, it redirects to ToDo page
        cy.url().should('include', '/todo');
    })
});


describe("Private route protection", () => {
    beforeEach(() => {
        //Mock auth as not logged in
        cy.intercept(
            { method: "GET", url: "**/users/auth/me" },
            { statusCode: 200, body: { email: null, is_super: false } }
        ).as("authMe")
    })
    it("Attempts to access the /todo page without signing in", () => {
        // attempt to visit unauthorized route
        cy.visit("/todo")
        // checks user auth
        cy.wait('@authMe')
        // check for redirect to login page
        cy.location("pathname").should("eq", "/login")
    })
    it("Attempts to access the /dashboard page without signing in", () => {
        // attempt to visit unauthorized route
        cy.visit("/dashboard")
        // checks user auth
        cy.wait('@authMe')
        // check for redirect to login page
        cy.location("pathname").should("eq", "/login")
    })
    it("Attempts to access the /settings page without signing in", () => {
        // attempt to visit unauthorized route
        cy.visit("/settings")
        // checks user auth
        cy.wait('@authMe')
        // check for redirect to login page
        cy.location("pathname").should("eq", "/login")
    })
})

describe("Public route protection", () => {
    beforeEach(() => {
        // Mock auth as logged-in
        cy.intercept(
            { method: "GET", url: "**/users/auth/me" },
            { statusCode: 200, body: { email: "testuser@test.com", is_super: false } }
        ).as("authMe");

        // Mock initial data the app fetches on load
        cy.intercept(
            { method: "GET", url: "**/yards/" },
            { statusCode: 200, body: [] }
        ).as("yards");
    });

    it("redirects from /login to /todo when already logged in", () => {
        // attempt to visit login page 
        cy.visit("/login")

        cy.wait("@authMe").its("response.statusCode").should("eq", 200);
        cy.wait("@yards").its("response.statusCode").should("eq", 200);

        // Assert if the redirect completed
        cy.location("pathname").should("eq", "/todo")
    })
    it("redirects from /register to /todo when already logged in", () => {
        cy.visit("/register")

        cy.wait("@authMe").its("response.statusCode").should("eq", 200);
        cy.wait("@yards").its("response.statusCode").should("eq", 200);

        // Assert if the redirect completed
        cy.location("pathname").should("eq", "/todo")
    })
})

// TODO: Logout flow (from settings page)