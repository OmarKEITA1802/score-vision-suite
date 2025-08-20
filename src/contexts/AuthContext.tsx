import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services/authService';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'CLIENT' | 'AGENT' | 'ADMIN';
  avatar?: string;
  createdAt: string;
  status: 'ACTIVE' | 'INACTIVE';
  lastLogin?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'CLIENT' | 'AGENT';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          const userData = await authService.getProfile();
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('auth_token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { user: userData, token } = await authService.login(email, password);
      
      localStorage.setItem('auth_token', token);
      setUser(userData);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true);
      const { user: newUser, token } = await authService.register(userData);
      
      localStorage.setItem('auth_token', token);
      setUser(newUser);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const userData = await authService.getProfile();
      setUser(userData);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      logout();
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};