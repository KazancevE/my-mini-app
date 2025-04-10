import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authService } from './api';
import WebApp  from '@twa-dev/sdk';


interface UserData {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  userData: UserData | null;
  login: (initData: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  // Проверка токена при инициализации
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = authService.getAccessToken();
        if (token) {
          setIsAuthenticated(true);
          if (WebApp?.initDataUnsafe?.user) {
            setUserData(WebApp.initDataUnsafe.user);
          }
        }
      } catch (e) {
        console.error('Auth check error:', e);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (initData: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await authService.login(initData);
      setIsAuthenticated(true);
      
      if (WebApp?.initDataUnsafe?.user) {
        setUserData(WebApp.initDataUnsafe.user);
        console.log('User authenticated:', WebApp.initDataUnsafe.user);
      }
      
      WebApp?.HapticFeedback?.notificationOccurred('success');
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'Authorization failed');
      WebApp?.HapticFeedback?.notificationOccurred('error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
    setUserData(null);
    WebApp?.HapticFeedback?.notificationOccurred('warning');
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    isAuthenticated,
    isLoading,
    error,
    userData,
    login,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};