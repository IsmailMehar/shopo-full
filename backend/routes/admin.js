const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { authenticateToken, requireAdmin } = require("../middleware/authMiddleware");

// Admin only: view all users and their cart items
router.get("/carts", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        users.id AS user_id,
        users.name AS user_name,
        users.email AS user_email,
        cart_items.id AS cart_item_id,
        cart_items.quantity,
        products.id AS product_id,
        products.name AS product_name,
        products.price,
        products.image_url,
        (cart_items.quantity * products.price) AS item_total
      FROM users
      LEFT JOIN cart_items ON users.id = cart_items.user_id
      LEFT JOIN products ON cart_items.product_id = products.id
      ORDER BY users.id ASC, cart_items.id DESC
    `);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user carts." });
  }
});

// Admin only: view all users
router.get("/users", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        id,
        name,
        email,
        role,
        created_at
      FROM users
      ORDER BY created_at DESC
    `);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users." });
  }
});

module.exports = router;