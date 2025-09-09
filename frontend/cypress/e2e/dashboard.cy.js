// describe("Dashboard page empty DB", () => {
//     beforeEach(() => {
//         cy.intercept('GET', '**/users/auth/me/', { statusCode: 200, body: { email: "test@example.com", is_super: false } }).as('authMe');
//         // Mock get_yards response with no yards
//         cy.intercept('GET', '**/yards/', {
//             statusCode: 200, body: []
//         }).as('yardList');

//         // import { bearing } from "@turf/turf";

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

// describe("Dashboard page - testing yard creation flow", () => {
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
//         cy.get('button').contains('New Yard').click();
//     })
    
//     //  Make new yard with different yard values
//     it("Creates a single yard with defaults", () => {
        
//         // Mock get_yards response with no yards
//         cy.intercept('POST', '**/yards/', {
//             statusCode: 201, body: [
//                 {
//                     "id": 1,
//                     "yard_name": "testYard",
//                     "yard_size": 0,
//                     "soil_type": "Unknown",
//                     "grass_type": "Unknown",
//                     "longitude": "Unknown",
//                     "latitude": "Unknown",
//                     "user": 8,
//                     "yard_group": null,
//                     "zip_code": "27613"
//                 }
//             ]
//         }).as('postYard');

//         // Mock get_yard_tasks response
//         cy.intercept("GET", "**/tasks/*/", { status: 200, body: [] }).as("getTasks");
        
//         // Intercept Zip code API call
//         cy.intercept('GET', 'https://api.zippopotam.us/us/*', {
//             statusCode: 200,
//             body: {
//                 "post code": "27613",
//                 "country": "United States",
//                 "country abbreviation": "US",
//                 "places": [
//                     {
//                         "place name": "Raleigh",
//                         "longitude": "-78.7228",
//                         "state": "North Carolina",
//                         "state abbreviation": "NC",
//                         "latitude": "35.9067"
//                     }
//                 ]
//             }
//         }).as('zip');
        
//         // Mock get_yards response with no yards
//         cy.intercept('GET', '**/yards/', {
//             statusCode: 200, body: [
//                 {
//                     "id": 1,
//                     "yard_name": "testYard",
//                     "yard_size": 0,
//                     "soil_type": "Unknown",
//                     "grass_type": "Unknown",
//                     "longitude": "Unknown",
//                     "latitude": "Unknown",
//                     "user": 8,
//                     "yard_group": null,
//                     "zip_code": "27613"
//                 }
//             ]
//         }).as('yardList');
        
//         // Mock get_yards_preferences response with no yards
//         cy.intercept('GET', '**/yard_pref/*/', {
//             statusCode: 200, body: {
//                 "ok": true,
//                 "data": {
//                     "id": 1,
//                     "watering_interval": 2.0,
//                     "fertilizing_interval": 90,
//                     "mowing_interval": 7,
//                     "aeration_interval": 180,
//                     "dethatching_interval": 180,
//                     "watering_rate": 2.0,
//                     "fertilizing_rate": 1.0,
//                     "yard": 1
//                 }
//             }
//         }).as('yardPrefs');
        
//         // Mock AI API call
//         cy.intercept('POST', '**/tips/*/', {
//             statusCode: 200, body: {}
//         }).as('makeTips');
        
        
//         cy.get('#yardNameInput').type("TestYard");
//         cy.get('#zipCodeInput').type("27613");
//         cy.wait('@zip')

//         // Mocking API calls to the backend
//         cy.contains('button', 'Save').click();
//         cy.wait('@postYard');
//         cy.wait('@yardPrefs');
//         cy.wait('@getTasks');
//         cy.wait('@makeTips');
//         cy.wait('@yardList');
//         cy.wait('@yardGroupList');
        
//         // Opening accordions with tests
//         cy.get('h3').contains('Ungrouped Yards').should('be.visible').click();
//         cy.get('h3').contains('testYard').should('be.visible').click();
//         cy.get('h3').contains('Preferences').click();

//         // Test that the page displays the given and default info correctly
//         cy.get('div').contains('27613').should('be.visible');
//         cy.get('div').contains('0 sqft').should('be.visible');
//         cy.get('div').contains('Unknown').should('be.visible');
//         cy.get('div').contains('2 day(s)').should('be.visible');
//         cy.get('div').contains('2\" / week').should('be.visible');
//         cy.get('div').contains('90 day(s)').should('be.visible');
//         cy.get('div').contains('1 lbs/1000 sqft').should('be.visible');
//         cy.get('div').contains('7 day(s)').should('be.visible');
//         cy.get('div').contains('180 day(s)').should('be.visible');
//     }),
    
