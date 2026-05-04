# Shopo – Full Stack E-commerce Application (Assignment 2)

## Project Overview

Shopo is a full-stack single-page e-commerce web application that allows users to browse products, manage a personal shopping cart, and interact with a secure backend system.

The application extends a basic shopping cart system by introducing **user authentication, role-based access control, and multi-entity CRUD operations**, making it a more realistic and complete web application.

---

## Problem Statement

Basic web applications often lack user authentication, data persistence across sessions, and role-based control, limiting their realism and scalability.

This project addresses these limitations by implementing:

* secure user login and registration
* user-specific data handling (individual shopping carts)
* administrative control over system data

---

## Tech Stack

### Frontend

* React (SPA architecture)
* JavaScript (ES6+)
* CSS (custom responsive UI)

### Backend

* Node.js
* Express.js (REST API)

### Database

* MySQL

### Security & Auth

* bcrypt (password hashing)
* JSON Web Tokens (JWT) for authentication
* Role-based access control (user vs admin)

---

## Features

### User Features

* Register and login securely
* Browse all products
* Live search (real-time filtering)
* Filter products by category
* Add products to personal shopping cart
* Update quantity of cart items
* Remove items from cart
* View cart total

### Admin Features

* Create, update, and delete products
* View all registered users
* View all users’ shopping carts

### System Features

* SPA behaviour (no page reloads)
* Responsive design (mobile + desktop)
* Secure API endpoints using JWT
* Stock validation
* Error handling and user feedback

---

## CRUD Operations (3 Entities)

The application demonstrates full CRUD operations across three entities:

### 1. Users

* Create: register account
* Read: login and admin user view
* Update: handled through authentication lifecycle
* Delete: optional (not required for assignment)

### 2. Products (Admin Only)

* Create: add new product
* Read: view product catalogue
* Update: edit product details
* Delete: remove product

### 3. Cart Items

* Create: add item to cart
* Read: fetch user-specific cart
* Update: modify item quantity
* Delete: remove item from cart

---

## Authentication & Security

* Passwords are hashed using bcrypt before storage
* JWT tokens are generated on login and used for protected routes
* Role-based access ensures:

  * Users can only access their own cart
  * Admins can manage products and view user data

---

## Application Structure

```
shopo/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── cart.js
│   │   ├── products.js
│   │   └── admin.js
│   └── server.js
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── AuthForm.jsx
│   │   │   ├── CartPanel.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   └── AdminPanel.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.js
│
└── database/
    └── schema.sql
```

---

## How It Works

1. Users register and log in using secure authentication.
2. A JWT token is generated and stored in the frontend.
3. Authenticated users can interact with protected API routes.
4. Each user has their own shopping cart stored in the database.
5. Admin users can manage products and view system-wide data.
6. The frontend dynamically updates the UI using React state without page reloads.

---

## Setup Instructions

### 1. Database Setup

Ensure MySQL is installed and running.

Run:

```bash
mysql -u root -p < database/schema.sql
```

This will:

* create the `shopo` database
* create tables (`users`, `products`, `cart_items`)
* insert sample data including an admin account

---

### 2. Backend Setup

```bash
cd backend
npm install
npm start
```

Runs on:

