import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../auth/useAuth";
import PublicNavbar from "../Components/PublicNavbar";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signup, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup({ email, password });
      navigate("/dashboard");
    } catch (err) {
      console.error("Error", err);
    }
  };

  return (
    <>
      <PublicNavbar />
      <div className="signup-container">
      <h2>Create Account</h2>

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

        <button type="submit">Sign Up</button>
      </form>

      <p>
        Already have an account? <Link to="/">Login</Link>
      </p>
      </div>
    </>
  );
}

export default SignUp;
