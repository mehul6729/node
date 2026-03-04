import { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const res = await api.getUserDetails();
      if (res.data?.success && res.data?.data) {
        setUser(res.data.data);
        return res.data.data;
      }
    } catch {
      setUser(null);
    }
    return null;
  };

  useEffect(() => {
    fetchUser().finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    if (res.data?.success) {
      await fetchUser();
      navigate('/');
      return { success: true };
    }
    return { success: false, message: res.data?.message || 'Login failed' };
  };

  const registerUser = async (name, email, password) => {
    const res = await api.register({ name, email, password });
    if (res.data?.success) {
      await fetchUser();
      navigate('/');
      return { success: true };
    }
    return { success: false, message: res.data?.message || 'Registration failed' };
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
    navigate('/');
  };

  const refreshUser = () => fetchUser();

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register: registerUser,
        logout,
        refreshUser,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
