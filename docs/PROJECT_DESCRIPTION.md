# Mini E-Commerce Store - Project Description

## 1. Project Overview

The goal of this project is to build an intuitive, responsive, and seamless mini e-commerce web application.

The application allows users to explore a catalog of products, observe real-time stock levels, sign up or log in to their personal account, and add items to their personal shopping cart. Whenever an item is added to the cart, the visible inventory quantity for that product decreases right away, giving the user immediate, accurate feedback on product availability.

---

## 2. Visual Design & General Look and Feel

- **Clean and Modern Layout:** A minimalist design with ample whitespace, readable typography, and accessible color contrast.
- **Responsive Across Devices:** Works smoothly on desktops, tablets, and mobile screens.
- **Interactive Feedback:** Buttons have clear hover and active states, visual spinners display during loading states, and toast notifications pop up on actions (e.g., "Item added to cart", "Signed in successfully").
- **Consistent Color Palette:**
  - Neutral background (light gray or clean white).
  - Primary accent color for actions (such as "Add to Cart", "Checkout", "Login").
  - Warning/Error accents (red for "Out of Stock", green for "In Stock" or success messages).

---

## 3. Key Pages & Visual Components

### A. Navigation Bar (Always Visible at the Top)

- **Brand Logo / Store Name:** Clicking takes the user back to the home page.
- **Search & Filter (Optional / Enhancements):** A search bar or category pills to quickly find products.
- **Cart Indicator:**
  - Displays a shopping cart icon with a live badge showing the total number of items currently in the cart.
  - Clicking opens the Cart page or a slide-out cart panel.
- **User Profile / Authentication Controls:**
  - **When Logged Out:** Displays "Log In" and "Register" buttons.
  - **When Logged In:** Displays the user's name or avatar with a dropdown containing options like "My Cart" and "Log Out".

---

### B. Home Page (Product Catalog)

- **Hero Banner:** A brief welcome header introducing the store or current featured collection.
- **Product Grid:**
  - A neat grid of product cards displaying:
    - **Product Image:** Clear visual representation of the product.
    - **Title & Description:** Short, readable product details.
    - **Price:** Formatted clearly (e.g., `$29.99`).
    - **Stock Status Badge:**
      - Shows the remaining available quantity (e.g., "12 items left").
      - Turns yellow when stock is low (e.g., "Only 2 left!").
      - Turns red when unavailable ("Out of Stock").
    - **"Add to Cart" Button:**
      - Active and clickable when stock is greater than 0.
      - Disabled with label "Out of Stock" when stock reaches 0.

---

### C. Authentication (Sign Up & Log In)

- **Clean Forms:**
  - **Register Screen:** Input fields for Name, Email, Password, and Confirm Password. Includes a link: *"Already have an account? Log In"*.
  - **Log In Screen:** Input fields for Email and Password, with a link: *"Don't have an account? Sign Up"*.
- **Helpful Validation:** Visual warnings for empty fields, invalid email format, or mismatched passwords before submission.
- **Smooth Redirect:** After logging in or signing up, the user is automatically returned to their previous browsing position.

---

### D. Shopping Cart (Page or Slide-out Drawer)

- **Cart Items List:**
  - Thumbnail image, product name, and unit price.
  - Quantity selector (`+` / `-` buttons) allowing the user to increase or decrease items up to the maximum available stock.
  - "Remove" button (trash can icon) to delete an item entirely from the cart.
  - Subtotal per item line.
- **Order Summary Card:**
  - Total number of items.
  - Subtotal amount, estimated tax, and Grand Total.
  - Primary button: "Proceed to Checkout" (or mock checkout action).
- **Empty Cart State:**
  - If no items are in the cart, a friendly illustration or message displays: *"Your cart is empty. Start shopping!"* with a button to return to the catalog.

---

## 4. How the Application Works (User Flow & Interactions)

```
                    ┌─────────────────────────┐
                    │      Browse Store       │
                    │  (View Products & Stock)│
                    └────────────┬────────────┘
                                 │
                     [User clicks "Add to Cart"]
                                 │
                         Is user logged in?
                                / \
                             No/   \Yes
                              /     \
    ┌────────────────────────┴─┐   ┌─┴────────────────────────┐
    │ Prompt to Register/Login │   │ 1. Add item to Cart      │
    │ (Returns user after auth)│   │ 2. Decrease Stock Count  │
    │                          │   │ 3. Update Cart Badge     │
    └──────────────────────────┘   └─────────────┬────────────┘
                                                 │
                                   ┌─────────────┴────────────┐
                                   │     View & Manage Cart   │
                                   │ - Increase / Decrease qty│
                                   │ - Remove items           │
                                   │ - View totals            │
                                   └──────────────────────────┘
```

### Flow 1: Browsing Products

1. Any visitor can open the home page and browse all available products.
2. Every product card shows the current available quantity in stock.
3. Visitors can see what is currently in stock or sold out without needing to log in first.

### Flow 2: User Registration & Login

1. A new user clicks "Register", fills in their basic details, and creates an account.
2. An existing user clicks "Log In", enters their credentials, and is authenticated.
3. The top navigation updates immediately to show that the user is logged in.

### Flow 3: Adding a Product to the Cart

1. When a logged-in user clicks "Add to Cart":
   - The product is added to the user's cart.
   - **Immediate Inventory Decrease:** The stock quantity displayed on the product card decrements immediately (e.g., from `10 in stock` to `9 in stock`).
   - The navigation cart badge increments by 1.
   - A brief success notification appears (e.g., *"Added Wireless Headphones to your cart"*).
2. If the user clicks "Add to Cart" until the quantity reaches `0`:
   - The stock label switches to **"Out of Stock"**.
   - The "Add to Cart" button is disabled to prevent further additions.
3. *If a guest (not logged in) clicks "Add to Cart":*
   - A friendly modal or prompt asks the user to log in or register before adding items to their cart.

### Flow 4: Managing the Cart

1. The user opens the Cart.
2. They see all items they have selected, their chosen quantities, unit prices, and overall total price.
3. **Increasing Quantity:** Clicking `+` adds another unit (and decreases the remaining available stock).
4. **Decreasing Quantity:** Clicking `-` reduces the quantity in the cart (and restores the stock back to the catalog).
5. **Removing an Item:** Clicking the remove icon clears the item from the cart and restores its full reserved quantity back to the product's available stock.

---

## 5. User Experience & Edge Cases Handled

- **Stock Depletion:** Users cannot add more units than the actual stock available.
- **Accidental Actions:** Clear confirmation or undo prompt when removing items from the cart.
- **State Persistence:** When the user refreshes the page, their login session and cart contents remain intact.
- **Clear Status Messages:** Informative messages if items become out of stock while shopping.