```
http://localhost:5000
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

Runs on:

```
http://localhost:3000
```

---

## Admin Test Account

```
Email: admin@shopo.com
Password: admin123
```

---

## Configuration

Update database credentials in:

```
backend/.env
```

Example:

```
DB_PASSWORD=YOUR_MYSQL_PASSWORD
JWT_SECRET=YOUR_SECRET
```

---

## Challenges Faced and Solutions

### 1. Implementing Secure Authentication (JWT + bcrypt)

**Challenge:**
Initially, authentication was handled without proper security, which meant user credentials could be exposed or misused. Additionally, managing session state in a single-page application without page reloads introduced complexity.

**Solution:**
bcrypt was used to hash passwords before storing them in the database, ensuring that raw passwords were never saved. JWT was implemented for authentication, allowing the server to generate a token upon login, which is then stored on the client and sent with each protected request. Middleware was created to verify tokens and restrict access to protected routes, ensuring only authenticated users could interact with sensitive endpoints.

---

### 2. Role-Based Access Control (Admin vs User)

**Challenge:**
Ensuring that only admin users could perform actions such as creating, updating, and deleting products, while regular users were restricted to shopping-related features.

**Solution:**
A `role` field was introduced in the `users` table. During authentication, this role is included in the JWT payload. Middleware functions (`requireAdmin`) were implemented to check the user’s role before allowing access to admin routes. On the frontend, conditional rendering was used to display the admin panel only when the logged-in user has an admin role.

---

### 3. Managing User-Specific Shopping Carts

**Challenge:**
Initially, cart data was not tied to individual users, which caused conflicts where multiple users could see or modify the same cart data.

**Solution:**
The `cart_items` table was redesigned to include a `user_id` foreign key. Backend queries were updated to filter cart data based on the authenticated user’s ID, ensuring each user interacts only with their own cart. This also required updating all CRUD operations to include user-specific validation.

---

### 4. Synchronising Frontend State with Backend Data

**Challenge:**
React state did not automatically reflect database changes after operations such as adding or updating cart items, leading to inconsistencies between the UI and actual data.

**Solution:**
After each CRUD operation, additional API calls were made to re-fetch updated data from the backend. React’s `useEffect` hook was used to manage data loading, and state updates were carefully structured to ensure the UI always reflects the latest database state.

---

### 5. Implementing Admin View of All User Carts

**Challenge:**
Displaying all users’ shopping carts in a structured and readable way was difficult because the backend returned a flat dataset combining users, products, and cart items.

**Solution:**
The data was grouped on the frontend using JavaScript’s `reduce()` function to organise cart items under each user. This allowed the UI to present a clear hierarchy: user → cart items → total cost. Additional formatting was applied to improve readability and usability.

---

### 6. Handling Stock Validation

**Challenge:**
Users could attempt to add more items to the cart than were available in stock, which would result in inconsistent or invalid data.

**Solution:**
Stock validation was implemented in the backend to check product availability before allowing cart updates. On the frontend, buttons were disabled when stock limits were reached, preventing invalid actions before they occur.

---

### 7. Designing a Responsive and Clean UI

**Challenge:**
Ensuring the application worked well across different screen sizes while maintaining a clean and modern design required careful layout planning.

**Solution:**
CSS Flexbox and Grid were used to create responsive layouts. Media queries were implemented to adjust components for mobile screens, including stacking layouts and resizing elements. UI consistency was maintained using reusable component styles and spacing rules.


---

## User Experience Considerations

The user experience of Shopo was designed to ensure that interactions are intuitive, efficient, and visually consistent across different devices.

### 1. Single-Page Application Flow

The application behaves as a single-page application, meaning all interactions occur without full page reloads. This creates a smooth and uninterrupted experience, allowing users to browse products, update their cart, and navigate features seamlessly. State management in React ensures that UI updates occur instantly after user actions.

---

### 2. Clear Visual Hierarchy and Layout

A structured layout was implemented to guide users naturally through the application:

* The header provides immediate access to navigation and account actions
* Product cards highlight key information such as name, price, and availability
* The shopping cart panel clearly displays selected items and totals

Consistent spacing, typography, and colour usage improve readability and reduce cognitive load.

---

### 3. Immediate Feedback and Interaction Design

User actions are accompanied by immediate feedback to confirm outcomes:

* Buttons change state when hovered or clicked
* Disabled states prevent invalid actions (e.g., adding out-of-stock items)
* Notifications inform users when actions succeed or fail (e.g., item added, error occurred)

This feedback loop ensures users always understand what is happening in the system.

---

### 4. Efficient Shopping Workflow

The application minimises unnecessary steps:

* Products can be added to the cart with a single click
* Cart quantities can be updated directly without navigating away
* Items can be removed instantly

This streamlined workflow aligns with real-world e-commerce practices, improving usability and efficiency.

---

### 5. Real-Time Search and Filtering

Users can quickly find products using:

* Live search functionality that filters results as they type
* Category filtering to narrow down product lists

This reduces the time required to locate items and improves overall navigation.

---

### 6. Responsive Design

The interface is designed to work across both desktop and mobile devices:

* Layouts adjust using CSS Grid, Flexbox, and media queries
* Components stack appropriately on smaller screens
* Touch-friendly elements improve usability on mobile devices

This ensures accessibility for users on different devices.

---

### 7. Admin Interface Usability

The admin panel is structured to support efficient management tasks:

* Product creation and editing are handled through a single form
* Product lists are clearly displayed with edit and delete actions
* User cart data is grouped and presented in a readable format

This design allows administrators to manage the system effectively without confusion.

---

### 8. Accessibility Considerations

Basic accessibility practices were applied:

* Meaningful labels are used for inputs and form fields
* Images include alternative text
* Sufficient contrast is maintained between text and background
* Interactive elements are clearly distinguishable

These considerations improve usability for a wider range of users.


---

## Workload Declaration

This project was completed individually. All components including frontend, backend, database design, authentication, and UI development were implemented by the author.

---

## Conclusion

Shopo demonstrates a complete full-stack web application with authentication, role-based access, and multi-entity CRUD operations. It reflects real-world web development practices and provides a seamless user experience through a modern single-page application architecture.
---