import CartPage from '../../pages/CartPage';
import ProductPage from '../../pages/ProductPage';

describe('Shopping Cart Free Shipping', () => {
  let products;

  before(() => {
    cy.fixture('products').then((fixture) => {
      products = fixture;
    });
  });

  const addSharpenerAndScissors = (addSharpener, sharpenerName, searchTerm = products.pencilSharpener.searchTerm) => {
    const { pencilSharpener, scissors, cartRules } = products;

    // Arrange: pencil sharpener in cart
    cy.openHomePage();
    cy.searchProduct(searchTerm);
    addSharpener();

    // Arrange: scissors in cart
    cy.openProductPage(scissors.path);
    ProductPage.assertImageVisible();
    cy.selectProductColor(scissors.color);
    cy.addProductToCart();

    // Arrange: both products exist in cart
    cy.validateProductInCart(sharpenerName);
    cy.validateProductInCart(scissors.shortName);

    // Arrange: both items show the delivery message before the location change
    CartPage.assertDeliveryMessage(sharpenerName, cartRules.deliveryMessage);
    CartPage.assertDeliveryMessage(scissors.shortName, cartRules.deliveryMessage);

    // Arrange: delivery location set to Hong Kong
    cy.changeDeliveryLocation('Hong Kong');

    // Arrange: both items still in the cart for Hong Kong; scissors show the Hong Kong shipping message
    CartPage.visit();
    CartPage.assertContainsProduct(sharpenerName);
    CartPage.assertDeliveryMessage(scissors.shortName, cartRules.deliveryMessageHongKong);
  };

  afterEach(() => {
    cy.clearCart();
  });

  it('Should qualify for free shipping after increasing cart subtotal above $49', () => {
    const { pencilSharpener, cartRules } = products;

    addSharpenerAndScissors(
      () => {
        cy.openProductFromResults(pencilSharpener.name);
        cy.addProductToCart();
      },
      pencilSharpener.name,
    );

    // Given my cart contains the pencil sharpener and scissors
    // When I navigate to the cart
    CartPage.visit();

    // Then I should not qualify for free shipping
    CartPage.assertQualifiesForFreeShipping(false);

    // When I add 3 additional pencil sharpeners (1 existing + 3 = 4)
    CartPage.setQuantity(pencilSharpener.name, 1 + cartRules.additionalSharpeners);

    // Then the cart subtotal should be greater than $49
    CartPage.assertSubtotalGreaterThan(cartRules.freeShippingThreshold);

    // And I should qualify for free shipping
    CartPage.assertQualifiesForFreeShipping(true);
  });

  it('Should qualify for free shipping using a sharpener that ships to Hong Kong', () => {
    const { hongKongPencilSharpener, cartRules } = products;

    // Pinned by ASIN to a gray electric desktop model verified active in Hong Kong.
    addSharpenerAndScissors(
      () => cy.addSearchResultToCart(hongKongPencilSharpener.asin),
      hongKongPencilSharpener.cartName,
      hongKongPencilSharpener.searchTerm,
    );

    CartPage.visit();
    CartPage.assertQualifiesForFreeShipping(false);

    CartPage.setQuantity(hongKongPencilSharpener.cartName, 1 + cartRules.additionalSharpeners);
    CartPage.assertSubtotalGreaterThan(cartRules.freeShippingThreshold);
    CartPage.assertQualifiesForFreeShipping(true);
  });
});
