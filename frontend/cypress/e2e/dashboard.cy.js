// describe("Dashboard page empty DB", () => {
//     beforeEach(() => {
//         cy.intercept('GET', '**/users/auth/me/', { statusCode: 200, body: { email: "test@example.com", is_super: false } }).as('authMe');
//         // Mock get_yards response with no yards
//         cy.intercept('GET', '**/yards/', {
//             statusCode: 200, body: []
//         }).as('yardList');

//         // Mock get_yard_groups response with no yard groups
//         cy.intercept('GET', '**/yards/yard-groups', {
//             statusCode: 200, body: []
//         }).as('yardGroupList');
//         cy.visit('/dashboard');
//         cy.wait('@authMe');
//         cy.wait('@yardList');
//         cy.wait('@yardGroupList');
//     })

//     // Subtest to check empty dashboard page loads correctly
//     it("Visits dashboard page with empty DB", () => {
//         cy.get('h1').contains('Yard Groups').should('be.visible');
//         cy.get('button').contains('New Yard').should('be.visible');
//         cy.get('h3').should('not.exist');
//     })
// })

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
    }),
    
    // TODO: Make new yard (test preferences creation)
    it("Creates a single yard with defaults", () => {
        // Mocks Api Call to zipcode validator
        cy.intercept('GET', 'https://api.zippopotam.us/us/*', {
            statusCode: 200,
            body: { 'post code': '27613' }
        }).as('zip');

        // Enters required fields and then navigates to preferences section
        cy.get('#yardNameInput').type("TestYard");
        cy.get('#zipCodeInput').type("27613");
        cy.wait('@zip');
        cy.get("[type='checkbox']").check();
        
        // Mock get_yards response with no yards
        cy.intercept('POST', '**/yards/', {
            statusCode: 201, body: 
                {
                    "id": 1,
                    "yard_name": "TestYard",
                    "yard_size": 0,
                    "soil_type": "Unknown",
                    "grass_type": "Unknown",
                    "longitude": "Unknown",
                    "latitude": "Unknown",
                    "user": 8,
                    "yard_group": null,
                    "zip_code": "27613"
                }
        }).as('postYard');
        
        // Mock get_yards_preferences response with no yards
        cy.intercept('POST', '**/yard_pref/1/', {
            statusCode: 201, body: {
                "ok": true, 
                "detail": "Preferences created"
            }
        }).as('setYardPrefs');
        
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
                    "watering_interval": 4.0,
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

        // Moves to  the Preferences section and saves the yard info
        cy.contains('button', 'Next').should('be.visible').click();
        cy.wait('@postYard');
        
        // Entering non-default values for yard preferences
        cy.get('[data-cy="prefs-modal"][data-yard-id="1"]').within(() => {
            cy.get('[data-cy="wateringIntervalInput"]').clear().type('4');
            cy.get('[data-cy="wateringRateInput"]').clear().type('5');
            cy.get('[data-cy="fertilizingIntervalInput"]').clear().type('6');//
            cy.get('[data-cy="fertilizingRateInput"]').clear().type('7');
            cy.get('[data-cy="mowingIntervalInput"]').clear().type('8');
            cy.get('[data-cy="aerationIntervalInput"]').clear().type('9');//
            cy.get('[data-cy="dethatchingIntervalInput"]').clear().type('10');//
        });

        // Mocking API calls to the backend
        cy.contains('button', 'Save Preferences').click();
        cy.wait('@setYardPrefs')
        cy.wait('@yardGroupList');
        cy.wait('@yardList');
        cy.wait('@yardPrefs');
        
        // Opening accordions with tests
        cy.get('h3').contains('Ungrouped Yards').should('be.visible').click();
        cy.get('h3').contains('testYard').should('be.visible').click();
        cy.get('h3').contains('Preferences').click();
        
        // Test that the page displays the given and default info correctly
        cy.get('div').contains('27613').should('be.visible');
        cy.get('div').contains('0 sqft').should('be.visible');
        cy.get('div').contains('Unknown').should('be.visible');
        cy.get('div').contains('4 day(s)').should('be.visible');
        cy.get('div').contains('5\" / week').should('be.visible');
        cy.get('div').contains('6 day(s)').should('be.visible');
        cy.get('div').contains('7 lbs/1000 sqft').should('be.visible');
        cy.get('div').contains('8 day(s)').should('be.visible');
        cy.get('div').contains('9 day(s)').should('be.visible');
        cy.get('div').contains('10 day(s)').should('be.visible');
    })
})

