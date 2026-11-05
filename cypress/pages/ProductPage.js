import { selectors } from '../support/selectors';

const { product } = selectors;

class ProductPage {
  visit(path) {
    cy.visit(path);
    cy.get(product.title).should('be.visible');
  }

  assertImageVisible() {
    cy.get(product.image).first().should('be.visible');
  }

  selectColor(color) {
    // The color name only lives in the swatch image alt; the aria label holds just price/stock.
    cy.get(product.colorSwatchItem)
      .filter(`:has(img[alt="${color}"])`)
      .should('have.length', 1)
      .find(product.colorSwatchInput)
      .scrollIntoView()
      .click();
  }

  assertSelectedColor(color) {
    cy.get(product.selectedColor).first().should('contain.text', color);
  }

  addToCart() {
    // #a-autoid-1 is a generic id; only use it when the standard button is absent.
    cy.get('body').then(($body) => {
      const selector = $body.find('#add-to-cart-button').length ? '#add-to-cart-button' : product.addToCart;
      cy.get(selector).first().should('be.visible').and('not.be.disabled').click();
    });
  }

  assertAddedToCart() {
    cy.get(product.addedConfirmation).first().should('be.visible').invoke('text').should('match', /added to cart/i);
  }
}

export default new ProductPage();
