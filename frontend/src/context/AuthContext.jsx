import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const access = localStorage.getItem("access_token");
    if (access) {
      api.get("/api/auth/me/")
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  async function login(email, password) {
    try {
      const res = await api.post("/api/auth/login/", { username: email, password });
      const { access, refresh } = res.data;
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      const me = await api.get("/api/auth/me/");
      setUser(me.data);
      setLoading(false);
      return { success: true };
    } catch (error) {
      return { success: false, error: "Invalid credentials" };
    }
  }

  async function register(email, password) {
    try {
      await api.post("/api/auth/register/", { email, username: email, password });
      return { success: true };
    } catch (error) {
      return { success: false, error: "Registration failed" };
    }
  }

  async function logout() {
    const refresh = localStorage.getItem("refresh_token");

    try {
      await api.post("/api/auth/logout/", { refresh });
    } catch (e) {
    }

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    setLoading(false);
    navigate("/login");
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
