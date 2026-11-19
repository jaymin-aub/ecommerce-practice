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
- **Git Commit:** Pending next commit.

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
- **Git Commit:** Pending next commit.

---

### Phase 2: Backend Architecture & Cart Core
*(Fill upon executing Milestone 2 tasks)*

---

### Phase 3: Frontend Foundations & Shell
*(Fill upon executing Milestone 3 tasks)*

---

### Phase 4: Product Catalog & Real-Time Stock
*(Fill upon executing Milestone 4 tasks)*

---

### Phase 5: Authentication & Session Management
*(Fill upon executing Milestone 5 tasks)*

---

### Phase 6: Cart Panel & Full Checkout Experience
*(Fill upon executing Milestone 6 tasks)*