describe("Tests Group creation and deletion", () => {
    beforeEach(() => {
        cy.intercept('GET', '**/users/auth/me/', { statusCode: 200, body: { email: "test@example.com", is_super: false } }).as('authMe');
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
                },
                {
                    "id": 2,
                    "yard_name": "groupedTestYard",
                    "yard_size": 0,
                    "soil_type": "Unknown",
                    "grass_type": "Unknown",
                    "longitude": "Unknown",
                    "latitude": "Unknown",
                    "user": 8,
                    "yard_group": {
                        "id":1,
                        "user":8,
                        "group_name":'testGroup'
                    },
                    "zip_code": "27613"
                }
            ]
        }).as('yardList');

        // Mock get_yard_groups response with no yard groups
        cy.intercept('GET', '**/yards/yard-groups', {
            statusCode: 200, body: [{
                "id":1,
                "user":8,
                "group_name":'testGroup'
            }]
        }).as('yardGroupList');

        // Mock get_yards_preferences response with no yards
        cy.intercept('GET', '**/yard_pref/*/', {
            statusCode: 200, body: {
                "ok": true,
                "data": {
                    "id": 1,
                    "watering_interval": 4.0,
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
        // Mocks Api Call to zipcode validator
        cy.intercept('GET', 'https://api.zippopotam.us/us/*', {
            statusCode: 200,
            body: { 'post code': '27613' }
        }).as('zip');

        cy.visit('/dashboard');
        cy.wait('@authMe');
        cy.wait('@yardList');
        cy.wait('@yardGroupList');
        cy.wait('@yardPrefs');
        cy.wait('@yardPrefs');
    })

    // Tests the functionality of making groups 
    // it("Tests that yards show in groups properly", () => {
    //     // Open new task modal
    //     cy.get('h1').contains('Yard Groups').should('be.visible');
    //     cy.get('button').contains('New Yard').should('be.visible').click();
        
    //     // Enter values for a new test
    //     cy.get('#yardNameInput').type("NewTestYard");
    //     cy.get('#zipCodeInput').type("27613");
    //     cy.wait('@zip');
    //     cy.get('#newGroupInput').type("newGroup");

    //     cy.intercept('GET', '**/yards/', {
    //         statusCode: 200, body: [
    //             {
    //                 "id": 1,
    //                 "yard_name": "testYard",
    //                 "yard_size": 0,
    //                 "soil_type": "Unknown",
    //                 "grass_type": "Unknown",
    //                 "longitude": "Unknown",
    //                 "latitude": "Unknown",
    //                 "user": 8,
    //                 "yard_group": null,
    //                 "zip_code": "27613"
    //             },
    //             {
    //                 "id": 2,
    //                 "yard_name": "groupedTestYard",
    //                 "yard_size": 0,
    //                 "soil_type": "Unknown",
    //                 "grass_type": "Unknown",
    //                 "longitude": "Unknown",
    //                 "latitude": "Unknown",
    //                 "user": 8,
    //                 "yard_group": {
    //                     "id":1,
    //                     "user":8,
    //                     "group_name":'testGroup'
    //                 },
    //                 "zip_code": "27613"
    //             },
    //             {
    //                 "id": 3,
    //                 "yard_name": "newTestYard",
    //                 "yard_size": 0,
    //                 "soil_type": "Unknown",
    //                 "grass_type": "Unknown",
    //                 "longitude": "Unknown",
    //                 "latitude": "Unknown",
    //                 "user": 8,
    //                 "yard_group": {
    //                     "id":2,
    //                     "user":8,
    //                     "group_name":'newGroup'
    //                 },
    //                 "zip_code": "27613"
    //             }
    //         ]
    //     }).as('yardList');

    //     // Mock get_yard_groups response with no yard groups
    //     cy.intercept('GET', '**/yards/yard-groups', {
    //         statusCode: 200, body: [{
    //             "id":1,
    //             "user":8,
    //             "group_name":'testGroup'
    //         },
    //         {
    //             "id":2,
    //             "user":8,
    //             "group_name":'newGroup'
    //         }]
    //     }).as('yardGroupList');

    //     // Mock get_yards response with no yards
    //     cy.intercept('POST', '**/yards/', {
    //         statusCode: 201, body: 
    //             {
    //                 "id": 3,
    //                 "yard_name": "newTestYard",
    //                 "yard_size": 0,
    //                 "soil_type": "Unknown",
    //                 "grass_type": "Unknown",
    //                 "longitude": "Unknown",
    //                 "latitude": "Unknown",
    //                 "user": 8,
    //                 "yard_group": {
    //                     "id":2,
    //                     "user":8,
    //                     "group_name":'newGroup'
    //                 },
    //                 "zip_code": "27613"
    //             }
    //     }).as('postYard');

    //     // Mock get_yards response with no yards
    //     cy.intercept('POST', '**/yards/yard-groups', {
    //         statusCode: 201, body: 
    //             {
    //                 "id":2,
    //                 "user":8,
    //                 "group_name":'newGroup'
    //             }
    //     }).as('postYardGroup');

    //     // Mock get_yards response with no yards
    //     cy.intercept('POST', '**/yards/yard-groups/*/yard/*', {
    //         statusCode: 201, body: 
    //             {
    //                 "success": "Yard added to group"
    //             }
    //     }).as('addToGroup');

    //     //Submits the form
    //     cy.contains('button', 'Save').should('be.visible').click();
    //     cy.wait('@postYardGroup');
    //     cy.wait('@postYard');
    //     cy.wait('@addToGroup');
    //     cy.wait('@yardList');
    //     cy.wait('@yardGroupList');
    //     cy.wait('@yardPrefs');
    //     cy.wait('@yardPrefs');
    //     cy.wait('@yardPrefs');

    //     // Checks that the new group is made and the new yard is in said group
    //     cy.get('span').contains('newGroup').should('be.visible').click();
    //     cy.get('span').contains('newTestYard').should('be.visible');
    //     cy.get('span').contains('testGroup').should('be.visible');
    //     cy.get('span').contains('Ungrouped Yards').should('be.visible');
    // }),

    // Tests editing which group a yard belongs to and the ability to delete groups
    it("Tests editing a yard's group and group deletion", () => {
        
    })
    // TODO: Edit yard group name
})