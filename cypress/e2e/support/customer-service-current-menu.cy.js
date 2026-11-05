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

    // When I validate the visible main menu items
    cy.validateMainMenu(data.visibleMenuItems);

    // And I navigate to Customer Service through the header link
    cy.openCustomerServiceFromNavigation(data.customerServiceLinkText);

    // And I search for "where is my stuff" and click the "Where's My Stuff?" result
    CustomerServicePage.searchHelpTopicAndOpenResult(data.helpTopic, data.expectedHeading);

    // Then the page should display "Where's My Stuff?"
    CustomerServicePage.assertHeading(data.expectedHeading);

    // And the support article should be visible
    CustomerServicePage.assertArticleVisible();
  });
});
