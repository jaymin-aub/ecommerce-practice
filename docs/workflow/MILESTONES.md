# Project Milestones (Flow-Driven Roadmap)

High-level roadmap structured into **vertical feature flows**. Each milestone delivers a complete, testable user story end-to-end (Contracts $\rightarrow$ API $\rightarrow$ Frontend UI $\rightarrow$ Verification), ensuring no black-box code or disconnected layers.

---

## Milestone 1: Spec Foundation, API Contracts & Shared DTOs

- **Description:** 
  Establish the architectural and contract baseline for all feature flows. Finalize the 17-endpoint REST API inventory, fix the public route access blocker in product routes, draft single-source-of-truth TypeScript DTOs in `shared/`, and configure `@shared/*` path aliases across backend and frontend.
- **Key Questions:**
  - What exact fields must be exposed vs. stripped in public product and auth responses?
  - How will path aliases (`@shared/*`) resolve in both Node.js (ESM) and Angular (Vite/esbuild)?
- **Core Challenges:**
  - Guaranteeing zero `any` and strict type safety across network boundaries.
- **Definition of Done:**
  - [x] Initial git baseline committed and pushed to `main`.
  - [x] MongoDB verified and seeded with initial products and users.
  - [x] CORS middleware configured for `localhost:4200`.
  - [x] Public access unblocked for catalog routes (`GET /api/products`).
  - [x] Shared domain types and request/response DTOs defined in `shared/src/types/`.
  - [x] `@shared/*` path aliases configured and compiling cleanly in both `backend` and `frontend`.
- **Detailed Plan:** See [PROGRESS.md](./PROGRESS.md#milestone-1-spec-foundation-api-contracts--shared-dtos)

---

## Milestone 2: Flow 1 — Public Catalog Browsing & Real-Time Stock

- **User Story:** 
  Any visitor (guest or authenticated) can browse the catalog, view paginated products, inspect live stock levels with color-coded status badges ("In Stock", "Only X left!", "Out of Stock"), and search/filter without logging in.
- **Description:** 
  Deliver the complete end-to-end product browsing slice. Wire the public paginated product API to a modern Angular shell using standalone components, Angular Signals for reactive state, and Tailwind CSS v4 for clean badge states.
- **Key Questions:**
  - How should pagination state and search queries be managed reactively using Signals?
  - What threshold determines "low stock" warning badges (e.g., $\le 3$ items)?
- **Core Challenges:**
  - Preventing change detection loops or function re-execution in template bindings; strictly using `computed()` signals.
- **Definition of Done:**
  - [ ] Public `GET /api/products` verified with pagination metadata and `.lean()` queries.
  - [ ] Standalone `ProductCardComponent` using `input.required<Product>()` and modern `@if` / `@for` with unique `track`.
  - [ ] Catalog grid with responsive layout, dynamic stock badges, and empty fallback state (`@empty`).
  - [ ] Unit tests for `ProductService` and `ProductCardComponent` passing in Vitest.
- **Detailed Plan:** See [PROGRESS.md](./PROGRESS.md#milestone-2-flow-1--public-catalog-browsing--real-time-stock)

---

## Milestone 3: Flow 2 — Authentication, Session Restore & Guest Interception

- **User Story:** 
  Users can register and log in via clean forms with validation feedback. When a logged-in user refreshes their browser, their session persists seamlessly. If a guest clicks "Add to Cart", they are intercepted with a friendly login/register prompt that restores their browsing position after authentication.
- **Description:** 
  Deliver the authentication and session management slice. Implement the `GET /api/auth/me` endpoint, build Angular Reactive Forms using `NonNullableFormBuilder`, set up functional HTTP interceptors for JWT injection, and manage user state via readonly signals.
- **Key Questions:**
  - How to smoothly store tokens (LocalStorage vs. HTTP-only cookies) and restore state on browser reload?
  - How to intercept guest actions without losing the user's intent?
- **Core Challenges:**
  - Proper form validation timing (displaying errors only when controls are `touched` or `dirty`) without template clutter.
- **Definition of Done:**
  - [ ] `GET /api/auth/me` implemented to validate JWT and restore active user session.
  - [ ] Reactive register and login forms with real-time validation and error handling.
  - [ ] Functional `HttpInterceptorFn` attaching bearer tokens to outgoing API requests.
  - [ ] `AuthService` exposing readonly state signals (`currentUser`, `isLoggedIn`).
  - [ ] Guest interception prompt triggered when unauthenticated users attempt restricted actions.
- **Detailed Plan:** See [PROGRESS.md](./PROGRESS.md#milestone-3-flow-2--authentication-session-restore--guest-interception)

---

## Milestone 4: Flow 3 & 4 — Shopping Cart & Atomic Inventory Sync

- **User Story:** 
  A logged-in user clicks "Add to Cart" on a product card: the visible stock decrements immediately on the card, the cart badge updates, and the item enters their cart. In the cart drawer, the user can adjust quantities (`+`/`-`) or remove items, which automatically restores stock to the catalog.
- **Description:** 
  Deliver the core e-commerce transaction and cart management flow. Implement atomic MongoDB inventory mutation using `$inc` with condition guards (`{ stock: { $gt: 0 } }`) to eliminate race conditions, paired with an interactive slide-out cart panel in Angular.
- **Key Questions:**
  - How will stock restoration be handled if a user abandons their cart vs. explicitly removes an item?
  - How should cart state synchronize reactively across the navbar badge, catalog cards, and drawer?
- **Core Challenges:**
  - Guaranteeing atomicity: stock must NEVER drop below zero under concurrent requests.
- **Definition of Done:**
  - [ ] Cart data model and atomic service operations implemented on backend (`$inc: -1` and `$inc: +1`).
  - [ ] Cart endpoints operational: `GET /api/cart`, `POST /api/cart/items`, `PATCH /api/cart/items/:id`, `DELETE /api/cart/items/:id`.
  - [ ] Slide-out cart drawer component with quantity controls, line-item subtotals, and grand total summary.
  - [ ] Live cart badge in top navigation reacting instantly to additions and deletions via Signals.
  - [ ] Product card stock count decrements immediately upon cart addition; disables button when stock hits 0.
- **Detailed Plan:** See [PROGRESS.md](./PROGRESS.md#milestone-4-flow-3--4--shopping-cart--atomic-inventory-sync)

---

## Milestone 5: Flow 5 — Adversarial Testing, Performance & Production Polish

- **User Story:** 
  The store operates reliably under edge cases: simultaneous purchases of the last item fail gracefully, network disconnects trigger informative toast notifications, and the web app loads with fast time-to-interactive.
- **Description:** 
  Audit, stress-test, and harden the full application. Perform concurrency testing on inventory depletion, implement `@defer` loading and OnPush change detection, optimize bundle assets, and conduct a final code cleanliness review.
- **Key Questions:**
  - What happens when two users click "Add to Cart" on the final available item at the exact same millisecond?
  - What performance gains are achieved by deferring off-screen components?
- **Core Challenges:**
  - Writing reproducible adversarial concurrency tests verifying HTTP 400 response on stock exhaustion.
- **Definition of Done:**
  - [ ] Concurrency test suite proving negative stock is mathematically impossible.
  - [ ] Angular views optimized with `@defer` and OnPush strategy.
  - [ ] Centralized toast notifications for all user actions (added to cart, login success, stock depleted).
  - [ ] Zero TypeScript errors (`npm run typecheck`) and zero linter warnings across entire workspace.
- **Detailed Plan:** See [PROGRESS.md](./PROGRESS.md#milestone-5-flow-5--adversarial-testing-performance--production-polish)
