# API Specifications & Contracts (`API_CONTRACTS.md`)

This document is the **single source of truth** for all network contracts between the Angular frontend and Node.js Express backend. It maps every user flow to its exact API endpoints, request/response DTOs, HTTP status codes, error scenarios, and database concurrency invariants.

---

## 1. Global Standards & Envelope Structures

All API responses must strictly adhere to the centralized response envelopes defined below. No raw arrays or bare primitives may be returned directly.

### Success Response Envelope (`ApiResponse<T>`)
```typescript
export interface PaginationMeta {
  readonly total: number;
  readonly page: number;
  readonly limit: number;
  readonly totalPages: number;
}

export interface ApiResponse<T> {
  readonly success: true;
  readonly message: string;
  readonly data: T;
  readonly pagination?: PaginationMeta;
}
```

### Error Response Envelope (`ApiErrorResponse`)
```typescript
export interface ApiErrorResponse {
  readonly success: false;
  readonly message: string;
  readonly errors?: readonly unknown[];
}
```

### Standard Status Codes
- `200 OK`: Successful read or update mutation.
- `201 Created`: Resource successfully created (signup, create product, add first item to cart).
- `400 Bad Request`: Validation failure or business rule violation (e.g., product out of stock).
- `401 Unauthorized`: Missing, expired, or invalid JWT bearer token.
- `403 Forbidden`: Authenticated user lacks permission.
- `404 Not Found`: Target resource or ID does not exist.
- `409 Conflict`: Unique key collision (e.g., email or username already taken).
- `500 Internal Server Error`: Unhandled server exception.

---

## 2. Flow 1: Public Catalog Browsing & Live Stock

### Endpoint 1.1: List Products (Paginated)
- **UI Trigger:** User opens homepage catalog grid, changes page, or applies filters.
- **Method & Route:** `GET /api/products`
- **Access:** **Public** *(No auth header required)*
- **Query Parameters:**
  - `page` (optional number, default: `1`, min: `1`)
  - `limit` (optional number, default: `10`, min: `1`, max: `100`)
  - `category` (optional string)
  - `search` (optional string)

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "message": "Products fetched successfully",
  "pagination": {
    "total": 30,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  },
  "data": [
    {
      "id": 1,
      "title": "Essence Mascara Lash Princess",
      "description": "The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects.",
      "price": 9.99,
      "discountPercentage": 7.17,
      "rating": 4.94,
      "stock": 5,
      "brand": "Essence",
      "category": "beauty",
      "thumbnail": "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png",
      "images": [
        "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/1.png"
      ]
    }
  ]
}
```

#### Database Invariants
- Read queries must use `.lean()` for maximum throughput.
- Enforce `limit = Math.min(rawLimit, 100)` to prevent memory exhaustion.

---

### Endpoint 1.2: Get Single Product Detail
- **UI Trigger:** User clicks a product card to inspect full details.
- **Method & Route:** `GET /api/products/:id`
- **Access:** **Public**
- **URL Parameters:**
  - `id` (required number): Numeric product ID.

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "message": "Product fetched successfully",
  "data": {
    "id": 1,
    "title": "Essence Mascara Lash Princess",
    "description": "The Essence Mascara Lash Princess...",
    "price": 9.99,
    "discountPercentage": 7.17,
    "rating": 4.94,
    "stock": 5,
    "brand": "Essence",
    "category": "beauty",
    "thumbnail": "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png",
    "images": ["https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/1.png"]
  }
}
```

#### Error Responses
- `400 Bad Request`: `{"success": false, "message": "Invalid product ID"}` (when `:id` is `NaN`).
- `404 Not Found`: `{"success": false, "message": "Product not found"}`.

---

## 3. Flow 2: Authentication, Session Restore & Identity

### Endpoint 2.1: Register New User
- **UI Trigger:** User fills in registration form and clicks "Register".
- **Method & Route:** `POST /api/auth/signup`
- **Access:** **Public**
- **Request Body (`SignupDto`):**
```typescript
export interface SignupDto {
  readonly email: string;
  readonly password: string;
  readonly username?: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly age?: number;
  readonly gender?: string;
  readonly address?: AddressDto;
  readonly company?: CompanyDto;
}
```

