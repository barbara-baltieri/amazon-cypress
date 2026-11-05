# Amazon Cypress E2E

Cypress automation for the Customer Service and free-shipping tasks. The tests target the live Amazon site, whose current UI and catalog differ from the PDF.

## Setup

```bash
npm install
npm run cy:open         # interactive runner
npm run cy:run          # all specs in cypress/e2e
npm run cy:run:support  # Customer Service specs
npm run cy:run:cart     # cart specs
```

The default `baseUrl` is `https://www.amazon.com`. Override it with `CYPRESS_BASE_URL` or `--config baseUrl=<url>`.

## PDF differences and test scenarios

### Customer Service

The current header menu depends on the delivery location. `customer-service-current-menu.cy.js` sets the delivery location to Brazil, dismisses Amazon's delivery-location notice, waits for the page to finish loading, then validates the visible menu and clicks “Customer Service” before searching for “where is my stuff”.

- `customer-service.cy.js` preserves the original PDF flow and may fail if the current site does not show the original menu items.
- `customer-service-current-menu.cy.js` validates the menu after changing the delivery location, clicks “Customer Service”, and validates the support article.

### Free shipping

The Bostitch sharpener's full PDF name is not returned in current search results, so the original test in `free-shipping.cy.js` intentionally fails at that lookup. Its scissors setup and later assertions remain in the test code, but Cypress stops at the failed lookup before reaching them.

The additional test uses a gray electric JARLINK sharpener (ASIN `B07XQ581DR`) that was verified in the current catalog. It adds the iBayam scissors from the PDF, selects “Red, Black, Blue”, changes delivery to Hong Kong, increases the sharpener quantity from 1 to 4, and checks the subtotal and free-shipping status.

Both cart scenarios use shared setup and an `afterEach` cleanup that deletes active and saved items until no visible Delete actions remain. The `manual-checks/` folder contains a diagnostic spec and is excluded from normal Cypress runs.

## Notes

- Test data and product details are in `cypress/fixtures/`.
- Selectors and availability depend on Amazon's live UI, region, inventory, and bot detection; results can vary between runs.
- The runner retries failed run-mode tests twice. The original Bostitch test is expected to fail; live-site timeouts may also cause unrelated failures.
