// Cypress.Commands.add("login", () => {
//     cy.intercept('GET', '**/users/auth/me/', { statusCode: 200, body: { email: null, is_super: false } }).as('authMe');
//     cy.intercept('POST', '**/users/login/', { statusCode: 200, body: { email: 'test@example.com' } }).as('login');
//     // Uses mock respose for logged out user
//     cy.wait('@authMe');
//     // Since no user is logged in, we should see the GetStarted button and click it
//     cy.contains('Get Started').click();
//     // set email input
//     cy.get('input#email').type('test@example.com');
//     // set password input - not used for testing only to fulfill form requirements
//     cy.get('input#password').type('password');
//     // Mock logged in auth response
//     cy.intercept('GET', '**/users/auth/me/', { statusCode: 200, body: { email: "test@example.com", is_super: false } }).as('authMe');
//     // Click login button
//     cy.contains('button', 'Login').click();
//     // logs in
//     cy.wait('@login');
//     // validates user
//     cy.wait('@authMe');
// })

// // TODO: Test nav to to-do page and empty list handling
// describe("To-Do page task flow", () => {
//     it("Navigates to Todo page and displays empty list of tasks", () => {
//         // Mock auth response
//         cy.login()

//         // cy.intercept('GET', '**/users/auth/me/', { statusCode: 200, body: { email: "test@example.com", is_super: false } }).as('authMe');
//         // // Mock get_yards response with no yards
//         // cy.intercept('GET', '**/yards/', { statusCode: 200, body: [] }).as('yardList');

//         // nav to /todo
//         cy.visit("/todo");
//         cy.wait("@authMe");
//         // cy.wait("@yardList");
//         ;
//         cy.get("h1").contains("To-Do List").should("be.visible");
//         // check for 'Show Task Actions' button and click it;
//         cy.contains("button", "Show Task Actions").click();
//         // check text changed to 'Hide Task Actions' and click it;
//         cy.contains("button", "Hide Task Actions").click();
//         // check text reverted to "Show Task Actions";
//         cy.contains("button", "Show Task Actions").should("be.visible");
//     })
// })
// // TODO: Test for task flow
// //      TODO: Subtest to create a task
// //      TODO: Subtest to edit a task
// //      TODO: Subtest to complete a task
// //      TODO: Subtest to delete a task
