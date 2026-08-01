import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Phase 9 will implement the actual API calls to fetch current user
  useEffect(() => {
    // Simulate initial check
    setIsLoading(false);
  }, []);

  const login = async (credentials) => {
    // Placeholder
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('accessToken');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