#### Success Response (`201 Created`)
```json
{
  "success": true,
  "message": "Signup Successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "id": 31,
    "email": "jane.doe@example.com",
    "username": "janedoe",
    "firstName": "Jane",
    "lastName": "Doe"
  }
}
```

#### Error Responses
- `400 Bad Request`: Missing email or password, or invalid email format.
- `409 Conflict`: `{"success": false, "message": "Email already in use"}` or `"Username already in use"`.

#### Security Invariants
- Password must be hashed with `bcrypt` (salt rounds $\ge 10$).
- Password hash must **never** appear in the response payload.
- JWT must include explicit expiration (`expiresIn: "2h"`).

---

### Endpoint 2.2: User Login
- **UI Trigger:** User enters email/username and password and clicks "Log In".
- **Method & Route:** `POST /api/auth/login`
- **Access:** **Public**
- **Request Body (`LoginDto`):**
```typescript
export interface LoginDto {
  readonly email?: string;
  readonly username?: string;
  readonly password: string;
}
```

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "message": "Login Successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "id": 1,
    "email": "emily.johnson@x.dummyjson.com",
    "username": "emilys",
    "firstName": "Emily",
    "lastName": "Johnson"
  }
}
```

#### Error Responses
- `400 Bad Request`: `{"success": false, "message": "Email/username and password are required"}`.
- `401 Unauthorized`: `{"success": false, "message": "Invalid credentials"}` *(Generic to prevent username harvesting)*.

---

### Endpoint 2.3: Session Recovery / Get Current User (`/auth/me`)
- **UI Trigger:** Browser reload or app initialization. Angular `AuthService` validates stored token.
- **Method & Route:** `GET /api/auth/me`
- **Access:** **Protected** (`Authorization: Bearer <token>`)

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "message": "Session verified successfully",
  "data": {
    "id": 1,
    "email": "emily.johnson@x.dummyjson.com",
    "username": "emilys",
    "firstName": "Emily",
    "lastName": "Johnson"
  }
}
```

#### Error Responses
- `401 Unauthorized`: Token expired or malformed; triggers automatic client-side logout.

---

## 4. Flow 3 & 4: Cart Management & Atomic Inventory Sync

### Cart Data Models & DTOs
```typescript
export interface CartItemDto {
  readonly productId: number;
  readonly title: string;
  readonly price: number;
  readonly thumbnail: string;
  readonly quantity: number;
  readonly itemTotal: number;
}

export interface CartSummaryDto {
  readonly userId: number;
  readonly items: readonly CartItemDto[];
  readonly totalQuantity: number;
  readonly subtotal: number;
  readonly tax: number;
  readonly grandTotal: number;
}

export interface AddToCartDto {
  readonly productId: number;
  readonly quantity?: number; // Defaults to 1
}

export interface UpdateCartItemDto {
  readonly quantity: number; // Target total quantity for this item in cart
}
```

---

