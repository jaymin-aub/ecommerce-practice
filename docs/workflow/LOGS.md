# Engineering Decisions & Phase Logs

A structured ledger capturing every key architectural and implementation decision taken by AI or the Human Router, complete with code references (filename + line numbers), concise rationale, and cumulative phase achievements.

---

## Log Entry Template

```markdown
### [YYYY-MM-DD] [Phase / Milestone Reference]: [Short Title of Decision / Change]

- **Actor:** Human Router / Helper AI / Worker AI
- **Context & What Was Achieved:**
  [1-2 sentences on what milestone slice was completed immediately prior to this entry.]
- **Decision:**
  [Concise explanation of what was decided or implemented.]
- **Rationale & Alternatives Considered:**
  - *Why this choice:* [Core reason, performance benefit, or invariant protection]
  - *Rejected alternatives:* [Other option and why it was discarded]
- **Code References:**
  - `path/to/file.ts#L10-L25` - [Brief note on what this block does]
- **Git Commit:** `[commit-hash / branch]`
```

---

## Phase Logs

### Phase 0: Project Inception & Workflow Setup

- **Actor:** Human Router & AI Assistant
- **Context & What Was Achieved:**
  - Initial repository structure explored: Angular 22 frontend, Express + Mongoose backend, docs, and shared directories.
  - Formulated the human-in-the-loop 2-terminal architecture (Helper, Worker).
  - Established initial roadmap templates in [MILESTONES.md](./MILESTONES.md), [PROGRESS.md](./PROGRESS.md), and [LOGS.md](./LOGS.md).
- **Decision:**
  Adopt a strict Human-Router workflow over autonomous multi-agent swarms to maximize personal comprehension and guarantee code ownership throughout development.
- **Rationale & Alternatives Considered:**
  - *Why this choice:* Prevents "vibe coding", keeps human engineer in direct control of every architectural boundary, and enforces learning loop.
  - *Rejected alternatives:* Autonomous hub-and-spoke swarm (rejected to prevent black-box code generation and context drift).
- **Code References:**
  - `docs/MILESTONES.md#L1-L100` - High-level milestone roadmap and definitions of done.
  - `docs/PROGRESS.md#L1-L100` - Step-by-step execution checklists and human gatekeeping points.
- **Git Commit:** `8e7c3f2` (Initial Commit)

---

### Phase 1: Baseline Setup & Shared Contracts

#### [2026-11-19] Backend: CORS Configuration
- **Actor:** Worker AI & Human Router
- **Context & What Was Achieved:**
  - Configured CORS middleware in `backend/app.ts` to allow requests originating from Angular dev server (`localhost:4200` and `127.0.0.1:4200`).
- **Decision:**
  Explicitly configure `cors` with credentials support and origin whitelist parsed from `CLIENT_ORIGIN` env or defaults, preventing cross-origin communication failures.
- **Rationale & Alternatives Considered:**
  - *Why this choice:* Standard security practice to prevent wildcard `*` with credentials while enabling local frontend development.
  - *Rejected alternatives:* Disabling CORS check or using wildcard origin.
- **Code References:**
  - `backend/app.ts#L14-L24` - CORS middleware declaration and allowed origins setup.
- **Git Commit:** `b86a02c`

#### [2026-11-19] Backend: Product Service Layer Extraction & Pagination Utility
- **Actor:** Worker AI & Human Router
- **Context & What Was Achieved:**
  - Extracted database operations out of `product.controller.ts` into a dedicated `ProductService` class (`product.service.ts`).
  - Created reusable pagination utility in `pagination.ts` enforcing default/max limits and `.lean()` queries.
  - Eliminated redundant double-parsing: `parsePagination` executes once at the controller HTTP boundary and passes typed `PaginationParams` directly to the service.
  - Verified with Postman CLI: all 6 CRUD requests and 18 assertions passed cleanly.
- **Decision:**
  Enforce 4-layer separation (Route -> Controller -> Service -> Model) per `MODERN_PRACTICES.md`. Controllers only parse HTTP requests and return standard envelopes.
- **Rationale & Alternatives Considered:**
  - *Why this choice:* Isolates business and data access logic for testability, reusability, and clean separation of concerns.
  - *Rejected alternatives:* Keeping queries in controller methods; parsing pagination parameters redundantly in both layers.
- **Code References:**
  - `backend/src/services/product.service.ts#L16-L98` - `ProductService` methods for CRUD with `.lean()` and `PaginationParams`.
  - `backend/src/controllers/product.controller.ts#L6-L101` - DRY controller methods using `productService`, `getProductId`, and single-pass `parsePagination`.
  - `backend/src/utils/pagination.ts#L22-L43` - `parsePagination` and `buildPaginationMeta`.
