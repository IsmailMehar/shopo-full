export default function CartPanel({ cartItems, onUpdateQuantity, onRemove }) {
  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  const itemCount = cartItems.reduce(
    (sum, item) => sum + Number(item.quantity),
    0
  );

  return (
    <aside className="panel cart-panel">
      <div className="panel-header">
        <div>
          <h2>Your Cart</h2>
          <p className="section-subtitle">{itemCount} items selected</p>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-state cart-empty">
          <div className="empty-icon">🛒</div>
          <p>Your cart is empty.</p>
          <span>Add products to start building your order.</span>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {cartItems.map((item) => (
              <div className="cart-item" key={item.id}>
                <img
                  src={item.image_url || "https://placehold.co/80x80?text=Item"}
                  onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/80x80?text=Item";
                  }}
                  alt={item.name}
                  className="cart-thumb"
                />

                <div className="cart-item-info">
                  <h4>{item.name}</h4>
                  <p>${Number(item.price).toFixed(2)} each</p>

                  <div className="qty-controls">
                    <button
                      className="qty-btn"
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="cart-item-actions">
                  <strong>
                    ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                  </strong>
                  <button
                    className="remove-link"
                    onClick={() => onRemove(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="checkout-box">
            <div>
              <span>Subtotal</span>
              <strong>${total.toFixed(2)}</strong>
            </div>
            <button className="btn btn-primary btn-wide">
              Checkout Preview
            </button>
          </div>
        </>
      )}
    </aside>
  );
}