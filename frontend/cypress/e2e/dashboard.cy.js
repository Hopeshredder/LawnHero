describe("Dashboard page empty DB", () => {
    beforeEach(() => {
        cy.intercept('GET', '**/users/auth/me/', { statusCode: 200, body: { email: "test@example.com", is_super: false } }).as('authMe');
        // Mock get_yards response with no yards
        cy.intercept('GET', '**/yards/', {
            statusCode: 200, body: []
        }).as('yardList');

        // Mock get_yard_groups response with no yard groups
        cy.intercept('GET', '**/yards/yard-groups', {
            statusCode: 200, body: []
        }).as('yardGroupList');

        cy.visit('/dashboard');
        cy.wait('@authMe');
        cy.wait('@yardList');
        cy.wait('@yardGroupList');
    })

    // Subtest to check empty dashboard page loads correctly
    it("Visits dashboard page with empty DB", () => {
        cy.get('h1').contains('Yard Groups').should('be.visible');
        cy.get('button').contains('New Yard').should('be.visible');
        cy.get('h3').should('not.exist');
    })
})

describe("Dashboard page - testing yard creation flow", () => {
    beforeEach(() => {
        cy.intercept('GET', '**/users/auth/me/', { statusCode: 200, body: { email: "test@example.com", is_super: false } }).as('authMe');
        // Mock get_yards response with no yards
        cy.intercept('GET', '**/yards/', {
            statusCode: 200, body: []
        }).as('yardList');

        // Mock get_yard_groups response with no yard groups
        cy.intercept('GET', '**/yards/yard-groups', {
            statusCode: 200, body: []
        }).as('yardGroupList');

        cy.visit('/dashboard');
        cy.wait('@authMe');
        cy.wait('@yardList');
        cy.wait('@yardGroupList');
        cy.get('button').contains('New Yard').click();
    })
    
    //  Make new yard with different yard values
    it("Creates a single yard with defaults", () => {
        cy.get('#yardNameInput').type("TestYard");
        cy.get('#zipCodeInput').type("27613");

        // Mock get_yards response with no yards
        cy.intercept('POST', '**/yards/', {
            statusCode: 201, body: [
                {
                    "id": 1,
                    "yard_name": "testYard",
                    "yard_size": 0,
                    "soil_type": "Unknown",
                    "grass_type": "Unknown",
                    "longitude": "Unknown",
                    "latitude": "Unknown",
                    "user": 8,
                    "yard_group": null,
                    "zip_code": "27613"
                }
            ]
        }).as('postYard');

        // Mock get_yards response with no yards
        cy.intercept('GET', '**/yards/', {
            statusCode: 200, body: [
                {
                    "id": 1,
                    "yard_name": "testYard",
                    "yard_size": 0,
                    "soil_type": "Unknown",
                    "grass_type": "Unknown",
                    "longitude": "Unknown",
                    "latitude": "Unknown",
                    "user": 8,
                    "yard_group": null,
                    "zip_code": "27613"
                }
            ]
        }).as('yardList');

        // Mock get_yards_preferences response with no yards
        cy.intercept('GET', '**/yard_pref/1/', {
            statusCode: 200, body: {
                "ok": true,
                "data": {
                    "id": 1,
                    "watering_interval": 2.0,
                    "fertilizing_interval": 90,
                    "mowing_interval": 7,
                    "aeration_interval": 180,
                    "dethatching_interval": 180,
                    "watering_rate": 2.0,
                    "fertilizing_rate": 1.0,
                    "yard": 1
                }
            }
        }).as('yardPrefs');

        // Mocking API calls to the backend
        cy.contains('button', 'Save').click();
        cy.wait('@postYard');
        cy.wait('@yardList');
        cy.wait('@yardGroupList');
        cy.wait('@yardPrefs');

        // Opening accordions with tests
        cy.get('h3').contains('Ungrouped Yards').should('be.visible').click();
        cy.get('h3').contains('testYard').should('be.visible').click();
        cy.get('h3').contains('Preferences').click();

        // Test that the page displays the given and default info correctly
        cy.get('div').contains('27613').should('be.visible');
        cy.get('div').contains('0 sqft').should('be.visible');
        cy.get('div').contains('Unknown').should('be.visible');
        cy.get('div').contains('2 day(s)').should('be.visible');
        cy.get('div').contains('2\" / week').should('be.visible');
        cy.get('div').contains('90 day(s)').should('be.visible');
        cy.get('div').contains('1 lbs/1000 sqft').should('be.visible');
        cy.get('div').contains('7 day(s)').should('be.visible');
        cy.get('div').contains('180 day(s)').should('be.visible');
    })

    // TODO: Make new yard (test preferences creation)
})

// TODO: Make two yards, one in named group
// TODO: Delete yard