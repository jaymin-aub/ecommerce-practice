# Project Execution & Progress Tracking

This document contains the step-by-step checklist and dependency path for each milestone defined in [MILESTONES.md](./MILESTONES.md).

> **Important Rule (Human Router Gate):**  
> Every task sequence and checklist below must undergo **complete human review and sign-off** before being dispatched to any AI worker terminal.

---

## Milestone Execution Template

```markdown
## Milestone [X]: [Milestone Title]

### 1. Human Gatekeeping & Sign-Off
- [ ] Requirements and invariants verified by Human Router.
- [ ] Dependency sequence approved before dispatching prompts.
- [ ] Target file boundaries agreed upon (zero cross-file collisions).

### 2. Dependency Order
1. **Prerequisite:** [What must be completed and committed before this step begins]
2. **Step A:** [First task to execute]
3. **Step B:** [Depends on Step A]
4. **Step C:** [Depends on Step B]

### 3. Detailed Task Checklist
- [ ] `[Task-X.1]` **[Task Title]**
  - **Owner / Target:** [Terminal 1 (Helper) / Terminal 2 (Worker)]
  - **Target Files:** `path/to/file.ts`
  - **Inputs / Contracts:** [Refer to shared types or spec]
  - **Acceptance Criteria:** [Explicit definition of done]
  - **Status:** Pending / In Progress / Completed
- [ ] `[Task-X.2]` ...

### 4. Verification & Audit Gate
- [ ] Code compiles cleanly (`npm run typecheck`).
- [ ] Adversarial checks and tests passed.
- [ ] Human review completed line-by-line.
- [ ] Decision logged in [LOGS.md](./LOGS.md) and committed to Git.
```

---

## Milestone 1: Baseline Setup & Shared Contracts

### 1. Human Gatekeeping & Sign-Off
- [ ] Human review of existing repository files and current uncommitted diff.
- [ ] Verification of local Node.js and MongoDB environment configuration.
- [ ] Approval of shared contract strategy.

### 2. Dependency Order
```
1. Git Baseline Commit ──▶ 2. DB Connectivity & Seed ──▶ 3. CORS & App Config ──▶ 4. Shared Types Definition
```

### 3. Detailed Task Checklist
- [x] `[Task-1.1]` **Git Baseline Commit**
  - **Owner:** Human
  - **Action:** Stage existing untracked files and commit clean initial baseline.
  - **Status:** Completed (Commit `8e7c3f2`)
- [x] `[Task-1.2]` **Database Verification & Seeding**
  - **Owner:** Terminal 2 (Worker)
  - **Target Files:** `backend/.env`, `backend/src/scripts/seed.ts`
  - **Action:** Verify MongoDB connection and run `npm run seed`.
  - **Status:** Completed (30 products and 30 users seeded successfully)
- [x] `[Task-1.3]` **Backend CORS & Security Middleware**
  - **Owner:** Terminal 2 (Worker)
  - **Target Files:** `backend/app.ts`, `backend/package.json`
  - **Action:** Install and configure `cors` with client origins `localhost:4200`.
  - **Status:** Completed
- [ ] `[Task-1.4]` **Define Shared Contracts in `shared/`**
  - **Owner:** Terminal 1 (Helper)
  - **Target Files:** `shared/src/types/`
  - **Action:** Draft TypeScript interfaces for User, Product, Cart, and API envelope.
  - **Status:** Pending
- [ ] `[Task-1.5]` **TypeScript Path Aliasing**
  - **Owner:** Terminal 2 (Worker)
  - **Target Files:** `backend/tsconfig.json`, `frontend/tsconfig.json`
  - **Action:** Configure `@shared/*` alias for seamless imports.
  - **Status:** Pending

### 4. Verification & Audit Gate
- [x] `backend` typecheck passes with zero errors.
- [ ] `frontend` builds cleanly with shared alias.
- [x] Decisions logged in [LOGS.md](./LOGS.md).

---

## Milestone 2: Backend Architecture & Cart Core
*(Detailed dependencies and checklist to be refined by Human Router prior to kickoff)*

### 1. Human Gatekeeping & Sign-Off
- [ ] Cart data schema reviewed (embedded array vs. standalone collection).
- [ ] Concurrency and stock decrement invariants approved.

### 2. Dependency Order
```
1. Service Layer Refactor ──▶ 2. Cart Model Creation ──▶ 3. Atomic Cart Service ──▶ 4. Cart Routes & Audit
```

### 3. Detailed Task Checklist
- [ ] `[Task-2.1]` **Service Layer Extraction for Products & Auth**
  - **Owner:** Terminal 2 (Worker)
  - **Target Files:** `backend/src/services/product.service.ts`, `backend/src/controllers/product.controller.ts`, `backend/src/utils/pagination.ts`
  - **Action:** Extract Mongoose queries out of controllers into dedicated services. Create reusable pagination utility.
  - **Status:** In Progress (ProductService & pagination utility completed; AuthService pending)
- [ ] `[Task-2.2]` **Cart Schema & Model Implementation**
- [ ] `[Task-2.3]` **Atomic Stock Decrement / Increment Service Methods**
- [ ] `[Task-2.4]` **Cart Controller & Route Endpoints**
- [ ] `[Task-2.5]` **Adversarial Audit: Concurrency & Stock Boundary Testing**

---

## Milestone 3: Frontend Foundations & Shell
*(To be detailed upon completion of Milestone 2)*

---

## Milestone 4: Product Catalog & Real-Time Stock
*(To be detailed upon completion of Milestone 3)*

---

## Milestone 5: Authentication & Session Management
*(To be detailed upon completion of Milestone 4)*

---

## Milestone 6: Cart Panel & Full Checkout Experience
*(To be detailed upon completion of Milestone 5)*
