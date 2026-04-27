const express = require("express");
const router = express.Router();
const db = require("../config/db");

// This section reads all the products
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products." });
  }
});

module.exports = router;