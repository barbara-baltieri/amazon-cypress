import HomePage from '../pages/HomePage';
import CustomerServicePage from '../pages/CustomerServicePage';
import ProductPage from '../pages/ProductPage';
import CartPage from '../pages/CartPage';

Cypress.Commands.add('openHomePage', () => {
  HomePage.visit();
});

// Sets the value in one go; cy.type() is slow on Amazon because every key triggers search suggestions.
Cypress.Commands.add('fillInput', { prevSubject: 'element' }, ($input, value) => {
  cy.wrap($input)
    .invoke('val', value)
    .trigger('input')
    .trigger('change')
    .should('have.value', value);
});

Cypress.Commands.add('validateMainMenu', (items) => {
  HomePage.assertMainMenuContains(items);
});

Cypress.Commands.add('searchProduct', (term) => {
  HomePage.search(term);
});

Cypress.Commands.add('openProductFromResults', (name) => {
  HomePage.openFirstResultMatching(name);
});

Cypress.Commands.add('openFirstSearchResult', () => {
  HomePage.openFirstResult();
});

Cypress.Commands.add('addSearchResultToCart', (asin) => {
  HomePage.addResultToCart(asin);
});

Cypress.Commands.add('addProductToCart', () => {
  ProductPage.addToCart();
  ProductPage.assertAddedToCart();
});

Cypress.Commands.add('openProductFromResultsByAsin', (asin) => {
  HomePage.openResultByAsin(asin);
});

Cypress.Commands.add('openProductPage', (path) => {
  ProductPage.visit(path);
});

Cypress.Commands.add('selectProductColor', (color) => {
  ProductPage.selectColor(color);
  ProductPage.assertSelectedColor(color);
});

Cypress.Commands.add('openCustomerService', () => {
  HomePage.openMenuItem('Customer Service');
  CustomerServicePage.assertLoaded();
});

Cypress.Commands.add('openCustomerServiceFromNavigation', (label) => {
  HomePage.openNavigationLink(label);
  CustomerServicePage.assertHelpSearchVisible();
});

Cypress.Commands.add('searchHelpTopic', (topic) => {
  CustomerServicePage.searchHelpTopic(topic);
});

Cypress.Commands.add('validateProductInCart', (nameFragment) => {
  CartPage.visit();
  CartPage.assertContainsProduct(nameFragment);
});

Cypress.Commands.add('clearCart', () => {
  CartPage.clear();
});

Cypress.Commands.add('changeDeliveryLocation', (country) => {
  HomePage.changeDeliveryLocation(country);
});

Cypress.Commands.add('dismissDeliveryNotice', () => {
  HomePage.dismissDeliveryNotice();
});

Cypress.Commands.add('changeShippingCountry', (country) => {
  HomePage.changeShippingCountry(country);
});