- **Git Commit:** `e8e1aa7`

#### [2026-11-19] Backend: Authentication Service Layer Extraction
- **Actor:** Worker AI & Human Router
- **Context & What Was Achieved:**
  - Extracted authentication logic out of `auth.controller.ts` into a dedicated `AuthService` class (`auth.service.ts`).
  - Encapsulated user querying, password hashing with bcrypt, ID auto-increment, JWT generation, and password sanitization within `AuthService`.
  - Refactored `auth.controller.ts` to focus purely on request parsing, validation, and standard HTTP responses.
  - Verified with Postman CLI: `Sign up` and `Login` passed all 6 assertions.
- **Decision:**
  Enforce 4-layer architecture by isolating authentication concerns into a dedicated service.
- **Rationale & Alternatives Considered:**
  - *Why this choice:* Prevents leaking password hashes, centralizes JWT configuration and token expiration, simplifies controller methods, and improves testability.
  - *Rejected alternatives:* Keeping user queries, bcrypt hashing, and JWT signing inside controller methods.
- **Code References:**
  - `backend/src/services/auth.service.ts#L29-L135` - `AuthService` methods for `signUp`, `login`, and private helpers (`generateToken`, `sanitizeUser`).
  - `backend/src/controllers/auth.controller.ts#L6-L49` - Refactored controller handlers delegating to `authService`.
- **Git Commit:** `0620db2`

#### [2026-11-19] Architecture: Transition to Flow-Driven Vertical Slices & API Inventory Audit
- **Actor:** Helper AI & Human Router
- **Context & What Was Achieved:**
  - Audited full API requirements against `PROJECT_DESCRIPTION.md`, mapping the 17-endpoint REST surface.
  - Identified critical access bug in `backend/src/routes/product.routes.ts`: `GET /api/products` and `GET /:id` were blocked by blanket `authMiddleware`, preventing guest visitors from viewing the catalog.
  - Redesigned project roadmap from horizontal layers into 5 end-to-end Vertical Feature Flows.
- **Decision:**
  Adopt vertical slice engineering where each milestone delivers a complete, testable user flow (Contracts $\rightarrow$ API $\rightarrow$ Angular UI $\rightarrow$ Test) rather than building all backend first and frontend later.
- **Rationale & Alternatives Considered:**
  - *Why this choice:* Prevents architectural drift, allows early verification of contracts against real UI needs, and enforces high-ownership learning.
  - *Rejected alternatives:* Horizontal siloed development (building all backend endpoints in isolation without frontend verification).
- **Code References:**
  - `docs/workflow/MILESTONES.md#L1-L120` - 5 flow-driven vertical milestones.
  - `docs/workflow/PROGRESS.md#L1-L150` - Task checklist and dependency graph.
  - `backend/src/routes/product.routes.ts#L15` - Target route requiring removal of blanket `authMiddleware`.
- **Git Commit:** Pending.

#### [2026-11-19] Backend: Unblock Public Product Catalog Routes
- **Actor:** Worker AI & Human Router
- **Context & What Was Achieved:**
  - Removed blanket `productRouter.use(authMiddleware)` that blocked guest users from accessing `GET /api/products` and `GET /api/products/:id`.
  - Scoped `authMiddleware` directly to mutating endpoints (`POST /`, `PUT /:id`, `PATCH /:id`, `DELETE /:id`).
  - Verified: unauthenticated requests to list/get products succeed (HTTP 200), unauthenticated mutating requests are rejected (HTTP 401), and all 18 Postman test assertions pass.
- **Decision:**
  Allow public read access to product catalog routes while preserving strict authentication on mutating administrative operations.
- **Rationale & Alternatives Considered:**
  - *Why this choice:* Enables guest visitors to browse products and see real-time inventory before logging in, as required by the e-commerce user story.
  - *Rejected alternatives:* Requiring user login for basic catalog browsing.
- **Code References:**
  - `backend/src/routes/product.routes.ts#L14-L21` - Public read routes and protected mutating routes.
- **Git Commit:** `3d1d8c9`

