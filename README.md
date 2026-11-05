# Amazon Cypress E2E

Cypress (JavaScript) suite covering Amazon Customer Service navigation and shopping-cart delivery/free-shipping behavior.

## Setup

```bash
npm install            # installs Cypress 15.x (or: npm i -D cypress@latest)
npm run cy:open        # interactive
npm run cy:run         # headless
npm run cy:run:support # only Customer Service
npm run cy:run:cart    # only free-shipping
```

Override the host without changing code with `npx cypress run --config baseUrl=https://www.amazon.com`, or set `CYPRESS_BASE_URL` before running Cypress.

## Test data (`cypress/fixtures`)

| File | Content |
|------|---------|
| `products.json` | Original Bostitch search data, a Hong Kong-available gray electric sharpener pinned by ASIN, scissors (relative path and selected color), and cart/delivery rules |
| `customer-service.json` | Expected menu items, help topic, expected heading |

The scissors URL is stored as a path (`/Scissors-.../dp/B07H3QKN2Z`) so the domain lives only in `baseUrl`.

## Architecture & file responsibilities

| File | Why it exists / responsibility | Maintainability benefit |
|------|-------------------------------|-------------------------|
| `cypress.config.js` | Runner config: `baseUrl`, viewport, timeouts, retries (`runMode: 2`, `openMode: 0`) | One place to change environment/host |
| `cypress/support/e2e.js` | Support entry: loads commands, ignores unrelated app exceptions | Global behavior centralized |
| `cypress/support/selectors.js` | All locators grouped by page (`data-testid` first, stable ids otherwise) | A UI change = one edit |
| `cypress/support/commands.js` | Business-level custom commands (`searchProduct`, `addProductToCart`, `openCustomerService`, `searchHelpTopic`, `validateProductInCart`, `clearCart`, `changeShippingCountry`, ...) delegating to pages | Specs read like the scenario; no duplicated flows |
| `cypress/pages/HomePage.js` | Menu, search submission/result waits, delivery-location modal and country selection | Cohesive page knowledge, low coupling to specs |
| `cypress/pages/CustomerServicePage.js` | Help search, first result, heading/article assertions | Isolated from cart logic |
| `cypress/pages/ProductPage.js` | Image, color, add-to-cart and confirmation | Reused by both products |
| `cypress/pages/CartPage.js` | Active cart items, exact quantity via stepper, subtotal, free-shipping check, and recursive cleanup | Cleanup and assertions reused in hooks |
| `cypress/fixtures/*.json` | Static data | No magic strings in specs |
| `cypress/e2e/support/customer-service.cy.js` | Test 1 (BDD Given/When/Then), written against the requested menu. May fail: the current Amazon header has no visible "Customer Service" / "Sell" links | Thin spec, only intent |
| `cypress/e2e/support/customer-service-current-menu.cy.js` | Same flow adapted to the current header (visible items "Today's Deals", "Gift Cards"; Customer Service reached via its header link `href`). Passing | Reflects the real UI |
| `cypress/e2e/cart/free-shipping.cy.js` | Two free-shipping scenarios. Both arrange products in the test helper and clear the cart in `afterEach`. | Shared setup, isolated cleanup |

## Cart scenarios

- The first test searches for the full Bostitch EPS4-KTGRAY title in the results. It is expected to fail because that full title is not present in Amazon's search-result text. The scissors steps remain after the sharpener step in the shared setup, but Cypress stops the test at the missing sharpener result, so those steps do not run in this test.
- The second test searches for a gray electric sharpener and adds the JARLINK model pinned by ASIN `B07XQ581DR`. It opens the scissors product by URL, selects the configured `Red, Black, Blue` variant, changes delivery location to Hong Kong, and increases the sharpener quantity from one to four. It checks the cart subtotal and free-shipping status.
- After each test, cleanup repeatedly clicks row-level Delete actions for active and saved items until none remain, then asserts that no visible Delete actions are left. Removed rows may remain in the DOM, so cleanup checks actions rather than raw row count.
- Delivery copy is checked before and after the location change using the configured messages (`FREE delivery` and `FREE Shipping to Hong Kong`).

Design notes: the main Amazon search uses the search field and submit button, then waits for the query URL and results; Customer Service search inputs are filled in one operation. There are no fixed `cy.wait(ms)` delays. Page Objects hold page-specific behavior and custom commands keep specs readable.

## Important caveats

- Amazon has no public test environment, uses bot detection (CAPTCHA) and A/B-tests its DOM. Selectors in `selectors.js` are best-effort and **must be validated against the live DOM**. Search order, product availability, delivery messages, and page-load times can change between runs.
- `cypress.config.js` is at the project root (where Cypress discovers it), not inside `cypress/`.
- The cart suite has been run against the live Amazon site. The Hong Kong sharpener test passed in the last recorded run; the first test's search failure is intentional. Live-site timeouts can still cause unrelated failures.