### Endpoint 3.1: Get User Cart
- **UI Trigger:** User clicks cart icon in navigation bar to open slide-out drawer or page.
- **Method & Route:** `GET /api/cart`
- **Access:** **Protected** (`Authorization: Bearer <token>`)

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "message": "Cart fetched successfully",
  "data": {
    "userId": 1,
    "items": [
      {
        "productId": 1,
        "title": "Essence Mascara Lash Princess",
        "price": 9.99,
        "thumbnail": "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png",
        "quantity": 2,
        "itemTotal": 19.98
      }
    ],
    "totalQuantity": 2,
    "subtotal": 19.98,
    "tax": 1.60,
    "grandTotal": 21.58
  }
}
```

---

### Endpoint 3.2: Add Item to Cart (Immediate Stock Decrement)
- **UI Trigger:** User clicks "Add to Cart" on a catalog card.
- **Method & Route:** `POST /api/cart/items`
- **Access:** **Protected** (`Authorization: Bearer <token>`)
- **Request Body (`AddToCartDto`):**
```json
{
  "productId": 1,
  "quantity": 1
}
```

#### Success Response (`200 OK` or `201 Created`)
Returns the complete updated `CartSummaryDto`.

#### Error Responses
- `400 Bad Request`: `{"success": false, "message": "Product is out of stock"}`.
- `404 Not Found`: `{"success": false, "message": "Product not found"}`.

#### Mandatory Concurrency Invariant:
```typescript
// ATOMIC MUTATION: Never read, modify, and save.
const updatedProduct = await Product.findOneAndUpdate(
  { id: productId, stock: { $gte: quantity } },
  { $inc: { stock: -quantity } },
  { new: true }
);
if (!updatedProduct) {
  throw new BadRequestError("Insufficient stock available");
}
```

---

### Endpoint 3.3: Adjust Cart Item Quantity (`+` / `-`)
- **UI Trigger:** User clicks `+` or `-` buttons in the cart drawer.
- **Method & Route:** `PATCH /api/cart/items/:productId`
- **Access:** **Protected** (`Authorization: Bearer <token>`)
- **Request Body (`UpdateCartItemDto`):**
```json
{
  "quantity": 3
}
```

#### Behavior & Concurrency:
- If new quantity $>$ current quantity ($\Delta = +1$): Execute atomic decrement on product stock (`$inc: -1` where `stock > 0`). If stock is depleted, reject with `400 Bad Request`.
- If new quantity $<$ current quantity ($\Delta = -1$): Decrement cart item and restore product stock (`$inc: +1`).
- If new quantity $= 0$: Remove item from cart and restore remaining quantity to product stock.

---

### Endpoint 3.4: Remove Item from Cart
- **UI Trigger:** User clicks the trash icon on a cart line item.
- **Method & Route:** `DELETE /api/cart/items/:productId`
- **Access:** **Protected** (`Authorization: Bearer <token>`)

#### Behavior & Concurrency:
- Removes the line item from the user's cart.
- Atomically increments product stock by the exact quantity that was held in the cart:
  ```typescript
  await Product.updateOne({ id: productId }, { $inc: { stock: removedQuantity } });
  ```
- Returns updated `CartSummaryDto`.

---

### Endpoint 3.5: Clear Cart / Mock Checkout
- **UI Trigger:** User clicks "Proceed to Checkout" or "Clear Cart".
- **Method & Route:** `DELETE /api/cart`
- **Access:** **Protected** (`Authorization: Bearer <token>`)
- **Behavior:** Clears all items from the active cart.

---

## 5. Summary Table: Complete 17-API Surface

| # | Method | Path | Access | Flow | Purpose |
| :- | :--- | :--- | :--- | :--- | :--- |
| 1 | `GET` | `/api/products` | Public | Flow 1 | Paginated catalog browsing with search & category filters |
| 2 | `GET` | `/api/products/:id` | Public | Flow 1 | Product detail view |
| 3 | `POST` | `/api/products` | Protected | Admin | Create product |
| 4 | `PUT` | `/api/products/:id` | Protected | Admin | Replace product |
| 5 | `PATCH` | `/api/products/:id` | Protected | Admin | Partial update product |
| 6 | `DELETE`| `/api/products/:id` | Protected | Admin | Delete product |
| 7 | `POST` | `/api/auth/signup` | Public | Flow 2 | User registration |
| 8 | `POST` | `/api/auth/login` | Public | Flow 2 | User login |
| 9 | `GET` | `/api/auth/me` | Protected | Flow 2 | Session recovery on page refresh |
| 10 | `GET` | `/api/cart` | Protected | Flow 3/4 | Get current user's cart summary |
| 11 | `POST` | `/api/cart/items` | Protected | Flow 3 | Add item & decrement stock atomically |
| 12 | `PATCH` | `/api/cart/items/:productId` | Protected | Flow 4 | Update quantity (+/-) & sync stock |
| 13 | `DELETE`| `/api/cart/items/:productId` | Protected | Flow 4 | Remove line item & restore stock |
| 14 | `DELETE`| `/api/cart` | Protected | Flow 4 | Clear cart / checkout |
| 15 | `GET` | `/api/users` | Protected | Admin | List users |
| 16 | `GET` | `/api/users/:id` | Protected | Account | Get user profile |
| 17 | `PATCH` | `/api/users/:id` | Protected | Account | Update user profile |
