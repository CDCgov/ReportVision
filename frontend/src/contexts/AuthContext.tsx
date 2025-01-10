import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock API function to simulate authentication
// eslint-disable-next-line react-refresh/only-export-components
export const mockLogin = async (username: string, password: string) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Mock authentication logic
  if (username === 'test@cdc.gov' && password === 'Password1') {
    return {
      token: 'mock-jwt-token-' + Math.random().toString(36).substring(7)
    };
  } else {
    return { token: 'error' }
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('auth_token');
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Check token validity on mount
    const storedToken = localStorage.getItem('auth_token');
    if (!storedToken) {
      navigate('/login');
    }
  }, [navigate]);

  const login = (newToken: string) => {
    if (newToken === 'error') {
        throw new Error('Invalid credentials');
    }
    setToken(newToken);
    localStorage.setItem('auth_token', newToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('auth_token');
    navigate('/login');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        token, 
        login, 
        logout, 
        isAuthenticated: !!token 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
