# Active Execution & Progress Tracking (`PROGRESS.md`)

This document tracks the **active milestone's in-depth, step-by-step execution path**. 

> **Operating Invariant (Human Router Gate):**  
> 1. This file contains **only the current active milestone** to maintain laser focus and prevent speculative drift.
> 2. High-level roadmap and future flows remain in [MILESTONES.md](./MILESTONES.md).
> 3. Detailed checklists for future milestones are created **only upon explicit command from the developer**.

---

## Active Milestone: Milestone 1 — Spec Foundation, API Contracts & Shared DTOs

### 1. Human Gatekeeping & Sign-Off
- [x] Initial repository baseline committed and verified.
- [x] MongoDB connectivity and seed verified (30 products, 30 users).
- [x] 17-endpoint REST API inventory mapped and approved.
- [x] Public route access bug fix approved and applied (`GET /api/products`).
- [x] Shared contract structure approved and created in `shared/`.

---

### 2. Dependency Order
```
1. Baseline Setup & Seed (Completed)
   │
   ▼
2. Unblock Public Routes [Task-1.4] (Completed)
   │
   ▼
3. Draft Shared Contracts in shared/ [Task-1.5] (Completed)
   │
   ▼
4. Configure Path Aliasing & Verify [Task-1.6] (Completed)
```

---

### 3. Detailed Step-by-Step Task Checklist

#### `[Task-1.1]` Git Baseline Commit
- **Owner:** Human Router
- **Scope:** Stage existing baseline files and establish clean git history.
- **Status:** Completed (Commit `8e7c3f2`)

#### `[Task-1.2]` Database Verification & Seeding
- **Owner:** Worker Agent (Terminal 2)
- **Target Files:** `backend/.env`, `backend/src/scripts/seed.ts`
- **Scope:** Verify MongoDB local connection and execute seeder.
- **Status:** Completed (30 products and 30 users seeded successfully)

#### `[Task-1.3]` Backend CORS Configuration
- **Owner:** Worker Agent (Terminal 2)
- **Target Files:** `backend/app.ts`, `backend/package.json`
- **Scope:** Install `cors` package and whitelist Angular origin (`http://localhost:4200`, `http://127.0.0.1:4200`).
- **Status:** Completed (Commit `b86a02c`)

#### `[Task-1.4]` Unblock Public Access for Product Catalog Routes
- **Owner:** Worker Agent (Terminal 2)
- **Target Files:** `backend/src/routes/product.routes.ts`
- **Scope:** 
  - Remove blanket `productRouter.use(authMiddleware)` that blocks all product routes.
  - Keep `GET /` (list products) and `GET /:id` (get single product) **public** so guest visitors can browse.
  - Apply `authMiddleware` specifically to mutating routes (`POST /`, `PUT /:id`, `PATCH /:id`, `DELETE /:id`).
- **Status:** Completed

#### `[Task-1.5]` Draft Single-Source-of-Truth Contracts & DTOs in `shared/`
- **Owner:** Helper Agent (Terminal 1)
- **Target Files:**
  - `shared/src/types/api.types.ts` — `ApiResponse<T>`, `PaginationMeta`, `ApiErrorResponse`
  - `shared/src/types/product.types.ts` — `ProductDto`, `StockStatus`
  - `shared/src/types/auth.types.ts` — `LoginDto`, `SignupDto`, `AuthResponseDto`
  - `shared/src/types/user.types.ts` — `UserResponseDto`, `Address`, `Company`
  - `shared/src/types/cart.types.ts` — `AddToCartDto`, `UpdateCartItemDto`, `CartItemDto`, `CartSummaryDto`
  - `shared/src/index.ts` — Barrel export for clean imports
- **Status:** Completed

#### `[Task-1.6]` Configure TypeScript Path Aliases (`@shared/*`)
- **Owner:** Worker Agent (Terminal 2)
- **Target Files:** `backend/tsconfig.json`, `frontend/tsconfig.json`, `frontend/tsconfig.app.json`
- **Scope:** Add compiler `paths` mapping `@shared` and `@shared/*` to `../shared/src/*` in both tsconfigs.
- **Status:** Completed

---

### 4. Verification & Audit Gate
- [x] `backend` compiles cleanly with zero TypeScript errors (`cd backend && npm run typecheck`).
- [x] `frontend` compiles cleanly with zero TypeScript errors (`cd frontend && npx tsc -p tsconfig.app.json --noEmit`).
- [x] All architectural decisions logged in [LOGS.md](./LOGS.md).

---

## Upcoming Milestones (Outline Only)

Detailed execution plans for upcoming milestones will be generated in this document **only when commanded by the developer**:

- **Milestone 2:** Flow 1 — Public Catalog Browsing & Real-Time Stock (End-to-End)
- **Milestone 3:** Flow 2 — Authentication, Session Restore & Guest Interception (End-to-End)
- **Milestone 4:** Flow 3 & 4 — Shopping Cart & Atomic Inventory Sync (End-to-End)
- **Milestone 5:** Flow 5 — Adversarial Testing, Performance & Production Polish

*(Refer to [MILESTONES.md](./MILESTONES.md) for full descriptions, user stories, and acceptance criteria).*
