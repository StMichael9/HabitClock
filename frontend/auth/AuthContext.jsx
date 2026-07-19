import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { createContext } from "react";
import { api } from "../api/client";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const signup = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/signup", userData);
      setUser(res.data);
      return res.data;
    } catch (err) {
      setUser(null);
      setError("Signup failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/login", userData);
      setUser(res.data);
      return res.data;
    } catch (err) {
      setUser(null);
      setError("Login Failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.delete("/logout");
      setUser(null);
      navigate("/");
    } catch (err) {
      setError("Logout Failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const checkSession = async () => {
    try {
      const res = await api.get("/check_session");
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
