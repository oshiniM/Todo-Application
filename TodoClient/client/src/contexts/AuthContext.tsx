// src/context/AuthContext.tsx
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { loginUser, registerUser } from '../api/authService';

interface User {
  id?: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Optional: Validate token or fetch user data here
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await loginUser(email, password);
    const token = res.token;

    if (token) {
      localStorage.setItem('token', token);
      
      // Create user object - ideally from response data if available
      const userData = { name: email.split('@')[0], email }; // Simplified - update if API returns user info
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
    } else {
      throw new Error(res.message || 'Login failed');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await registerUser(name, email, password);

    if (res.success === false) {
      throw new Error(res.message || 'Registration failed');
    }
    
    // If registration returns a token, login the user right away
    if (res.token) {
      localStorage.setItem('token', res.token);
      const userData = { name, email };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
    }
    // Otherwise, user will need to log in separately
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}