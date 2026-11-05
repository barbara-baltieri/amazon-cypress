import CustomerServicePage from '../../pages/CustomerServicePage';

describe('Customer Service (current header layout)', () => {
  let data;

  before(() => {
    cy.fixture('customer-service-current-menu').then((fixture) => {
      data = fixture;
    });
  });

  it('Should navigate to the "Where\'s My Stuff?" page using the current Amazon menu', () => {
    // Given Amazon home page is opened
    cy.openHomePage();

    // When I set the delivery location to Brazil
    cy.changeDeliveryLocation('Brazil');

    // And I dismiss the delivery-location notice
    cy.dismissDeliveryNotice();

    // And I wait for the location-specific page to finish loading
    cy.document().its('readyState').should('eq', 'complete');
    cy.get('#glow-ingress-line2').should('contain.text', 'Brazil');

    // When I validate the visible main menu items
    cy.validateMainMenu(data.visibleMenuItems);

    // And I click Customer Service in the main menu
    cy.openCustomerService();

    // And I search for "where is my stuff" and click the "Where's My Stuff?" result
    CustomerServicePage.searchHelpTopicAndOpenResult(data.helpTopic, data.expectedHeading);

    // Then the page should display "Where's My Stuff?"
    CustomerServicePage.assertHeading(data.expectedHeading);

    // And the support article should be visible
    CustomerServicePage.assertArticleVisible();
  });
});
