// TODO: Test nav to to-do page and empty list handling
describe("To-Do page task flow", () => {
    beforeEach(() => {

    });
    it("Navigates to Todo page and displays empty list of tasks", () => {
        // Mock auth response
        cy.intercept('GET', '**/users/auth/me/', { statusCode: 200, body: { email: "test@example.com", is_super: false } }).as('authMe');
        // Mock get_yards response with no yards
        cy.intercept('GET', '**/yards/', { statusCode: 200, body: [] }).as('yardList');

        // nav to /todo
        cy.visit("/")
        cy.wait("@authMe")
        cy.visit("/todo")
        cy.wait("@yardList")

        cy.get("h1").contains("To-Do List").should("be.visible")
        // check for 'Show Task Actions' button and click it
        cy.contains("button", "Show Task Actions").click()
        // check text changed to 'Hide Task Actions' and click it
        cy.contains("button", "Hide Task Actions").click()
        // check text reverted to "Show Task Actions"
        cy.contains("button", "Show Task Actions").should("be.visible")
    })
})
// TODO: Test for task flow
//      TODO: Subtest to create a task
//      TODO: Subtest to edit a task
//      TODO: Subtest to complete a task
//      TODO: Subtest to delete a task
