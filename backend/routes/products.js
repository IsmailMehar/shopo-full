const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { authenticateToken, requireAdmin } = require("../middleware/authMiddleware");

// Public: read all products
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products." });
  }
});

// Admin only: create product
router.post("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, category, price, stock, image_url, description } = req.body;

    if (!name || !category || price === "" || stock === "") {
      return res.status(400).json({
        error: "Name, category, price, and stock are required."
      });
    }

    if (Number(price) < 0 || Number(stock) < 0) {
      return res.status(400).json({
        error: "Price and stock must be non-negative."
      });
    }

    const [result] = await db.query(
      `INSERT INTO products 
       (name, category, price, stock, image_url, description)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        category.trim(),
        Number(price),
        Number(stock),
        image_url || "",
        description || ""
      ]
    );

    const [newProduct] = await db.query(
      "SELECT * FROM products WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json(newProduct[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to create product." });
  }
});

// Admin only: update product
router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price, stock, image_url, description } = req.body;

    if (!name || !category || price === "" || stock === "") {
      return res.status(400).json({
        error: "Name, category, price, and stock are required."
      });
    }

    if (Number(price) < 0 || Number(stock) < 0) {
      return res.status(400).json({
        error: "Price and stock must be non-negative."
      });
    }

    const [existing] = await db.query(
      "SELECT id FROM products WHERE id = ?",
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: "Product not found." });
    }

    await db.query(
      `UPDATE products
       SET name = ?, category = ?, price = ?, stock = ?, image_url = ?, description = ?
       WHERE id = ?`,
      [
        name.trim(),
        category.trim(),
        Number(price),
        Number(stock),
        image_url || "",
        description || "",
        id
      ]
    );

    const [updatedProduct] = await db.query(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );

    res.json(updatedProduct[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to update product." });
  }
});

// Admin only: delete product
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await db.query(
      "SELECT id FROM products WHERE id = ?",
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: "Product not found." });
    }

    await db.query("DELETE FROM products WHERE id = ?", [id]);

    res.json({ message: "Product deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product." });
  }
});

module.exports = router;