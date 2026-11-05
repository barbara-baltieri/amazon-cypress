import { selectors } from '../support/selectors';

const { customerService } = selectors;

class CustomerServicePage {
  assertLoaded() {
    cy.url().should('include', '/help');
    cy.get(customerService.searchInput).first().should('be.visible');
  }

  assertHelpSearchVisible() {
    cy.get(customerService.helpSearchInput).should('be.visible');
  }

  searchHelpTopicAndOpenResult(topic, resultTitle) {
    cy.get(customerService.helpSearchInput).should('be.visible').fillInput(topic).type('{enter}');
    cy.get(customerService.helpResultLinks)
      .filter(`:contains("${resultTitle}"):visible`)
      .first()
      .click();
  }

  searchHelpTopic(topic) {
    cy.get(customerService.searchInput).first().should('be.visible').fillInput(topic).type('{enter}');
    cy.get(customerService.results).should('have.length.greaterThan', 0);
  }

  clickFirstResult() {
    cy.get(customerService.results).first().should('be.visible').click();
  }

  assertHeading(text) {
    cy.get(customerService.heading).should('be.visible').and('contain.text', text);
  }

  assertArticleVisible() {
    cy.get(customerService.article).first().should('be.visible');
  }
}

export default new CustomerServicePage();
