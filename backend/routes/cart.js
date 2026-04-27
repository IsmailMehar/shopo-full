const express = require("express");
const router = express.Router();
const db = require("../config/db");

// This section reads the cart
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
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
      ORDER BY cart_items.id DESC
    `);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cart." });
  }
});

// This section adds items to the cart
router.post("/", async (req, res) => {
  try {
    const { product_id } = req.body;

    if (!product_id) {
      return res.status(400).json({ error: "Product ID is required." });
    }

    const [products] = await db.query("SELECT * FROM products WHERE id = ?", [product_id]);
    if (products.length === 0) {
      return res.status(404).json({ error: "Product not found." });
    }

    const product = products[0];

    const [existing] = await db.query("SELECT * FROM cart_items WHERE product_id = ?", [product_id]);

    if (existing.length > 0) {
      const currentQty = existing[0].quantity;

      if (currentQty + 1 > product.stock) {
        return res.status(400).json({ error: "Cannot add more than available stock." });
      }

      await db.query(
        "UPDATE cart_items SET quantity = quantity + 1 WHERE product_id = ?",
        [product_id]
      );
    } else {
      if (product.stock < 1) {
        return res.status(400).json({ error: "Product is out of stock." });
      }

      await db.query(
        "INSERT INTO cart_items (product_id, quantity) VALUES (?, 1)",
        [product_id]
      );
    }

    res.status(201).json({ message: "Item added to cart." });
  } catch (err) {
    res.status(500).json({ error: "Failed to add item to cart." });
  }
});

// This section updates the cart quantity
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ error: "Quantity must be at least 1." });
    }

    const [rows] = await db.query(`
      SELECT cart_items.id, cart_items.product_id, products.stock
      FROM cart_items
      JOIN products ON cart_items.product_id = products.id
      WHERE cart_items.id = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Cart item not found." });
    }

    const item = rows[0];

    if (quantity > item.stock) {
      return res.status(400).json({ error: "Quantity exceeds available stock." });
    }

    await db.query("UPDATE cart_items SET quantity = ? WHERE id = ?", [quantity, id]);
    res.json({ message: "Cart item updated successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to update cart item." });
  }
});

// This section removes the cart items
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await db.query("SELECT * FROM cart_items WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: "Cart item not found." });
    }

    await db.query("DELETE FROM cart_items WHERE id = ?", [id]);
    res.json({ message: "Item removed from cart." });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove item from cart." });
  }
});

module.exports = router;