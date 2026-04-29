import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import AuthForm from "./components/AuthForm";
import FilterBar from "./components/FilterBar";
import ProductCard from "./components/ProductCard";
import CartPanel from "./components/CartPanel";
import AdminPanel from "./components/AdminPanel";

const API = "http://localhost:5000/api";

export default function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("shopo_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("shopo_token"));

  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeView, setActiveView] = useState("shop");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const authHeaders = token
    ? {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    : { "Content-Type": "application/json" };

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 2500);
  };

  const fetchProducts = async () => {
    const res = await fetch(`${API}/products`);
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Failed to load products.");
    setProducts(Array.isArray(data) ? data : []);
  };

  const fetchCart = async () => {
    if (!token) {
      setCartItems([]);
      return;
    }

    const res = await fetch(`${API}/cart`, {
      headers: authHeaders
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Failed to load cart.");
    setCartItems(Array.isArray(data) ? data : []);
  };

  const loadAppData = async () => {
    try {
      setLoading(true);
      await fetchProducts();
      await fetchCart();
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppData();
  }, [token]);

  const handleAuthSuccess = ({ token, user }) => {
    localStorage.setItem("shopo_token", token);
    localStorage.setItem("shopo_user", JSON.stringify(user));
    setToken(token);
    setUser(user);
    setActiveView("shop");
    showMessage(`Welcome, ${user.name}.`);
  };

  const handleLogout = () => {
    localStorage.removeItem("shopo_token");
    localStorage.removeItem("shopo_user");
    setToken(null);
    setUser(null);
    setCartItems([]);
    setActiveView("shop");
    showMessage("Logged out successfully.");
  };

  const handleAddToCart = async (productId) => {
    if (!token) {
      setActiveView("login");
      showMessage("Please log in to add items to cart.", "error");
      return;
    }

    try {
      const res = await fetch(`${API}/cart`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ product_id: productId })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add item.");

      await fetchCart();
      showMessage("Item added to cart.");
    } catch (err) {
      showMessage(err.message, "error");
    }
  };

  const handleUpdateCartQuantity = async (cartItemId, quantity) => {
    if (quantity < 1) return;

    try {
      const res = await fetch(`${API}/cart/${cartItemId}`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify({ quantity })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update cart.");

      await fetchCart();
    } catch (err) {
      showMessage(err.message, "error");
    }
  };

  const handleRemoveCartItem = async (cartItemId) => {
    try {
      const res = await fetch(`${API}/cart/${cartItemId}`, {
        method: "DELETE",
        headers: authHeaders
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to remove item.");

      await fetchCart();
      showMessage("Item removed from cart.");
    } catch (err) {
      showMessage(err.message, "error");
    }
  };

  const categories = useMemo(() => {
    return [...new Set(products.map((p) => p.category).filter(Boolean))].sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const name = product.name || "";
      const category = product.category || "";

      const matchesSearch =
        name.toLowerCase().includes(search.toLowerCase()) ||
        category.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  const cartCount = cartItems.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );

  return (
    <div className="app-shell">
      <Header
        user={user}
        cartCount={cartCount}
        activeView={activeView}
        setActiveView={setActiveView}
        onLogout={handleLogout}
      />

      {message.text && (
        <div
          className={`message ${
            message.type === "error" ? "message-error" : "message-success"
          }`}
        >
          {message.text}
        </div>
      )}

      {activeView === "login" && (
        <AuthForm mode="login" onAuthSuccess={handleAuthSuccess} />
      )}

      {activeView === "register" && (
        <AuthForm mode="register" onAuthSuccess={handleAuthSuccess} />
      )}

      {activeView === "admin" && user?.role === "admin" && (
        <AdminPanel
          token={token}
          products={products}
          refreshProducts={fetchProducts}
          showMessage={showMessage}
        />
      )}

      {activeView === "shop" && (
        <>
          <section className="hero">
            <div>
              <p className="eyebrow">Modern online shopping</p>
              <h1>Browse products, build your cart, and shop faster.</h1>
              <p>
                Shopo is a single-page shopping cart application with secure login,
                live product search, and a database-backed cart.
              </p>
            </div>

            <div className="hero-card">
              <span>Total products</span>
              <strong>{products.length}</strong>
              <span>Cart items</span>
              <strong>{cartCount}</strong>
            </div>
          </section>

          {loading ? (
            <div className="loading-state">Loading products...</div>
          ) : (
            <main className="main-layout">
              <section className="content-column">
                <FilterBar
                  search={search}
                  setSearch={setSearch}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  categories={categories}
                />

                <section className="panel">
                  <div className="panel-header">
                    <div>
                      <h2>Featured Products</h2>
                      <p className="section-subtitle">
                        {filteredProducts.length} products available
                      </p>
                    </div>
                  </div>

                  {filteredProducts.length === 0 ? (
                    <div className="empty-state">
                      <p>No products match your search or filter.</p>
                    </div>
                  ) : (
                    <div className="products-grid">
                      {filteredProducts.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onAddToCart={handleAddToCart}
                        />
                      ))}
                    </div>
                  )}
                </section>
              </section>

              <CartPanel
                cartItems={cartItems}
                onUpdateQuantity={handleUpdateCartQuantity}
                onRemove={handleRemoveCartItem}
              />
            </main>
          )}
        </>
      )}
    </div>
  );
}