#### [2026-11-19] Shared: Establish Single-Source-of-Truth Contracts & DTOs
- **Actor:** Helper AI & Human Router
- **Context & What Was Achieved:**
  - Created domain types and network contracts in `shared/src/types/` derived directly from `docs/API_CONTRACTS.md`.
  - Defined strict TypeScript interfaces with `readonly` properties and zero `any` for API envelopes (`ApiResponse<T>`, `PaginationMeta`), Products (`ProductDto`, `StockStatus`), Auth (`LoginDto`, `SignupDto`, `AuthResponseDto`), Users (`UserResponseDto`), and Cart (`AddToCartDto`, `UpdateCartItemDto`, `CartItemDto`, `CartSummaryDto`).
  - Added centralized barrel export in `shared/src/index.ts`.
  - Configured `@shared` and `@shared/*` path aliases in `backend/tsconfig.json`.
- **Decision:**
  Colocate shared types in `shared/src/` to guarantee that frontend and backend communicate using identical compile-time data structures, preventing payload drift.
- **Rationale & Alternatives Considered:**
  - *Why this choice:* Eliminates duplicate interface definitions across frontend and backend; enables compile-time type verification across the full stack.
  - *Rejected alternatives:* Maintaining independent, duplicate types in frontend and backend.
- **Code References:**
  - `shared/src/types/api.types.ts#L1-L20` - Response envelopes and pagination metadata.
  - `shared/src/types/product.types.ts#L1-L32` - `ProductDto`, `StockStatus`, and query params.
  - `shared/src/types/auth.types.ts#L1-L26` - Login, signup, and auth token DTOs.
  - `shared/src/types/cart.types.ts#L1-L26` - Cart items, cart summaries, and quantity update DTOs.
  - `shared/src/index.ts#L1-L37` - Unified barrel export.
  - `backend/tsconfig.json#L11-L14` - Backend `@shared/*` compiler path mappings.
- **Git Commit:** `3d1d8c9`

#### [2026-11-19] Backend: Model Type Separation & @shared DTO Consumption
- **Actor:** Worker AI & Human Router
- **Context & What Was Achieved:**
  - Renamed internal database types: `ProductType` $\rightarrow$ `ProductModelType` in `backend/src/types/product.type.ts` and `UserType` $\rightarrow$ `UserModelType` in `backend/src/types/user.type.ts`.
  - Updated Mongoose schemas and models in `backend/src/models/product.model.ts` and `backend/src/models/user.model.ts` to use `ProductModelType` and `UserModelType`.
  - Refactored `backend/src/services/product.service.ts` and `backend/src/utils/pagination.ts` to consume `ProductDto` and `PaginationMeta` directly from `@shared`.
  - Refactored `backend/src/services/auth.service.ts` to use `UserModelType` for internal database queries and return `@shared` DTOs (`UserResponseDto`, `AuthResponseDto`).
  - Verified backend compilation (`npm run typecheck`: 0 errors), frontend build (`npm run build`: 0 errors), and Postman test suites (6/6 Auth, 18/18 Products passing).
- **Decision:**
  Establish a strict compile-time boundary between internal MongoDB persistence models and external network contracts defined in `@shared`.
- **Rationale & Alternatives Considered:**
  - *Why this choice:* Prevents database schema changes from unintentionally breaking API responses or leaking database internals; guarantees full-stack type adherence to `@shared`.
  - *Rejected alternatives:* Reusing Mongoose model types as API response types or duplicating DTOs locally in the backend.
- **Code References:**
  - `backend/src/types/product.type.ts#L1-L13` - `ProductModelType`.
  - `backend/src/types/user.type.ts#L14-L27` - `UserModelType`.
  - `backend/src/models/product.model.ts#L2-L4` - `productSchema` and `Product` model using `ProductModelType`.
  - `backend/src/models/user.model.ts#L2-L104` - `userSchema` and `User` model using `UserModelType`.
  - `backend/src/services/product.service.ts#L1-L28` - Consumes `ProductDto` and `PaginationMeta` from `@shared`.
  - `backend/src/services/auth.service.ts#L4-L13` - Consumes `AuthResponseDto` and `UserResponseDto` from `@shared`.
  - `backend/src/utils/pagination.ts#L1-L5` - Re-exports `PaginationMeta` from `@shared`.
- **Git Commit:** `3d1d8c9`

---

### Phase 2: Flow 1 — Public Catalog Browsing & Real-Time Stock
*(Fill upon executing Milestone 2 tasks)*

---

### Phase 3: Flow 2 — Authentication, Session Restore & Guest Interception
*(Fill upon executing Milestone 3 tasks)*

---

### Phase 4: Flow 3 & 4 — Shopping Cart & Atomic Inventory Sync
*(Fill upon executing Milestone 4 tasks)*

---

### Phase 5: Flow 5 — Adversarial Testing, Performance & Production Polish
*(Fill upon executing Milestone 5 tasks)*
