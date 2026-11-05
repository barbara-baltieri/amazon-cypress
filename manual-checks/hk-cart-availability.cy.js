describe('temporary Hong Kong cart availability check', () => {
  it('keeps the gray Bostitch sharpener in the cart for Hong Kong', () => {
    cy.openProductPage('/dp/B0FQ72RSZX');
    cy.get('#add-to-cart-button').should('be.visible').click();
    cy.contains('button', 'No thanks').should('be.visible').click();
    cy.get('#NATC_SMART_WAGON_CONF_MSG_SUCCESS, #sw-atc-confirmation, #huc-v2-order-row-confirm-text')
      .first().should('be.visible');
    cy.visit('/gp/cart/view.html');
    cy.get('#sc-buy-box').should('exist');
    cy.get('[data-asin="B0FQ72RSZX"]').should('contain.text', 'Bostitch Electric Pencil Sharpener for Classroom and Desk, Gray');
    cy.changeDeliveryLocation('Hong Kong');
    cy.visit('/gp/cart/view.html');
    cy.get('[data-asin="B0FQ72RSZX"]').should('contain.text', 'FREE Shipping to Hong Kong');
  });

  afterEach(() => {
    cy.clearCart();
  });
});
