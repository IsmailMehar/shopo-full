require("dotenv").config();

const express = require("express");
const cors = require("cors");

const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Shopo backend running.");
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});