//     // TODO: Make new yard (test preferences creation)
//     it("Creates a single yard with defaults", () => {
//         // Mocks Api Call to zipcode validator
//         cy.intercept('GET', 'https://api.zippopotam.us/us/*', {
//             statusCode: 200,
//             body: {
//                 "post code": "27613",
//                 "country": "United States",
//                 "country abbreviation": "US",
//                 "places": [
//                     {
//                         "place name": "Raleigh",
//                         "longitude": "-78.7228",
//                         "state": "North Carolina",
//                         "state abbreviation": "NC",
//                         "latitude": "35.9067"
//                     }
//                 ]
//             }
//         }).as('zip');

//         // Enters required fields and then navigates to preferences section
//         cy.get('#yardNameInput').type("TestYard");
//         cy.get('#zipCodeInput').type("27613");
//         cy.wait('@zip');
//         cy.get("[type='checkbox']").check();
        
//         // Mock get_yards response with no yards
//         cy.intercept('POST', '**/yards/', {
//             statusCode: 201, body: 
//                 {
//                     "id": 1,
//                     "yard_name": "TestYard",
//                     "yard_size": 0,
//                     "soil_type": "Unknown",
//                     "grass_type": "Unknown",
//                     "longitude": "Unknown",
//                     "latitude": "Unknown",
//                     "user": 8,
//                     "yard_group": null,
//                     "zip_code": "27613"
//                 }
//         }).as('postYard');
        
//         // Mock get_yards_preferences response with no yards
//         cy.intercept('POST', '**/yard_pref/1/', {
//             statusCode: 201, body: {
//                 "ok": true, 
//                 "detail": "Preferences created"
//             }
//         }).as('setYardPrefs');
        
//         // Mock get_yards response with no yards
//         cy.intercept('GET', '**/yards/', {
//             statusCode: 200, body: [
//                 {
//                     "id": 1,
//                     "yard_name": "testYard",
//                     "yard_size": 0,
//                     "soil_type": "Unknown",
//                     "grass_type": "Unknown",
//                     "longitude": "Unknown",
//                     "latitude": "Unknown",
//                     "user": 8,
//                     "yard_group": null,
//                     "zip_code": "27613"
//                 }
//             ]
//         }).as('yardList');

//         // Mock AI API call
//         cy.intercept('POST', '**/tips/*/', {
//             statusCode: 200, body: {}
//         }).as('makeTips');
        
//         // Mock get_yards_preferences response
//         cy.intercept('GET', '**/yard_pref/1/', {
//             statusCode: 200, body: {
//                 "ok": true,
//                 "data": {
//                     "id": 1,
//                     "watering_interval": 4.0,
//                     "watering_rate": 5.0,
//                     "fertilizing_interval": 6,
//                     "fertilizing_rate": 7.0,
//                     "mowing_interval": 8,
//                     "aeration_interval": 9,
//                     "dethatching_interval": 10,
//                     "yard": 1
//                 }
//             }
//         }).as('yardPrefs');

//         // Mock AI API call
//         cy.intercept('POST', '**/tips/1/', {
//             statusCode: 200, body: {}
//         }).as('makeTips');

//         // Mock get_yard_tasks response
//         cy.intercept("GET", "**/tasks/*/", { status: 200, body: [] }).as("getTasks");

//         // Moves to  the Preferences section and saves the yard info
//         cy.contains('button', 'Next').should('be.visible').click();
//         cy.wait('@postYard');
        
//         // Entering non-default values for yard preferences
//         // NOTE: fertilizing, aeration,  and dethatching are not tested currently
//         cy.get('[data-cy="prefs-modal"][data-yard-id="1"]').within(() => {
//             cy.get('[data-cy="wateringIntervalInput"]').clear().type('4');
//             cy.get('[data-cy="wateringRateInput"]').clear().type('5');
//             cy.get('[data-cy="fertilizingRateInput"]').clear().type('7');
//             cy.get('[data-cy="mowingIntervalInput"]').clear().type('8');
//         });

//         // Mocking API calls to the backend
//         cy.contains('button', 'Save Preferences').click();
//         cy.wait('@setYardPrefs');
//         cy.wait('@getTasks');
//         cy.wait('@makeTips')
//         cy.wait('@yardGroupList');
//         cy.wait('@yardList');
//         cy.wait('@yardPrefs');
        
