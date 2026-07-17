import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

axios.defaults.baseURL = "https://habitclock-1.onrender.com/";
axios.defaults.withCredentials = true;

import { createContext } from "react";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const signup = async (userData) => {
    setLoading(true);
    try {
      const res = await axios.post("/signup", userData);
      setUser(res.data);
    } catch {
      setUser(null);
      setError("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData) => {
    setLoading(true);
    try {
      const res = await axios.post("/login", userData);
      setUser(res.data);
      navigate("/dashboard");
    } catch {
      setUser(null);
      setError("Login Failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await axios.delete("/logout");
      setUser(null);
      navigate("/");
    } catch {
      setError("Logout Failed");
    } finally {
      setLoading(false);
    }
  };

  const checkSession = async () => {
    try {
      const res = await axios.get("/check_session");
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, error, signup, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
