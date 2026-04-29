import { useState } from "react";

const API = "http://localhost:5000/api";

export default function AuthForm({ mode, onAuthSuccess }) {
  const isLogin = mode === "login";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateForm = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const endpoint = isLogin ? "/auth/login" : "/auth/register";

      const body = isLogin
        ? { email: form.email, password: form.password }
        : form;

      const res = await fetch(`${API}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      if (isLogin) {
        onAuthSuccess(data);
      } else {
        const loginRes = await fetch(`${API}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.email,
            password: form.password
          })
        });

        const loginData = await loginRes.json();

        if (!loginRes.ok) {
          throw new Error(loginData.error || "Login after registration failed.");
        }

        onAuthSuccess(loginData);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-wrapper">
      <section className="auth-card">
        <p className="eyebrow">{isLogin ? "Welcome back" : "Create account"}</p>
        <h1>{isLogin ? "Login to Shopo" : "Register for Shopo"}</h1>
        <p className="auth-subtitle">
          {isLogin
            ? "Access your shopping cart and continue where you left off."
            : "Create a secure account to manage your own cart."}
        </p>

        {error && <div className="inline-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="field">
              <label>Name</label>
              <input
                name="name"
                value={form.name}
                onChange={updateForm}
                required
              />
            </div>
          )}

          <div className="field">
            <label>Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={updateForm}
              required
            />
          </div>

          <div className="field">
            <label>Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={updateForm}
              minLength="6"
              required
            />
          </div>

          <button className="btn btn-primary btn-wide" disabled={loading}>
            {loading ? "Please wait..." : isLogin ? "Login" : "Create Account"}
          </button>
        </form>
      </section>
    </main>
  );
}