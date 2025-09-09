describe("Testing with Map functionality", () => {
    beforeEach(() => {
        // Sets screen size
        cy.viewport('iphone-x');
        // Mocks Auth me call
        cy.intercept('GET', '**/users/auth/me/', { statusCode: 200, body: { email: "test@example.com", is_super: false } }).as('authMe');
        // Mock get yards response with no yards
        cy.intercept('GET', '**/yards/', {
            statusCode: 200, body: []
        }).as('yardList');

        // Mocks Api Call to zipcode validator
        cy.intercept('GET', 'https://api.zippopotam.us/us/*', {
            statusCode: 200,
            body: {
                "post code": "27613",
                "country": "United States",
                "country abbreviation": "US",
                "places": [
                    {
                        "place name": "Raleigh",
                        "longitude": "-78.7228",
                        "state": "North Carolina",
                        "state abbreviation": "NC",
                        "latitude": "35.9067"
                    }
                ]
            }
        }).as('zip');

        // Mock get_yard_groups response with no yard groups
        cy.intercept('GET', '**/yards/yard-groups', {
            statusCode: 200, body: []
        }).as('yardGroupList');

        // Go to dashboard and open up the map
        cy.visit('/dashboard');
        cy.wait('@authMe');
        cy.wait('@yardList');
        cy.wait('@yardGroupList');
        cy.get('button').contains('New Yard').should('be.visible').click();
        cy.get('#yardNameInput').type("TestYard");
        cy.get('#zipCodeInput').type("27613");
        cy.wait('@zip');
    })

    // Subtest to check empty dashboard page loads correctly
    it("Draws a polygon and tests that the data is stored", () => {
        // Opens the map and the polygon drawing tool 
        cy.contains('button', 'Map My Yard').should('be.visible').click();
        cy.get('.leaflet-draw-draw-polygon').should('be.visible').click();

        // Clicks to make a square
        // Delay to make sure they are 'clicks' and not 'dragging' a finger
        cy.get('.leaflet-container').should('be.visible')
            .click(100,150).wait(120)
            .click(200,150).wait(120)
            .click(200,250).wait(120)
            .click(100,250).wait(120)
            .click(100,150);

        // New intercepts needed for non empty yard list

        // Mocks returning an empty task list
        cy.intercept("GET", "**/tasks/*/", { status: 200, body: [] }).as("taskList")

        // Mocks getting a list with the recently added yard in it
        cy.intercept('GET', '**/yards/', {
            statusCode: 200, body: [
                {
                    "id": 1,
                    "yard_name": "testYard",
                    "yard_size": 6433999,
                    "soil_type": "Unknown",
                    "grass_type": "Unknown",
                    "longitude": "-78.7228",
                    "latitude": "35.9067",
                    "user": 8,
                    "yard_group": null,
                    "zip_code": "27613"
                }
            ]
        }).as('yardList');

        // Mock get_yard_groups response with no yard groups
        cy.intercept('GET', '**/yards/yard-groups', {
            statusCode: 200, body: []
        }).as('yardGroupList');

        // Mock get_yards response with no yards
        cy.intercept('POST', '**/yards/', {
            statusCode: 201, body: 
                {
                    "id": 1,
                    "yard_name": "testYard",
                    "yard_size": 6433999,
                    "soil_type": "Unknown",
                    "grass_type": "Unknown",
                    "longitude": "-78.7228",
                    "latitude": "35.9067",
                    "user": 8,
                    "yard_group": null,
                    "zip_code": "27613"
                }
        }).as('postYard');

        // Mock get_yards_preferences response for the added yard
        cy.intercept('GET', '**/yard_pref/1/', {
            statusCode: 200, body: {
                "ok": true,
                "data": {
                    "id": 1,
                    "watering_interval": 2.0,
                    "watering_rate": 5.0,
                    "fertilizing_interval": 6,
                    "fertilizing_rate": 7.0,
                    "mowing_interval": 8,
                    "aeration_interval": 9,
                    "dethatching_interval": 10,
                    "yard": 1
                }
            }
        }).as('yardPrefs');

        // Mock AI API call
        cy.intercept('POST', '**/tips/1/', {
            statusCode: 200, body: {}
        }).as('makeTips');


        // Finish out and save the yard
        cy.contains('button', 'Finish').should('be.visible').click();
        cy.contains('button', 'Save').should('be.visible').click();
        cy.wait('@postYard');
        cy.wait('@makeTips');
        cy.wait('@taskList');
        cy.wait('@yardList');
        cy.wait('@yardGroupList');
        cy.wait('@yardPrefs');

        // Tests that the info was added correctly
        // Opening accordions with tests
        cy.get('h3').contains('Ungrouped Yards').should('be.visible').click();
        cy.get('h3').contains('testYard').should('be.visible').click();

        // Test that the page displays the given and default info correctly
        cy.get('div').contains('27613').should('be.visible');
        cy.get('div').contains('6433999 sqft').should('be.visible');
        cy.get('div').contains('-78.7228').should('not.exist');
        cy.get('div').contains('35.9067').should('not.exist');
    })
})