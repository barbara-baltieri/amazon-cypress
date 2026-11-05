import './commands';

// Amazon's own front-end occasionally throws errors unrelated to what we test.
Cypress.on('uncaught:exception', () => false);
