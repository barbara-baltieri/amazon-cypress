import { selectors } from '../support/selectors';

const { cart } = selectors;

const parseMoney = (text) => parseFloat(text.replace(/[^0-9.]/g, ''));

class CartPage {
  visit() {
    cy.visit('/gp/cart/view.html');
    cy.get(cart.buyBox).should('exist');
  }

  assertContainsProduct(nameFragment) {
    cy.contains(cart.activeItem, nameFragment).should('be.visible');
  }

  // The Hong Kong shipping line sits outside [data-cy="delivery-block"], so check the whole item row.
  assertDeliveryMessage(nameFragment, text) {
    cy.contains(cart.activeItem, nameFragment).should('contain.text', text);
  }

  // The text input is hidden (sc-hidden); the visible control is the +/- stepper, so click it one step at a time.
  setQuantity(nameFragment, quantity) {
    return cy.contains(cart.activeItem, nameFragment).find(cart.quantityInput).invoke('val').then((value) => {
      const current = Number(value);
      if (current === quantity) return;

      const increasing = current < quantity;
      const next = current + (increasing ? 1 : -1);
      const control = increasing ? cart.increaseQuantity : cart.decreaseQuantity;

      return cy.contains(cart.activeItem, nameFragment).find(control).first().click()
        .then(() => cy.contains(cart.activeItem, nameFragment).find(cart.quantityInput)
          .should('have.value', String(next)))
        .then(() => this.setQuantity(nameFragment, quantity));
    });
  }

  // Amazon keeps the row in the DOM after delete and swaps in a "removed" message.
  deleteItem(nameFragment) {
    cy.contains(cart.activeItem, nameFragment).find(cart.deleteButton).first().click();
    cy.contains(cart.activeItem, nameFragment).find(cart.removedMessage).should('exist');
  }

  assertSubtotalGreaterThan(amount) {
    // Retries until the subtotal refreshes after a quantity change.
    cy.get(cart.subtotal).first().should(($el) => {
      expect(parseMoney($el.text())).to.be.greaterThan(amount);
    });
  }

  assertQualifiesForFreeShipping(expected) {
    const matcher = /qualifies for free shipping|eligible for free shipping/i;
    cy.get(cart.buyBox).should(($box) => {
      expect(matcher.test($box.text()), 'free shipping eligibility').to.equal(expected);
    });
  }

  // No buy-box check: an empty cart (or a failed test) may not render it.
  clear() {
    cy.visit('/gp/cart/view.html');
    return this.deleteAllItems().then(() => {
      cy.get('body').should(($body) => {
        const remainingDeletes = $body.find(cart.item).find(cart.deleteButton).filter(':visible');
        expect(remainingDeletes, 'visible cart delete actions after cleanup').to.have.length(0);
      });
    });
  }

  // Deletes one item at a time until the cart has none left; the item count is unknown in afterEach.
  deleteAllItems() {
    const visibleDeletes = ($body) => $body.find(cart.item).find(cart.deleteButton).filter(':visible');
    return cy.get('body').then(($body) => {
      const $delete = visibleDeletes($body);
      if (!$delete.length) return;
      const before = $delete.length;
      return cy.wrap($delete.first()).click().then(() => cy.get('body').should(($b) => {
        expect(visibleDeletes($b).length).to.be.lessThan(before);
      })).then(() => this.deleteAllItems());
    });
  }
}

export default new CartPage();
