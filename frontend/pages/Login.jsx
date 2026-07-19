import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../auth/useAuth";
import PublicNavbar from "../Components/PublicNavbar";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitError, setSubmitError] = useState("");

  const { login, user, error } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    try {
      await login({ email, password });
    } catch (err) {
      setSubmitError(
        err?.response?.data?.error ||
          "Login failed. Please check your email and password.",
      );
      console.error("Error", err);
    }
  };

  return (
    <>
      <PublicNavbar />
      <div className="login-container">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
        </form>

        {(submitError || error) && (
          <div style={{ color: "crimson", marginTop: "12px" }}>
            {submitError || error}
          </div>
        )}
      </div>
    </>
  );
}

export default Login;
