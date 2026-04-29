const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { authenticateToken } = require("../middleware/authMiddleware");

// All cart routes require login
router.use(authenticateToken);

// Read logged-in user's cart
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT
        cart_items.id,
        cart_items.product_id,
        cart_items.quantity,
        products.name,
        products.price,
        products.stock,
        products.image_url
      FROM cart_items
      JOIN products ON cart_items.product_id = products.id
      WHERE cart_items.user_id = ?
      ORDER BY cart_items.id DESC
      `,
      [req.user.id]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cart." });
  }
});

// Add item to logged-in user's cart
router.post("/", async (req, res) => {
  try {
    const { product_id } = req.body;
    const userId = req.user.id;

    if (!product_id) {
      return res.status(400).json({ error: "Product ID is required." });
    }

    const [products] = await db.query(
      "SELECT * FROM products WHERE id = ?",
      [product_id]
    );

    if (products.length === 0) {
      return res.status(404).json({ error: "Product not found." });
    }

    const product = products[0];

    const [existing] = await db.query(
      "SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?",
      [userId, product_id]
    );

    if (existing.length > 0) {
      const currentQty = existing[0].quantity;

      if (currentQty + 1 > product.stock) {
        return res.status(400).json({ error: "Cannot add more than available stock." });
      }

      await db.query(
        "UPDATE cart_items SET quantity = quantity + 1 WHERE user_id = ? AND product_id = ?",
        [userId, product_id]
      );
    } else {
      if (product.stock < 1) {
        return res.status(400).json({ error: "Product is out of stock." });
      }

      await db.query(
        "INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, 1)",
        [userId, product_id]
      );
    }

    res.status(201).json({ message: "Item added to cart." });
  } catch (err) {
    res.status(500).json({ error: "Failed to add item to cart." });
  }
});

// Update logged-in user's cart item quantity
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ error: "Quantity must be at least 1." });
    }

    const [rows] = await db.query(
      `
      SELECT cart_items.id, cart_items.product_id, products.stock
      FROM cart_items
      JOIN products ON cart_items.product_id = products.id
      WHERE cart_items.id = ? AND cart_items.user_id = ?
      `,
      [id, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Cart item not found." });
    }

    const item = rows[0];

    if (quantity > item.stock) {
      return res.status(400).json({ error: "Quantity exceeds available stock." });
    }

    await db.query(
      "UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?",
      [quantity, id, userId]
    );

    res.json({ message: "Cart item updated successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to update cart item." });
  }
});

// Remove item from logged-in user's cart
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const [existing] = await db.query(
      "SELECT * FROM cart_items WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: "Cart item not found." });
    }

    await db.query(
      "DELETE FROM cart_items WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    res.json({ message: "Item removed from cart." });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove item from cart." });
  }
});

module.exports = router;