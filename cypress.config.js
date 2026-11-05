const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    // Single source of truth for the target host. Override: CYPRESS_BASE_URL or --config baseUrl=...
    baseUrl: process.env.CYPRESS_BASE_URL || 'https://www.amazon.com',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    viewportWidth: 1440,
    viewportHeight: 900,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 60000,
    retries: { runMode: 2, openMode: 0 },
    video: false,
    screenshotOnRunFailure: true,
    chromeWebSecurity: false,
  },
});
