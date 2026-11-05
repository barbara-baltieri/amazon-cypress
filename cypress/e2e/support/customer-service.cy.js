import CustomerServicePage from '../../pages/CustomerServicePage';

describe('Customer Service', () => {
  let data;

  before(() => {
    cy.fixture('customer-service').then((fixture) => {
      data = fixture;
    });
  });

  it('Should successfully navigate to the "Where\'s My Stuff?" support page', () => {
    // Given Amazon home page is opened
    cy.openHomePage();

    // When I validate the main menu contains the expected items
    cy.validateMainMenu(data.mainMenuItems);

    // And I navigate to Customer Service
    cy.openCustomerService();

    // And I search for "where is my stuff"
    cy.searchHelpTopic(data.helpTopic);

    // And I click the first result
    CustomerServicePage.clickFirstResult();

    // Then the page should display "Where's My Stuff?"
    CustomerServicePage.assertHeading(data.expectedHeading);

    // And the support article should be visible
    CustomerServicePage.assertArticleVisible();
  });
});
