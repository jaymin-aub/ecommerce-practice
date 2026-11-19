# Engineering with AI Guide

A practical, step-by-step checklist and operating model for delivering robust, production-grade software with AI assistance.

---

## 1. Core Principles
- **Total Ownership:** AI drafts code; you sign off and own every character committed.
- **No Vibe Coding:** Never commit code you cannot whiteboard, explain line-by-line, or debug from first principles.
- **AI as a Fast Junior Intern:** Treat AI outputs with healthy skepticism—audit for edge cases, race conditions, and security issues.
- **Value Over Volume:** Prioritize simplicity, testability, and business correctness over raw line count.

---

## 2. The 6-Step Development Framework

Follow this sequential process for every feature or task:

### Step 1: Decompose & Define Invariants (Zero AI Code)
- Read feature requirements ([PROJECT_DESCRIPTION.md](./PROJECT_DESCRIPTION.md)).
- Define **System Invariants** before writing prompts (e.g., *inventory stock cannot drop below zero*).
- Choose architectural boundaries and patterns (e.g., layered backend, standalone Angular components).

### Step 2: Establish Contracts & Schemas First
- Define TypeScript interfaces, database schemas, and API contracts upfront.
- Feed these contracts to the AI to strictly constrain implementation scope.

### Step 3: Constrained Micro-Prompting
- Avoid broad prompts (e.g., *"build the cart feature"*).
- Prompt one vertical slice or function at a time (e.g., `ProductService.decrementStock`).
- Attach explicit rules and guardrails from [MODERN_PRACTICES.md](./MODERN_PRACTICES.md) (strict types, no `any`, atomic transactions).

### Step 4: Line-by-Line Interrogation Gate
Before accepting generated code, pass it through 4 validation questions:
1. **Explainability:** *Can I explain every line and construct without referencing the prompt?*
2. **Failure Handling:** *How does this handle network failures, `null`/`undefined`, and boundary values?*
3. **Architecture:** *Does this comply with project standards (Signals, immutability, layered separation)?*
4. **Peer Defense:** *Could I defend this design and its trade-offs in a senior staff review?*

### Step 5: Adversarial Testing (Use AI to Break AI)
- Prompt AI to act as a senior security auditor or malicious tester to identify race conditions and flaws.
- Write unit and integration tests specifically targeting edge cases and concurrent operations.

### Step 6: Refactor & Consolidate
- Strip unused boilerplate, dead comments, and hallucinated helpers.
- Rename generic variables (`res`, `data`, `item`) to domain-rich terms (`cartSummary`, `productCatalog`).
- Verify build, linting, and tests pass cleanly.

---

## 3. Daily Feature Execution Checklist

Use this checklist for daily development:

1. [ ] **Spec:** Identify the user story, scope, and non-negotiables.
2. [ ] **Contract:** Write/update types and interfaces in `.types.ts`.
3. [ ] **Prompt:** Generate isolated implementation slices with explicit constraints.
4. [ ] **Audit:** Inspect the diff line-by-line using the 4 interrogation questions.
5. [ ] **Test:** Add adversarial unit/integration tests for edge cases and concurrency.
6. [ ] **Commit:** Commit with clear, intention-revealing messages.

---

## 4. Code Quality & Security Checklist

Verify these criteria before opening a PR or merging:

- [ ] **Concurrency & Atomicity:** Database mutations use atomic operations or transactions (prevents race conditions).
- [ ] **Type Safety:** Strict typing throughout (`noImplicitAny`), explicit return types, no type assertions (`as any`).
- [ ] **Error Resilience:** Typed error returns/results instead of swallowed errors or unhandled rejections.
- [ ] **Reactivity:** Angular state managed via Signals (`signal`, `computed`, `input`), zero memory leaks.
- [ ] **Security:** Input validation at boundaries, parameterized DB queries, proper authorization checks.
- [ ] **Maintainability:** Code is modular, clean, and easily understood by another engineer.
