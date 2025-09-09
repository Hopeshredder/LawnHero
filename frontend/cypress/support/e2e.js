// cypress/support/e2e.js (or support/index.js for older Cypress)
Cypress.on('uncaught:exception', (err) => {
  if (String(err).includes('_leaflet_pos')) {
    return false; // don't fail the test on this known Leaflet init hiccup
  }
});