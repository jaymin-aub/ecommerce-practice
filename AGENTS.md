# AGENTS.md

Instructions, constraints, and operating standards for all AI agents working in this repository.

---

## 1. Project Overview & Architecture

This repository contains a full-stack e-commerce application designed with modern engineering practices:

- **Frontend:** Angular 22 (Standalone components, Angular Signals, Tailwind CSS v4, Vitest).
- **Backend:** Node.js + Express 5 (ES Modules, TypeScript, Mongoose 9 / MongoDB).
- **Shared:** Shared types, models, and contracts in `shared/`.
- **Docs & Tracking:** Located in `docs/` and `docs/workflow/`.

---

## 2. Operating Model: The Human-Router Framework

You are operating inside a strict **Human-in-the-Loop / Human Router** architecture. You are assigned to one of two specialized roles by the developer. **Never break your assigned role boundaries:**

### Role A: Helper Agent (Terminal 1 - Architect / Spec)

- **Responsibility:** Requirements breakdown, edge-case discovery, and drafting interfaces/contracts in `shared/`.
- **Constraints:** Do NOT write application implementation code. Focus on types, schemas, and API contracts.

### Role B: Worker Agent (Terminal 2 - Implementer)

**Responsibility:** Implement isolated slices of code that strictly conform to approved contracts in `shared/` and tasks in `docs/workflow/PROGRESS.md`.

**Constraints:** Do NOT invent new contracts, do NOT make unapproved architectural decisions, and do NOT modify files outside your assigned task scope.

---

## 3. Mandatory Engineering Rules (Non-Negotiables)

All code produced by any agent must strictly comply with [docs/MODERN_PRACTICES.md](./docs/MODERN_PRACTICES.md):

### General TypeScript

- **Zero `any`:** Never use `any`. Use `unknown` with type narrowing if needed.
- **Strict Types:** Explicit function return types on all services, utilities, and controller methods.
- **Immutability:** Use `readonly` for immutable properties and arrays.
- **Contracts First:** Always reference or update shared types in `shared/` before writing backend or frontend implementations.

### Backend (Express & MongoDB)

- **4-Layer Architecture:** Route $\rightarrow$ Controller $\rightarrow$ Service $\rightarrow$ Model. Controllers must never query the database directly.
- **Atomic Concurrency for Inventory:** Never use read-modify-save (`find` + `save`) for inventory. Always use atomic MongoDB operators (`$inc: { stock: -1 }`) with condition guards (`{ stock: { $gt: 0 } }`).
- **Lean Reads:** Always use `.lean()` on read-only queries.
- **Centralized Errors:** Throw custom typed errors (`NotFoundError`, `BadRequestError`, etc.); never swallow errors or send manual 500 status codes.

### Frontend (Angular)

- **Standalone Only:** Every component, directive, and pipe must be standalone.
- **Signals for State:** Use `signal()`, `computed()`, `input()`, and `output()`. No legacy `@Input()` or `@Output()`.
- **Modern Control Flow:** Use `@if`, `@else`, `@switch`, and `@for (...; track ...)`. Never use `*ngIf` or `*ngFor`.
- **No Logic in Templates:** Templates only render values or trigger handler functions. Never invoke functions directly in template bindings (`{{ func() }}`).
- **Reactive Forms:** Use `NonNullableFormBuilder` with validation feedback for all non-trivial forms.

---

## 4. Context & Knowledge Bus

Agents share state asynchronously through documentation files, not bloated chat transcripts:

1. **[docs/API_CONTRACTS.md](./docs/API_CONTRACTS.md):** The single source of truth for all network contracts, request/response DTOs, status codes, and concurrency invariants.
2. **[docs/workflow/MILESTONES.md](./docs/workflow/MILESTONES.md):** The roadmap of major phases and challenges.
3. **[docs/workflow/PROGRESS.md](./docs/workflow/PROGRESS.md):** The detailed task checklist and dependency sequence. Check this before writing code.
4. **[docs/workflow/LOGS.md](./docs/workflow/LOGS.md):** Whenever you make an architectural decision or complete a milestone task, draft an entry here with file references (`file.ts#L10-L20`) and rationale.
5. **[docs/GAPS.md](./docs/GAPS.md):** Learning ledger of concepts actively being mastered (Forms, Testing, Angular Optimization, Node Testing). **Mandatory:** Whenever a task touches these areas, pause and ask the developer to decide on the approach so they own the learning.
6. **[docs/ENGINEERING_WITH_AI_GUIDE.md](./docs/ENGINEERING_WITH_AI_GUIDE.md):** The 6-step engineering framework to follow for every slice.

---

## 5. Development Cheatsheet

### Backend Commands

```bash
cd backend
npm run dev        # Run server with watch mode (http://localhost:3000)
npm run seed       # Seed MongoDB with sample products and users
npm run typecheck  # Run TypeScript compiler check
```

### Frontend Commands

```bash
cd frontend
npm start          # Run Angular dev server (http://localhost:4200)
npm run build      # Build production bundle
npm test           # Run unit tests via Vitest
```

---

## 6. Output & Response Guidelines for Agents

- Keep responses concise, direct, and actionable.
- Link all referenced files using markdown links with file paths and line ranges.
- When generating code, provide complete, drop-in replacement snippets rather than vague pseudocode.
- Always check that your solution does not introduce regressions or TypeScript errors.
