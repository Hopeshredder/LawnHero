// // TODO: Test nav to to-do page and empty list handling
// describe("To-Do page navigation", () => {
//     it("Navigates to Todo page and displays empty list of tasks", () => {
//         // Mock auth response

//         cy.intercept('GET', '**/users/auth/me/', { statusCode: 200, body: { email: "test@example.com", is_super: false } }).as('authMe');
//         // // Mock get_yards response with no yards
//         cy.intercept('GET', '**/yards/', { statusCode: 200, body: [] }).as('yardList');

//         // nav to /todo
//         cy.visit("/todo");
//         cy.wait("@authMe");
//         cy.wait("@yardList");

//         cy.get("h1").contains("To-Do List").should("be.visible");
//         cy.get("h3").should("not.exist")
//     })
// })
// describe("To-Do page task creation flow with single yard", () => {
//     beforeEach(() => {
//         cy.intercept('GET', '**/users/auth/me/', { statusCode: 200, body: { email: "test@example.com", is_super: false } }).as('authMe');
//         // // Mock get_yards response with no yards
//         cy.intercept('GET', '**/yards/', {
//             statusCode: 200, body: [
//                 {
//                     "id": 1,
//                     "yard_name": "adfadsf",
//                     "yard_size": 0,
//                     "soil_type": "Unknown",
//                     "grass_type": "Unknown",
//                     "longitude": "Unknown",
//                     "latitude": "Unknown",
//                     "user": 8,
//                     "yard_group": null,
//                     "zip_code": "32548"
//                 }
//             ]
//         }).as('yardList');
//         cy.intercept("GET", "**/tasks/1/", { status: 200, body: [] }).as("taskList")
//     })
//     //      TODO: Subtest to create a task
//     it("Creates a new task", () => {
//         const activityName = "water front yard"
//         const today = new Date().toISOString().split("T")[0]


//         cy.visit("/todo")
//         cy.wait("@authMe")
//         cy.wait("@taskList")

//         cy.get("h3").should("contain", "adfadsf").click()
//         cy.get("#addTasks Button").click()
//         cy.get("#newTaskTitle").should("be.visible")
//         cy.get('input#activityType').type(activityName);
//         cy.get('input#scheduledDate').type(today)

//         cy.intercept("POST", "**/tasks/1/add/", {
//             status: 201, body: {
//                 "id": 1,
//                 "activity_type": activityName,
//                 "day_scheduled": today,
//                 "day_completed": null,
//                 "yard": 1
//             }
//         }).as("taskAdd")
//         cy.intercept("GET", "**/tasks/1/", {
//             status: 200, body: [
//                 {
//                     "id": 1,
//                     "activity_type": activityName,
//                     "day_scheduled": today,
//                     "day_completed": null,
//                     "yard": 1
//                 }
//             ]
//         }).as("taskList")


//         cy.get("#saveButton").click()
//         cy.wait("@taskAdd")

//         cy.get("#futureTasks").should("contain", activityName)
//     })
// })
// //      TODO: Subtest to edit a task
describe("To-Do page task creation flow with single yard", () => {
    beforeEach(() => {
        const activityName = "mow"
        const yesterday = "2025-09-03"


        cy.intercept('GET', '**/users/auth/me/', { statusCode: 200, body: { email: "test@example.com", is_super: false } }).as('authMe');

        // Mock get_yards response with no yards
        cy.intercept('GET', '**/yards/', {
            statusCode: 200, body: [
                {
                    "id": 1,
                    "yard_name": "adfadsf",
                    "yard_size": 0,
                    "soil_type": "Unknown",
                    "grass_type": "Unknown",
                    "longitude": "Unknown",
                    "latitude": "Unknown",
                    "user": 8,
                    "yard_group": null,
                    "zip_code": "32548"
                }
            ]
        }).as('yardList');

        cy.intercept("GET", "**/tasks/1/", {
            status: 200, body: [
                {
                    "id": 1,
                    "activity_type": activityName,
                    "day_scheduled": yesterday,
                    "day_completed": null,
                    "yard": 1
                },
            ]
        }).as("taskList")

        cy.visit("/todo")
        cy.wait("@authMe")
        cy.wait("@yardList")

        cy.get("h3").should("contain", "adfadsf").click()
        cy.get("#pastTasks").should("contain", "mow")
    })

    //     it("Edits a task", () => {
    //         const editName = "mow changed"
    //         const today = new Date().toISOString().split("T")[0]

    //         



    //         cy.get("#pastTasks").find("[data-testid='EditIcon']").click()

    //         cy.get('input#activityType').clear().type(editName);
    //         cy.get('input#scheduledDate').clear().type(today);

    //         cy.intercept("PUT", "**/tasks/task/1/", {
    //             status: 201, body: {
    //                 "id": 1,
    //                 "activity_type": editName,
    //                 "day_scheduled": today,
    //                 "day_completed": null,
    //                 "yard": 1
    //             }
    //         }).as("taskEdit")

    //         cy.intercept("GET", "**/tasks/1/", {
    //             status: 200, body: [
    //                 {
    //                     "id": 1,
    //                     "activity_type": editName,
    //                     "day_scheduled": today,
    //                     "day_completed": null,
    //                     "yard": 1
    //                 }
    //             ]
    //         }).as("taskList")

    //         cy.get("#saveButton").click()
    //         cy.wait("@taskEdit")
    //         cy.wait("@taskList")

    //         cy.get("#futureTasks").should("contain", editName)
    //     })

    //      TODO: Subtest to complete a task
    it("Checks task completion functionality", () => {
        //         cy.get('PLACEHOLDER').should('have.css', 'background-color', 'rgb(252, 165, 165)'); This is for the Red color
        // 2: 28
        //         cy.get('PLACEHOLDER').should('have.css', 'background-color', 'rgb(73, 127, 53)'); This is for the green color(edited) 
        const today = new Date().toISOString().split("T")[0]

        cy.get("#pastTasks").should('have.css', 'background-color', 'rgb(252, 165, 165)');
        
        cy.intercept("PUT", "**/tasks/task/1/", {
            status: 201, body: {
                "id": 1,
                "activity_type": "mow",
                "day_scheduled": "2025-09-03",
                "day_completed": today,
                "yard": 1
            }
        }).as("taskComplete")
        
        cy.get("[type='checkbox']").click()
        cy.wait("@taskComplete")
        
        cy.get("#pastTasks").should('have.css', 'background-color', 'rgba(0, 0, 0, 0)');
    })
    //      TODO: Subtest to delete a task

})