import { createContext, useContext, useEffect, useState } from "react";
import { api, authMe, loginUser } from "../Api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await authMe();
        setUser(data.email ? data : null);
      } catch {
        setUser(null);
        console.error("Auth fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      await loginUser(email, password);

      const data = await authMe();

      setUser(data.email ? data : null);

      return data;
    } catch (err) {
      setUser(null);
      console.error("Login failed:", err);
      throw err;
    }
  };

  const logout = async () => {
    await api.post("/users/logout/");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
