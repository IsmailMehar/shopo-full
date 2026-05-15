export default function Header({
  user,
  cartCount,
  activeView,
  setActiveView,
  onLogout
}) {
  return (
    <header className="site-header">
      <div className="brand" onClick={() => setActiveView("shop")}>
        <div className="brand-logo">S</div>

        <div>
          <h2>Shopo</h2>
          <p>Smart shopping cart</p>
        </div>
      </div>

      <nav className="nav-actions">
        {/* Shop */}
        <button
          className={
            activeView === "shop"
              ? "nav-link active"
              : "nav-link"
          }
          onClick={() => setActiveView("shop")}
        >
          Shop
        </button>

        {/* Admin */}
        {user?.role === "admin" && (
          <button
            className={
              activeView === "admin"
                ? "nav-link active"
                : "nav-link"
            }
            onClick={() => setActiveView("admin")}
          >
            Admin
          </button>
        )}

        {/* Customers */}
        {user?.role === "admin" && (
          <button
            className={
              activeView === "customers"
                ? "nav-link active"
                : "nav-link"
            }
            onClick={() => setActiveView("customers")}
          >
            Customers
          </button>
        )}

        {/* Cart */}
        <div className="cart-pill">
          Cart: {cartCount}
        </div>

        {/* Logged in */}
        {user ? (
          <>
            <div className="user-pill">
              {user.name} <span>{user.role}</span>
            </div>

            <button
              className="btn btn-secondary"
              onClick={onLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setActiveView("login")}
            >
              Login
            </button>

            <button
              className="btn btn-primary"
              onClick={() => setActiveView("register")}
            >
              Register
            </button>
          </>
        )}
      </nav>
    </header>
  );
}