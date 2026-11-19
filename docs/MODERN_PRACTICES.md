# Modern Industry Practices & Coding Standards

A comprehensive rulebook of micro-rules and conventions to follow when writing full-stack code with **Angular**, **Node.js / Express**, and **TypeScript**.

---

## 1. General TypeScript & Code Hygiene Rules

### Typing & Variables
* **No `any`:** Never use `any`. Use `unknown` if the type is truly uncertain, followed by type narrowing or type guards.
* **Strict Null Checks:** Enable and follow strict null checks. Handle `null` and `undefined` explicitly.
* **Explicit Function Return Types:** Always define explicit return types for service methods, utility functions, and public controller methods.
* **Type vs Interface:** 
  * Use `interface` for object structures, database models, and service contracts.
  * Use `type` for unions, intersections, primitives, and mapped types.
* **Immutability:** Use `readonly` for class properties that should not change after instantiation, and `Readonly<T>` or `readonly T[]` for immutable arrays.
* **Variable Declarations:** Use `const` by default. Use `let` only when variable reassignment is required. Never use `var`.
* **Safe Access:** Always use optional chaining (`?.`) and nullish coalescing (`??`) instead of loose OR (`||`) for falsy checks.
* **Type Imports:** Always use `import type { ... }` when importing only interfaces or types to optimize bundling and eliminate circular dependency issues.

### Constants & Magic Values
* **No Magic Strings or Numbers:** Never hardcode raw values (e.g., status codes, timeouts, roles, discount rates) inside business logic.
* **Centralized Constants:** Place constants in dedicated files using `as const` objects or Enums.

### Naming Conventions
* **Files & Folders:** `kebab-case` with role suffixes (e.g., `product-card.component.ts`, `cart.service.ts`, `auth.controller.ts`, `user.model.ts`).
* **Classes & Interfaces:** `PascalCase` (e.g., `ProductService`, `UserPayload`).
* **Methods & Variables:** `camelCase` (e.g., `fetchProductById`, `totalPrice`).
* **Constants & Enums:** `UPPER_SNAKE_CASE` (e.g., `MAX_RETRY_COUNT`, `DEFAULT_PAGE_SIZE`).
* **Booleans:** Prefix with `is`, `has`, `can`, or `should` (e.g., `isLoading`, `hasStock`, `isLoggedIn`).

---

## 2. Angular Rules (Frontend)

### Architecture & Components
* **Standalone Architecture:** Every component, directive, and pipe must be `standalone: true`. Do not use `NgModule`.
* **Single Responsibility:** Keep components focused on a single UI responsibility. If a component exceeds 250 lines, split it into child/presentational components.
* **Smart vs Dumb Pattern:**
  * **Smart (Container) Components:** Handle routing, inject services, manage state signals, and pass data down.
  * **Dumb (Presentational) Components:** Only accept inputs via `input()`, emit actions via `output()`, and contain zero HTTP or routing logic.
* **Encapsulation:** Never disable `ViewEncapsulation` unless explicitly needed for global third-party library styling. Avoid `::ng-deep`.

### Reactivity & Signals
* **Signals for UI State:** Manage all component-level reactive state using `signal()`.
* **Immutable Signal Updates:** Never mutate signal values directly. Use `.set()` for replacement and `.update(val => ...)` for state derived from current value.
* **Computed Values:** Use `computed()` for derived calculations (e.g., totals, filtered lists). `computed()` must be pure and must never trigger side effects.
* **Effects are for Side Effects Only:** Use `effect()` strictly for logging, analytics, or syncing with external browser APIs (e.g., LocalStorage).
* **Expose Readonly Signals:** In services, keep state signals private (`#state = signal(...)`) and expose them publicly using `.asReadonly()`.

### Template & Control Flow Rules
* **Modern Control Flow:** Use native `@if`, `@else if`, `@else`, `@switch`, `@case`, and `@for`. Do not use `*ngIf` or `*ngFor`.
* **Mandatory Track Expression:** Every `@for` loop must include a unique `track` expression (e.g., `track item.id`). Never track by array reference if unique IDs exist.
* **Always Handle Empty States:** Pair `@for` loops with an `@empty` block to display fallback UI when lists are empty.
* **No Logic in Templates:** Templates must only display values or invoke handler methods. Do not write complex ternary operations, arithmetic, or filter logic directly inside HTML.
* **No Function Calls in Templates:** Never invoke methods directly in string interpolation or bindings (e.g., `{{ calculateTax() }}`), as they re-execute on every change detection cycle. Use `computed()` signals or custom pipes instead.

### Dependency Injection & Services
* **Modern Injection:** Use the `inject()` function at the property level instead of constructor parameter injection.
* **Root Services:** Use `@Injectable({ providedIn: 'root' })` for singleton services.
* **No Direct HTTP in Components:** Components must never call `HttpClient` directly; all API calls must be wrapped inside dedicated service methods.

### Component Inputs & Outputs
* **Signal Inputs:** Use `input()` and `input.required()` instead of `@Input()` decorators.
* **Modern Outputs:** Use `output()` instead of `@Output() new EventEmitter()`.
* **Read-Only Inputs:** A child component must never mutate an input signal received from a parent.

