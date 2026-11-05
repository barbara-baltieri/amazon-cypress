import { selectors } from '../support/selectors';

const { home, searchResults, product } = selectors;

class HomePage {
  visit() {
    cy.visit('/');
    cy.get(home.searchInput).should('be.visible');
    return this;
  }

  assertMainMenuContains(items) {
    cy.get(home.mainMenu).should('be.visible').within(() => {
      items.forEach((item) => {
        cy.contains(home.menuLink, item).should('be.visible');
      });
    });
  }

  // Current header: Customer Service lives in a hidden account flyout, so navigate through its href.
  openNavigationLink(label) {
    cy.get(home.navigation).contains('a', label).should('have.attr', 'href').then((href) => {
      cy.visit(href);
    });
  }

  openMenuItem(label) {
    cy.get(home.mainMenu).contains(home.menuLink, label).should('be.visible').click();
  }

  search(term) {
    // Amazon's scripts can reset the box while the page is still loading, so fill only after load.
    cy.document().its('readyState').should('eq', 'complete');
    cy.get(home.searchInput).should('be.visible').fillInput(term);
    // Re-query the box so the click only happens while it still holds the term.
    cy.get(home.searchInput).should('have.value', term);
    cy.get(home.searchButton).should('be.visible').click();
    // A previous results page also lives at /s, so wait for the new query in the URL, then for its results.
    // The click is occasionally swallowed, so re-click (at most twice) every 8s while the URL has not changed.
    const startedAt = Date.now();
    let reClicks = 0;
    cy.location('search', { timeout: 30000 }).should((search) => {
      const submitted = new URLSearchParams(search).get('k') === term;
      if (!submitted && reClicks < 2 && Date.now() - startedAt > 8000 * (reClicks + 1)) {
        reClicks += 1;
        cy.$$(home.searchButton)[0]?.click();
      }
      expect(submitted, `search submitted for "${term}"`).to.equal(true);
    });
    cy.get(searchResults.item, { timeout: 30000 }).should('have.length.greaterThan', 0);
  }

  openFirstResultMatching(name) {
    cy.contains(searchResults.item, name).find(searchResults.title).first().click();
  }

  openFirstResult() {
    cy.get(searchResults.item).first().find(searchResults.title).first().click();
  }

  openResultByAsin(asin) {
    cy.get(searchResults.item).filter(`[data-asin="${asin}"]`).find(searchResults.title).first().click();
    cy.get(product.title).should('be.visible');
  }

  addResultToCart(asin) {
    // filter() instead of string concat: searchResults.item is a comma selector, so appending [data-asin] only narrowed its last part.
    cy.get(searchResults.item).filter(`[data-asin="${asin}"]`)
      .find(searchResults.addToCart).first()
      .scrollIntoView().should('be.visible').click();
    // Cart badge updates once the add request completes, so navigating away is safe.
    cy.get(home.cartCount).should('not.have.text', '0');
  }

  changeDeliveryLocation(country) {
    cy.get(home.locationLink).should('be.visible').click();
    cy.get(home.locationModal).should('be.visible');
    cy.get(home.locationCountryDropdown).should('be.visible').click();
    cy.get('#GLUXCountryList').select(country, { force: true });
    cy.get(home.locationDoneButton).should('be.visible').click();
    cy.get(home.locationLine).should('contain.text', country);
  }

  changeShippingCountry(country) {
    cy.get(home.countrySelector).click();
    cy.get(home.countryDropdown).click();
    cy.contains(home.countryOption, country).click();
    cy.get(home.saveCountryButton).first().click();
  }
}

export default new HomePage();
