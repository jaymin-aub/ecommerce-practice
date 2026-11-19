# GAPS.md - Engineering Learning Ledger & Deliberate Practice

This document tracks technical areas and concepts that are actively being learned and explored. 

---

## 1. Operating Mindset & Core Rule for AI Agents

> **Engineer Persona:**  
> The developer is operating as a **junior-to-mid software engineer** who intentionally wants to build deep mastery, understand the mechanics of every single layer, and **own up to every decision** made in this repository.

### Mandatory Directive for All AI Agents (Helper, Worker):
- **Never auto-generate black-box solutions** for items listed in this document.
- **Always ask and consult the developer** whenever a task touches any topic listed below before choosing or writing code:
  - Ask: *"This feature touches [Topic from GAPS.md]. Would you like to implement this using [Approach A] or [Approach B], and shall we walk through how it works?"*
  - Give the developer the opportunity to make the deliberate architectural choice and write or inspect the critical parts.
- Whenever an implementation touches one of these gaps, ensure edge cases, error handling, and performance impacts are thoroughly interrogated.

---

## 2. Angular Knowledge Gaps

### 6. Forms
- [ ] **Template-Driven Forms:** Two-way binding, ngForm, ngModel, form directives, appropriate use cases.
- [ ] **Reactive Forms:** Structure, explicit controls, non-nullable builders.
- [ ] **FormControl, FormGroup, FormArray:** Granular control composition and dynamic list handling.
- [ ] **FormBuilder:** `NonNullableFormBuilder` vs traditional FormBuilder.
- [ ] **Form Validation:**
  - [ ] Built-in validators (`required`, `email`, `min`, `max`, `pattern`).
  - [ ] Custom synchronous validators.
  - [ ] Cross-field validation (e.g., password matching, date ranges).
  - [ ] Async validators (e.g., server-side uniqueness checks).
- [ ] **Dynamic Forms:** Generating form structures dynamically from schema/metadata.
- [ ] **Form Submission:** Handling submit events, dirty/touched state tracking, reset mechanics.
- [ ] **Handling Form Errors:** Accessible error messages, validation feedback timing (`touched` vs `dirty`).
- [ ] **ControlValueAccessor (CVA):** Integrating custom UI components into Angular Forms.
- [ ] **Custom Form Controls:** Designing reusable, accessible custom form inputs.

---

### 11. Testing (Angular)
- [ ] **Unit Testing Components:** Isolated component testing without DOM, testing component methods and signals.
- [ ] **Testing Services:** Mocking HTTP calls, testing state mutations in Signals.
- [ ] **Testing Pipes & Directives:** Pure function verification and DOM behavior testing.
- [ ] **Testing Component Inputs and Outputs:** Verifying signal inputs (`input()`) and outputs (`output()`).
- [ ] **Testing HTTP Requests:** Using `HttpTestingController` to assert endpoint URLs, HTTP verbs, and mock response payloads.
- [ ] **Mocking Services:** Spy objects, partial mocks, test doubles.
- [ ] **Component Fixtures & TestBed:** Configuring `TestBed`, change detection triggers (`fixture.detectChanges()`), query predicates.
- [ ] **Integration Testing:** Multi-component orchestration and router integration tests.
- [ ] **End-to-End Testing (E2E):** Real-browser flows using Playwright or Cypress.

---

### 12. Angular Performance & Optimization
- [ ] **Lazy Loading:** Route-level `loadComponent` and `loadChildren`.
- [ ] **OnPush Change Detection:** Understanding zoneless change detection and OnPush semantics.
- [ ] **Signals for Reactive State:** Fine-grained reactivity, computed signals without side effects, untracked reads.
- [ ] **Track Expressions in `@for`:** Avoiding DOM churn with unique identifiers (`track item.id`).
- [ ] **`@defer` Blocks:** View deferment triggers (`on viewport`, `on idle`, `on interaction`, prefetching).
- [ ] **Bundle Optimization & Tree Shaking:** Analyzing bundle composition, eliminating unused modules.
- [ ] **Code Splitting:** Splitting large vendor packages or optional feature routes.
- [ ] **Avoiding Unnecessary Subscriptions:** Preventing RxJS leaks, converting to Signals via `toSignal()`.
- [ ] **Memory Leak Prevention:** Disposing intervals, event listeners, and manual subscriptions.
- [ ] **Image Optimization:** Modern formats, responsive sizing, `NgOptimizedImage`.
- [ ] **Angular DevTools:** Profiling component trees, flame charts, and change detection cycles.
- [ ] **Production Builds:** Ahead-of-Time (AOT) compilation, minification, and caching strategies.

---

## 3. Node.js & Backend Knowledge Gaps

### 14. Testing (Backend)
- [ ] **Unit Testing:** Isolated testing of pure utility functions and business services.
- [ ] **Integration Testing:** Testing Route $\rightarrow$ Controller $\rightarrow$ Service $\rightarrow$ Database flow together.
- [ ] **API Testing:** End-to-end HTTP request testing using Supertest.
- [ ] **Test Runners & Frameworks:** Hands-on comparison and usage of Vitest vs. Jest vs. Mocha & Chai.
- [ ] **Mocking Dependencies:** Mocking third-party APIs, email senders, and JWT signing.
- [ ] **Testing Middleware:** Testing auth guards, request validators, and global error handlers.
- [ ] **Testing Controllers:** Validating HTTP status codes, response envelope format, and headers.
- [ ] **Testing Services:** Verifying business calculations, stock decrement rules, and error throwing.
- [ ] **Testing Authentication:** JWT token generation, expired token rejections, role-based authorization checks.
- [ ] **Database Testing:** In-memory MongoDB testing (`mongodb-memory-server`) or isolated test databases, verifying atomic operations.
- [ ] **Test Coverage:** Generating and interpreting coverage reports (lines, branches, functions).

---

## 4. Learning Log & Practice Check-Ins

| Date | Topic Practiced | Files / Implementation Reference | Notes & Key Takeaways |
| :--- | :--- | :--- | :--- |
| 2026-11-19 | Backend Service Layer & Postman API Testing | `backend/src/services/product.service.ts`, `backend/src/controllers/product.controller.ts`, `backend/src/utils/pagination.ts` | Decoupled Mongoose database operations into `ProductService`; created reusable pagination utility (`parsePagination`, `buildPaginationMeta`); applied DRY helper `getProductId` and single-pass `PaginationParams` across controller and service; verified all 6 CRUD operations and auth via Postman CLI (18/18 assertions passed). |
