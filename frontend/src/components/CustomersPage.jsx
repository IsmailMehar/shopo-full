import { useEffect, useMemo, useState } from "react";

const API = "http://localhost:5000/api";

const CUSTOMERS_PER_PAGE = 20;

export default function CustomersPage({ token, showMessage }) {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchCustomers = async () => {
    try {
      const res = await fetch(`${API}/admin/customers`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch customers.");
      }

      setCustomers(data);
    } catch (err) {
      showMessage(err.message, "error");
    }
  };

  const fetchCustomerCart = async (customer) => {
    try {
      setSelectedCustomer(customer);

      const res = await fetch(
        `${API}/admin/customers/${customer.id}/cart`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch customer cart.");
      }

      setCartItems(data);
    } catch (err) {
      showMessage(err.message, "error");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const value = search.toLowerCase();

      return (
        customer.name.toLowerCase().includes(value) ||
        customer.email.toLowerCase().includes(value)
      );
    });
  }, [customers, search]);

  const totalPages = Math.ceil(
    filteredCustomers.length / CUSTOMERS_PER_PAGE
  );

  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * CUSTOMERS_PER_PAGE,
    currentPage * CUSTOMERS_PER_PAGE
  );

  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  return (
    <main className="customers-layout">
      <section className="panel customers-panel">
        <div className="panel-header">
          <div>
            <h2>Customers</h2>
            <p className="section-subtitle">
              Search and inspect registered customers.
            </p>
          </div>
        </div>

        <div className="customer-search">
          <input
            type="text"
            placeholder="Search by customer name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="customer-list-table">
          <div className="customer-list-header">
            <span>Customer</span>
            <span>Email</span>
            <span>Role</span>
          </div>

          {paginatedCustomers.length === 0 ? (
            <div className="empty-state">
              <p>No matching customers found.</p>
            </div>
          ) : (
            paginatedCustomers.map((customer) => (
              <button
                key={customer.id}
                className={`customer-row ${
                  selectedCustomer?.id === customer.id
                    ? "customer-row-active"
                    : ""
                }`}
                onClick={() => fetchCustomerCart(customer)}
              >
                <span>{customer.name}</span>
                <span>{customer.email}</span>
                <span className="customer-role">
                  {customer.role}
                </span>
              </button>
            ))
          )}
        </div>

        <div className="pagination">
          <button
            className="btn btn-secondary"
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage((prev) => prev - 1)
            }
          >
            ← Previous
          </button>

          <span>
            Page {currentPage} of {totalPages || 1}
          </span>

          <button
            className="btn btn-secondary"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() =>
              setCurrentPage((prev) => prev + 1)
            }
          >
            Next →
          </button>
        </div>
      </section>

      <section className="panel customer-cart-panel">
        <div className="panel-header">
          <div>
            <h2>
              {selectedCustomer
                ? `${selectedCustomer.name}'s Cart`
                : "Customer Cart"}
            </h2>

            <p className="section-subtitle">
              {selectedCustomer
                ? selectedCustomer.email
                : "Select a customer to inspect their cart."}
            </p>
          </div>
        </div>

        {!selectedCustomer ? (
          <div className="empty-state">
            <p>Select a customer to inspect their cart.</p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="empty-state">
            <p>This customer has no items in their cart.</p>
          </div>
        ) : (
          <>
            <div className="customer-cart-items">
              {cartItems.map((item) => (
                <div
                  className="customer-cart-item"
                  key={item.id}
                >
                  <img
                    src={
                      item.image_url ||
                      "https://placehold.co/100x100?text=Item"
                    }
                    alt={item.name}
                    className="customer-cart-image"
                  />

                  <div className="customer-cart-info">
                    <h4>{item.name}</h4>
                    <p>{item.category}</p>
                  </div>

                  <div className="customer-cart-meta">
                    <span>Qty: {item.quantity}</span>

                    <strong>
                      $
                      {(
                        Number(item.price) *
                        Number(item.quantity)
                      ).toFixed(2)}
                    </strong>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-total">
              <span>Total</span>
              <strong>${total.toFixed(2)}</strong>
            </div>
          </>
        )}
      </section>
    </main>
  );
}