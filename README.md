# Shopo – Single Page Shopping Cart Application

## Project Overview

Shopo is a single-page web application that allows users to browse products and interact with a dynamic shopping cart. The application demonstrates core full-stack web development concepts, including frontend interactivity, backend API integration, and database-driven CRUD operations.

The system enables users to view available products, add items to a cart, update quantities, and remove items, with all cart data persisted in a MySQL database.

---

## Problem Statement

Many basic web applications rely on static pages or lack seamless interactivity. This project addresses this by implementing a dynamic single-page application (SPA) that provides a smooth, responsive user experience without full-page reloads.

It demonstrates how modern web applications manage state, interact with APIs, and persist data in a database.

---

## Tech Stack

### Frontend

* React (SPA architecture)
* JavaScript (ES6+)
* CSS (custom styling, responsive layout)

### Backend

* Node.js
* Express.js (REST API)

### Database

* MySQL

### Other

* Fetch API for client-server communication
* RESTful API design

---

## Features

* View all available products
* Search products by name or category
* Filter products by category
* Add products to the shopping cart
* Update the quantity of cart items
* Remove items from cart
* Display total cart value
* Stock validation (prevents exceeding available stock)
* Responsive layout for different screen sizes
* Dynamic UI updates without page reload (SPA behaviour)

---

## CRUD Operations

The application fully demonstrates CRUD operations using the **cart_items** database table:

* **Create**: Add a product to the cart
* **Read**: Retrieve and display products and cart items
* **Update**: Modify the quantity of items in the cart
* **Delete**: Remove items from the cart

---

## Application Structure

### Folder Structure

```
shopo/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── routes/
│   │   ├── cart.js
│   │   └── products.js
│   └── server.js
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├──  src/
│       ├── components/
│       │   ├── CartPanel.jsx
│       │   ├── FilterBar.jsx
│       │   └── ProductCard.jsx
│       ├── App.jsx
│       ├── App.css
│       ├── index.css
│       └── index.js
│
└── database/
    └── schema.sql
```

---

## How It Works

1. The frontend loads product data from the backend API.
2. Users interact with the interface to add or modify cart items.
3. The frontend sends requests to the backend using the Fetch API.
4. The backend processes requests and updates the MySQL database.
5. Updated data is returned and reflected instantly in the UI without a page reload.

---

## Setup Instructions

### 1. Database Setup

Ensure that MySQL is installed and running on your system.

You can import the provided database schema using the VS Code terminal (or any command-line interface).

Navigate to the project root directory or the database folder and run:

```bash
mysql -u root -p < database/schema.sql
or
mysql -u root -p < schema.sql (if in database)
```

You will be prompted to enter your MySQL password.

This command will:

* create the `shopo` database
* create all required tables (`products`, `cart_items`)
* insert sample product data


---

### 2. Backend Setup

```
cd backend
npm install
npm start
```

Server runs on:

```
http://localhost:5000
```

---

### 3. Frontend Setup

```
cd frontend
npm install
npm start
```

App runs on:

```
http://localhost:3000
```

---

## Configuration

Update your database credentials in:

```
backend/config/db.js
```

Example:

```js
password: "YOUR_MYSQL_PASSWORD"
```

---

## Challenges Faced

* Ensuring a consistent state between the frontend and the backend when updating cart data
* Handling asynchronous API calls and error states
* Implementing stock validation to prevent invalid cart updates
* Designing a responsive layout that works across different screen sizes
* Structuring the project to clearly separate frontend and backend logic

---

## User Experience Considerations

* Clear visual hierarchy for products and cart
* Immediate feedback when adding or removing items
* Disabled buttons when actions are not allowed (e.g., out of stock)
* Responsive design for mobile and desktop use
* Clean and minimal interface for ease of use

---

## Conclusion

Shopo successfully demonstrates the implementation of a full-stack single-page application using modern web technologies. It showcases how frontend interactivity, backend APIs, and database operations can be integrated to create a seamless user experience.

## References

Mouse image: https://www.computeralliance.com.au/InventoryImages/45730.jpg
Keyboard image: https://jmau.imgix.net/media/catalog/product/9/2/920-013234-logitech-g-pro-x-tkl-rapid-keyboard-1_5kofnuei5cvvlehx.jpg
Notebook image: https://www.promotionproducts.com.au/media/products/images/eco-spiral-bound-a5-notebooks Promotional%20Eco%20Spiral%20Bound%20A5%20Notebooks%20Main.jpg
Bottle image: https://au.yeti.com/cdn/shop/files/70000007210_21071508651_Site_Studio_Drinkware_Rambler_CM_Chug_Bottle_36oz_Ridgeline_Back_168_B_2400x2400_e404181c-228a-4be2-b1fe-b5fe4790619a.png?v=1774477078&width=846
Lamp image: https://onlinelighting.com.au/images/detailed/136/Croset_Table_Lamp.jpg
Backpack image: https://www.antler.com.au/cdn/shop/files/Antler-01-Discovery-Backpack-Black-Angle.jpg?v=1712856855


---