//         // Opening accordions with tests
//         cy.get('h3').contains('Ungrouped Yards').should('be.visible').click();
//         cy.get('h3').contains('testYard').should('be.visible').click();
//         cy.get('h3').contains('Preferences').click();
        
//         // Test that the page displays the given and default info correctly
//         cy.get('div').contains('27613').should('be.visible');
//         cy.get('div').contains('0 sqft').should('be.visible');
//         cy.get('div').contains('Unknown').should('be.visible');
//         cy.get('div').contains('4 day(s)').should('be.visible');
//         cy.get('div').contains('5\" / week').should('be.visible');
//         cy.get('div').contains('7 lbs/1000 sqft').should('be.visible');
//         cy.get('div').contains('8 day(s)').should('be.visible');
//     })
// })

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
        

        cy.visit('/dashboard');
        cy.wait('@authMe');
        cy.wait('@yardList');
        cy.wait('@yardGroupList');
        cy.wait('@yardPrefs');
        cy.wait('@yardPrefs');
    })

    // Tests the functionality of making groups 
    it("Tests that yards show in groups properly", () => {
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

        // Mock AI API call
        cy.intercept('POST', '**/tips/*/', {
            statusCode: 200, body: {}
        }).as('makeTips');

        // Open new task modal
        cy.get('h1').contains('Yard Groups').should('be.visible');
        cy.get('button').contains('New Yard').should('be.visible').click();
        
        // Enter values for a new test
        cy.get('#yardNameInput').type("NewTestYard");
        cy.get('#zipCodeInput').type("27613");
        cy.wait('@zip');
        cy.get('#newGroupInput').type("newGroup");

        cy.intercept("GET", "**/tasks/*/", { status: 200, body: [] }).as("taskList")

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
                },
                {
                    "id": 3,
                    "yard_name": "newTestYard",
                    "yard_size": 0,
                    "soil_type": "Unknown",
                    "grass_type": "Unknown",
                    "longitude": "Unknown",
                    "latitude": "Unknown",
                    "user": 8,
                    "yard_group": {
                        "id":2,
                        "user":8,
                        "group_name":'newGroup'
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
            },
            {
                "id":2,
                "user":8,
                "group_name":'newGroup'
            }]
        }).as('yardGroupList');

        // Mock get_yards response with no yards
        cy.intercept('POST', '**/yards/', {
            statusCode: 201, body: 
                {
                    "id": 3,
                    "yard_name": "newTestYard",
                    "yard_size": 0,
                    "soil_type": "Unknown",
                    "grass_type": "Unknown",
                    "longitude": "Unknown",
                    "latitude": "Unknown",
                    "user": 8,
                    "yard_group": {
                        "id":2,
                        "user":8,
                        "group_name":'newGroup'
                    },
                    "zip_code": "27613"
                }
        }).as('postYard');

        // Mock get_yards response with no yards
        cy.intercept('POST', '**/yards/yard-groups', {
            statusCode: 201, body: 
                {
                    "id":2,
                    "user":8,
                    "group_name":'newGroup'
                }
        }).as('postYardGroup');

        // Mock get_yards response with no yards
        cy.intercept('POST', '**/yards/yard-groups/*/yard/*', {
            statusCode: 201, body: 
                {
                    "success": "Yard added to group"
                }
        }).as('addToGroup');

        //Submits the form
        cy.contains('button', 'Save').should('be.visible').click();
        cy.wait('@postYardGroup');
        cy.wait('@postYard');
        cy.wait('@taskList');
        cy.wait('@makeTips');
        cy.wait('@addToGroup');
        cy.wait('@yardList');
        cy.wait('@yardGroupList');
        cy.wait('@yardPrefs');
        cy.wait('@yardPrefs');
        cy.wait('@yardPrefs');

        // Checks that the new group is made and the new yard is in said group
        cy.get('span').contains('newGroup').should('be.visible').click();
        cy.get('span').contains('newTestYard').should('be.visible');
        cy.get('span').contains('testGroup').should('be.visible');
        cy.get('span').contains('Ungrouped Yards').should('be.visible');
    }),

    // Tests editing which group a yard belongs to and the ability to delete groups
    it("Tests editing a yard's group and group deletion", () => {
        // Opens up the groupedTestYard edit modal
        cy.get('span').contains('testGroup').should('be.visible').click();
        cy.get('span').contains('groupedTestYard').should('be.visible').click();
        // This references the edit button on a yard (when the page is expanded as it is above)
        cy.get('svg').eq(3).should('be.visible').click();
        cy.get('#yard-group-label').parent().should('be.visible').click();
        cy.get('li').contains('N/A').should('be.visible').click();
        
        // Intercepts
        cy.intercept("GET", "**/tasks/*/", { status: 200, body: [] }).as("taskList")

        // Editing yard
        cy.intercept(
        { method: "PUT", url: '**/yards/*/' },
            {
                statusCode: 200,
                body: {
                id: 2,
                yard_name: 'groupedTestYard',
                yard_size: 0,
                soil_type: 'Unknown',
                grass_type: 'Unknown',
                longitude: 'Unknown',
                latitude: 'Unknown',
                user: 8,
                yard_group: null, 
                zip_code: '27613'
                }
            }
        ).as('updateYard');
        
        // Mock AI API call
        cy.intercept('POST', '**/tips/*/', {
            statusCode: 200, body: {}
        }).as('makeTips');

        // Group list after editing
        cy.intercept('GET', '**/yards/yard-groups/', {
        statusCode: 200,
        body: []
        }).as('yardGroupList');

        // Yard list after editing
        cy.intercept('GET', '**/yards/', {
        statusCode: 200,
        body: [
            {
            id: 1, yard_name: 'testYard', yard_group: null,
            yard_size: 0, soil_type: 'Unknown', grass_type: 'Unknown',
            longitude: 'Unknown', latitude: 'Unknown', user: 8, zip_code: '27613'
            },
            {
            id: 2, yard_name: 'groupedTestYard', yard_group: null,
            yard_size: 0, soil_type: 'Unknown', grass_type: 'Unknown',
            longitude: 'Unknown', latitude: 'Unknown', user: 8, zip_code: '27613'
            }
        ]
        }).as('yardList');

        // Yard preferences
        cy.intercept('GET', '**/yard_pref/*/', (req) => {
        const id = req.url.match(/yard_pref\/(\d+)\//)?.[1];
        req.reply({
            statusCode: 200,
            body: {
            ok: true,
            data: {
                id: Number(id),
                watering_interval: 4, watering_rate: 5,
                fertilizing_interval: 6, fertilizing_rate: 7,
                mowing_interval: 8, aeration_interval: 9, dethatching_interval: 10,
                yard: Number(id)
            }
            }
        });
        }).as('yardPrefs');

        cy.intercept("DELETE", "**/yards/yard-groups/*/", { statusCode: 204 }).as("groupDelete")

        // Saving Shenanigans
        cy.contains('button', 'Save').should('be.visible').click();
        cy.wait('@updateYard');

        // Confirm group deletion
        cy.contains('button', 'Delete').should('be.visible').click();
        cy.wait('@groupDelete');
        cy.wait('@yardGroupList');
        cy.wait('@yardList');
        cy.wait('@yardPrefs');
        cy.wait('@yardPrefs');

        // Checks to confirm group was deleted and yards are where they should be
        cy.get('span').contains('Ungrouped Yards').should('be.visible').click();
        cy.get('span').contains('testYard').should('be.visible');
        cy.get('span').contains('groupedTestYard').should('be.visible').click();
        // This references the edit button on a yard (when the page is expanded as it is above)
        cy.get('svg').eq(3).should('be.visible').click();
        cy.get('#yard-group-label').parent().should('be.visible').click();
        cy.get('li').contains('testGroup').should('not.exist');
    }),
    // Edit yard group name
    it("Tests editing a yard's group's name", () => {
        cy.intercept('PUT', '**/yards/yard-groups/*', {
            statusCode: 200, body: {
                "id":1,
                "user":8,
                "group_name":'newGroupName'
            }
        }).as('groupReName');

        // Mock get_yard_groups response with no yard groups
        cy.intercept('GET', '**/yards/yard-groups', {
            statusCode: 200, body: [{
                "id":1,
                "user":8,
                "group_name":'newGroupName'
            }]
        }).as('yardGroupList');
        
        // Renaming the yard group
        // This references the first dropdown box (for the first named group)
        cy.get('svg').eq(0).click();
        // This references the edit icon for the first group
        cy.get('svg').eq(0).click();
        cy.get('input').type('newGroupName{enter}');
        cy.wait('@groupReName');
        cy.wait('@yardGroupList');
        
        // Checks that the group name was changed in the yard and on the group display
        cy.get('span').contains('newGroupName').should('be.visible').click();
        // This references the dropdown box for the yard inside the group
        cy.get('svg').eq(3).click();
        // This references the edit button for the yard inside the group
        cy.get('svg').eq(3).click();
        cy.get('#yard-group-label').parent().contains('newGroupName').should('be.visible');
    })
})