### Forms
* **Reactive Forms Only:** Use Reactive Forms with `NonNullableFormBuilder`. Do not use Template-Driven Forms (`[(ngModel)]`) for non-trivial inputs.
* **Form Validation State:** Always disable submission buttons and show contextual error messages when forms are `invalid` and `touched` or `dirty`.

### Routing & Navigation
* **Lazy Loading:** All routes must be lazy-loaded using `loadComponent` or `loadChildren`.
* **Functional Route Guards:** Write route guards as pure functions using `CanActivateFn`.

### HTTP & Interceptors
* **Functional Interceptors:** Use `HttpInterceptorFn` for attaching authorization headers, handling global errors, and logging.
* **Data Mapping:** Always type and map HTTP responses inside the service before passing them to components.

---

## 3. Node.js & Express Rules (Backend)

### Architecture & Layer Boundaries
* **Strict 4-Layer Separation:**
  1. **Route Layer:** Defines endpoints, HTTP verbs, and attaches middleware.
  2. **Controller Layer:** Extracts `req.params`, `req.query`, and `req.body`, calls services, and formats the HTTP response. No database queries or business logic here.
  3. **Service Layer:** Houses all business rules, calculations, and database calls. Services must never touch `req` or `res` objects.
  4. **Model Layer:** Mongoose schemas, field validations, hooks, and database indexes.
* **Native ES Modules:** Use `"type": "module"` in `package.json` and standard `import` / `export` statements.

### Error Handling
* **Custom Error Classes:** Create and throw typed application errors extending `Error` (e.g., `BadRequestError`, `UnauthorizedError`, `NotFoundError`, `ConflictError`).
* **Centralized Error Middleware:** Catch and format all errors in a single global Express error-handling middleware `(err, req, res, next)`.
* **No Swallowing Errors:** Never write empty `catch (error) {}` blocks.
* **No Inline 500 Responses:** Controllers must throw errors or pass them to `next(error)`, never manually return `res.status(500)`.
* **Return Responses:** Always prefix response calls with `return` (e.g., `return res.status(...).json(...)`) to guarantee execution stops and prevent "headers already sent" crashes.

### Database Operations (Mongoose / MongoDB)
* **Atomic Updates for Inventory:** Never read a document into memory, modify the quantity, and save it back. Always use atomic MongoDB operators (e.g., `$inc: { stock: -1 }`) combined with condition checks (e.g., `{ stock: { $gt: 0 } }`) to prevent concurrency race conditions.
* **Use `.lean()` on Reads:** Always append `.lean()` to read-only queries (`find()`, `findOne()`, `findById()`) to bypass Mongoose document overhead and maximize speed.
* **Mandatory Pagination:** Never return unbounded query results (`find()`). Always enforce pagination parameters (`page`, `limit`, `skip`) with maximum limit caps.
* **Database Indexing:** Ensure every field used in searches, filters, sorting, or uniqueness (e.g., `email`, `slug`, `category`, `createdAt`) is indexed in the schema.
* **Explicit Schema Types:** Define Mongoose schemas with strict validations (`required`, `trim`, `min`, `max`, `enum`, `default`).

### Request Validation & Security
* **Validate Payloads Before Processing:** Validate all incoming `req.body`, `req.params`, and `req.query` inputs at the route or controller level before passing to services.
* **Strip Unknown Fields:** Never pass unvalidated `req.body` directly into database create or update methods.
* **Password Hashing:** Always hash passwords using `bcrypt` (with a cost factor $\ge 10$) before persisting to the database.
* **Hide Sensitive Fields:** Never return password hashes, internal flags, or authentication secrets in API responses (use `select: false` in schemas or strip them before sending).
* **JWT Expiration:** Always set an explicit expiration duration (`expiresIn`) on JWT tokens.
* **Security Headers:** Use `helmet()` middleware and configure explicit CORS origins (never allow wildcard `*` with credentials).
* **Environment Variables:** Validate all critical environment variables (`PORT`, `MONGO_URI`, `JWT_SECRET`) at application startup. Crash immediately if required keys are missing.

### API Contract & HTTP Standards
* **Consistent Response Envelope:** Always wrap API responses in a uniform JSON structure containing `success`, `message`, `data`, and optional `pagination`.
* **Correct Status Codes:**
  * `200 OK`: Successful read or update.
  * `201 Created`: Successful resource creation.
  * `204 No Content`: Successful deletion without a response body.
  * `400 Bad Request`: Validation failure or business rule violation (e.g., insufficient stock).
  * `401 Unauthorized`: Missing, expired, or invalid authentication token.
  * `403 Forbidden`: Authenticated user lacks permission.
  * `404 Not Found`: Resource ID or route does not exist.
  * `409 Conflict`: Duplicate unique key (e.g., email already registered).
  * `500 Internal Server Error`: Unhandled application exception.

---

## 4. Git & Code Hygiene Rules

* **Single Purpose Commits:** Keep commits atomic and use standard conventional commit prefixes (`feat:`, `fix:`, `refactor:`, `style:`, `docs:`, `chore:`).
* **Zero Warnings & Zero Type Errors:** Code must compile with zero TypeScript errors (`tsc --noEmit`) and zero linter warnings before committing.
* **Ignore Secrets & Artifacts:** Never commit `.env` files, temporary artifacts, build directories (`dist/`), or `node_modules/`.
* **Lockfile Integrity:** Always commit `package-lock.json` to guarantee identical dependency versions across environments.
