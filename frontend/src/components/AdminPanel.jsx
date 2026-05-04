import { useEffect, useMemo, useState } from "react";

const API = "http://localhost:5000/api";

const emptyProduct = {
  name: "",
  category: "",
  price: "",
  stock: "",
  image_url: "",
  description: ""
};

export default function AdminPanel({ token, products, refreshProducts, showMessage }) {
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [userCarts, setUserCarts] = useState([]);

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };

  const groupedCarts = useMemo(() => {
    return userCarts.reduce((acc, item) => {
      if (!item.user_id) return acc;

      if (!acc[item.user_id]) {
        acc[item.user_id] = {
          name: item.user_name,
          email: item.user_email,
          items: []
        };
      }

      if (item.product_name) {
        acc[item.user_id].items.push(item);
      }

      return acc;
    }, {});
  }, [userCarts]);

  const updateForm = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const resetForm = () => {
    setForm(emptyProduct);
    setEditingId(null);
  };

  const fetchUserCarts = async () => {
    try {
      const res = await fetch(`${API}/admin/carts`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load carts.");
      }

      setUserCarts(Array.isArray(data) ? data : []);
    } catch (err) {
      showMessage(err.message, "error");
    }
  };

  useEffect(() => {
    fetchUserCarts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitProduct = async (e) => {
    e.preventDefault();

    const url = editingId
      ? `${API}/products/${editingId}`
      : `${API}/products`;

    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          stock: Number(form.stock)
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save product.");
      }

      await refreshProducts();
      await fetchUserCarts();
      resetForm();
      showMessage(editingId ? "Product updated." : "Product created.");
    } catch (err) {
      showMessage(err.message, "error");
    }
  };

  const editProduct = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      image_url: product.image_url || "",
      description: product.description || ""
    });
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      const res = await fetch(`${API}/products/${id}`, {
        method: "DELETE",
        headers
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete product.");
      }

      await refreshProducts();
      await fetchUserCarts();
      showMessage("Product deleted.");
    } catch (err) {
      showMessage(err.message, "error");
    }
  };

  return (
    <main className="admin-layout">
      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Admin Product Management</h2>
            <p className="section-subtitle">
              Create, update, and remove products from the catalogue.
            </p>
          </div>
        </div>

        <form className="admin-form" onSubmit={submitProduct}>
          <div className="form-grid">
            <div className="field">
              <label>Name</label>
              <input name="name" value={form.name} onChange={updateForm} required />
            </div>

            <div className="field">
              <label>Category</label>
              <input name="category" value={form.category} onChange={updateForm} required />
            </div>

            <div className="field">
              <label>Price</label>
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={updateForm}
                required
              />
            </div>

            <div className="field">
              <label>Stock</label>
              <input
                name="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={updateForm}
                required
              />
            </div>

            <div className="field field-full">
              <label>Image URL</label>
              <input name="image_url" value={form.image_url} onChange={updateForm} />
            </div>

            <div className="field field-full">
              <label>Description</label>
              <textarea name="description" value={form.description} onChange={updateForm} />
            </div>
          </div>

          <div className="form-actions">
            <button className="btn btn-primary">
              {editingId ? "Update Product" : "Create Product"}
            </button>

            {editingId && (
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Product Catalogue</h2>
          <span className="section-subtitle">{products.length} products</span>
        </div>

        <div className="admin-product-list">
          {products.map((product) => (
            <div className="admin-product-row" key={product.id}>
              <div>
                <strong>{product.name}</strong>
                <p>
                  {product.category} · ${Number(product.price).toFixed(2)} · Stock{" "}
                  {product.stock}
                </p>
              </div>

              <div className="row-actions">
                <button className="btn btn-secondary" onClick={() => editProduct(product)}>
                  Edit
                </button>
                <button className="btn btn-danger" onClick={() => deleteProduct(product.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>User Cart Overview</h2>
            <p className="section-subtitle">
              Admin view of registered users and their shopping cart contents.
            </p>
          </div>
        </div>

        {Object.keys(groupedCarts).length === 0 ? (
          <div className="empty-state">
            <p>No cart data available.</p>
          </div>
        ) : (
          <div className="admin-cart-list">
            {Object.entries(groupedCarts).map(([userId, user]) => {
              const total = user.items.reduce(
                (sum, item) => sum + Number(item.item_total || 0),
                0
              );

              return (
                <div key={userId} className="admin-user-cart">
                  <div className="admin-user-cart-header">
                    <div>
                      <h4>{user.name}</h4>
                      <p>{user.email}</p>
                    </div>
                    <strong>${total.toFixed(2)}</strong>
                  </div>

                  {user.items.length === 0 ? (
                    <p className="section-subtitle">No items in cart.</p>
                  ) : (
                    <div className="admin-cart-items">
                      {user.items.map((item) => (
                        <div className="admin-cart-item" key={item.cart_item_id}>
                          <span>{item.product_name}</span>
                          <span>Qty: {item.quantity}</span>
                          <strong>${Number(item.item_total || 0).toFixed(2)}</strong>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}