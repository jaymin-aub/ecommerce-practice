# Project Milestones

High-level roadmap outlining the major phases of the project. Each milestone defines the target objective, key questions, and challenges that will be expanded into detailed execution checklists in [PROGRESS.md](./PROGRESS.md).

---

## Template Format for Milestones

```markdown
### Milestone [X]: [Milestone Title]

- **Description:** 
  [3-4 line summary of what this milestone covers, its primary objective, and how it moves the product forward.]
- **Key Questions:**
  - [Open architectural or design question #1]
  - [Open question #2]
- **Core Challenges:**
  - [Technical hurdle, concurrency risk, or integration challenge]
- **Definition of Done:**
  - [ ] [Measurable outcome #1]
  - [ ] [Measurable outcome #2]
- **Detailed Plan:** See [PROGRESS.md](./PROGRESS.md#milestone-x)
```

---

## Active & Upcoming Milestones

### Milestone 1: Baseline Setup & Shared Contracts
- **Description:** 
  Establish a clean working baseline across the repository. Verify database connectivity and seeder scripts, resolve immediate backend blockers (CORS and middleware), and establish unified domain contracts in `shared/` as the single source of truth for both frontend and backend.
- **Key Questions:**
  - How should path aliases be structured across backend and frontend to consume `shared/` cleanly?
  - What exact payload structures should standard API responses follow?
- **Core Challenges:**
  - Ensuring strict typing with zero `any` across frontend and backend boundaries.
- **Definition of Done:**
  - [x] Clean initial git commit established.
  - [x] MongoDB connected and seeded successfully.
  - [ ] Shared contracts and DTOs established and compiling cleanly.
- **Detailed Plan:** See [PROGRESS.md](./PROGRESS.md#milestone-1-baseline-setup--shared-contracts)

---

### Milestone 2: Backend Architecture & Cart Core
- **Description:** 
  Refactor backend controllers to enforce 4-layer separation (Routes -> Controllers -> Services -> Models). Implement Cart data modeling and atomic inventory management to ensure stock is accurately tracked and protected against race conditions.
- **Key Questions:**
  - Should cart items be an embedded subdocument array on User or a standalone Cart collection?
  - At what stage should stock be reserved vs. released?
- **Core Challenges:**
  - Guaranteeing atomic inventory operations using MongoDB `$inc` and conditional guards.
- **Definition of Done:**
  - [ ] Service layer cleanly decoupled from Express controllers.
  - [ ] Cart endpoints fully functional and tested.
- **Detailed Plan:** See [PROGRESS.md](./PROGRESS.md#milestone-2-backend-architecture--cart-core)

---

### Milestone 3: Frontend Foundations & Shell
- **Description:** 
  Build out the Angular application shell using standalone components, Angular Signals, and Tailwind CSS. Set up HTTP interceptors for JWT management, global error handling, and reactive layout components including the top navigation bar with a live cart badge.
- **Key Questions:**
  - How will auth and cart state persist across page reloads?
  - What is the reactive data flow between signals and UI triggers?
- **Core Challenges:**
  - Enforcing pure Signals architecture with zero memory leaks and modern control flow.
- **Definition of Done:**
  - [ ] Core layout, navigation bar, and responsive shell operational.
  - [ ] Interceptors and root signal services wired up.
- **Detailed Plan:** See [PROGRESS.md](./PROGRESS.md#milestone-3-frontend-foundations--shell)

---

### Milestone 4: Product Catalog & Real-Time Stock
- **Description:** 
  Implement the product browsing experience with clean grid layouts, pagination, and real-time inventory indicators. Ensure the catalog accurately reflects remaining quantities, dynamically toggling stock badge colors and disabling actions when items deplete.
- **Key Questions:**
  - How should pagination and filtering be reflected reactively in UI state?
- **Core Challenges:**
  - Synchronizing catalog stock levels immediately when items are added to the cart.
- **Definition of Done:**
  - [ ] Product grid with proper responsive cards and status badges.
  - [ ] "Add to Cart" triggers stock decrease without full-page reloads.
- **Detailed Plan:** See [PROGRESS.md](./PROGRESS.md#milestone-4-product-catalog--real-time-stock)

---

### Milestone 5: Authentication & Session Management
- **Description:** 
  Implement secure user registration and login flows using Reactive Forms with strict validation. Integrate token-based authentication with smooth redirect handling, prompting guest users to log in when attempting restricted actions like adding to cart.
- **Key Questions:**
  - How to smoothly return the user to their exact cart action after authenticating?
- **Core Challenges:**
  - Proper form validation UX and secure token storage without exposing credentials.
- **Definition of Done:**
  - [ ] Register and Login forms fully operational.
  - [ ] Guest interception flow working seamlessly.
- **Detailed Plan:** See [PROGRESS.md](./PROGRESS.md#milestone-5-authentication--session-management)

---

### Milestone 6: Cart Panel & Full Checkout Experience
- **Description:** 
  Build the interactive shopping cart panel/page allowing users to adjust quantities, remove items, and view price calculations. Complete the cycle by testing concurrent operations and end-to-end edge cases.
- **Key Questions:**
  - What confirmation or feedback is required for destructive actions like cart removal?
- **Core Challenges:**
  - Accurate stock restoration when items are decremented or removed.
- **Definition of Done:**
  - [ ] Cart drawer/page with live subtotal and quantity controls.
  - [ ] Adversarial testing for race conditions and edge cases passing cleanly.
- **Detailed Plan:** See [PROGRESS.md](./PROGRESS.md#milestone-6-cart-panel--full-checkout-experience)
