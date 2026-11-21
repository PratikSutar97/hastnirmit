import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      await login(email.trim(), password);
      navigate("/admin", { replace: true });
    } catch (err) {
      console.error("Login failed:", err);

      setError(
        err.code === "auth/invalid-credential"
          ? "Invalid email or password."
          : err.message || "Unable to login. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="admin-login-page">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <h1>Hastnirmit Admin</h1>
        <p>Sign in to manage your store.</p>

        {error && (
          <div className="admin-login-error" role="alert">
            {error}
          </div>
        )}

        <label htmlFor="admin-email">Email address</label>
        <input
          id="admin-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter admin email"
          autoComplete="username"
          required
        />

        <label htmlFor="admin-password">Password</label>
        <input
          id="admin-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          autoComplete="current-password"
          required
        />

        <button type="submit" disabled={submitting}>
          {submitting ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </main>
  );
}

export default AdminLogin;