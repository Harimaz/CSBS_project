import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiClient, { authAPI } from '@/api/client';

// TOGGLE THIS TO SWITCH BETWEEN REAL BACKEND AND SIMULATED AUTH
const USE_MOCK_AUTH = true;

export type UserRole = 'student' | 'faculty' | 'admin';

interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  rollNo?: string;
  empId?: string;
  semester?: number;
}

interface AuthContextType {
  user: AppUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (email: string, password: string, role?: UserRole, name?: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing user on mount
  useEffect(() => {
    const initAuth = async () => {
      if (USE_MOCK_AUTH) {
        // MOCK AUTH INITIALIZATION
        const storedUser = localStorage.getItem('mock_user');
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
            // Also set a fake token for client consistency
            apiClient.setToken('mock-demo-token');
          } catch (e) {
            localStorage.removeItem('mock_user');
          }
        }
        setIsLoading(false);
        return;
      }

      // REAL BACKEND INITIALIZATION
      const token = apiClient.getToken();
      if (token) {
        try {
          const response = await authAPI.getMe();
          if (response.success && response.data) {
            setUser({
              id: response.data._id || response.data.id,
              name: response.data.name,
              email: response.data.email,
              role: response.data.role,
              department: response.data.department,
              rollNo: response.data.rollNo,
              empId: response.data.empId,
              semester: response.data.semester
            });
          }
        } catch (error) {
          console.error('Error fetching user:', error);
          apiClient.setToken(null);
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    if (USE_MOCK_AUTH) {
      // MOCK LOGIN IMPLEMENTATION
      return new Promise((resolve) => {
        setTimeout(() => {
          // Accept any credentials, or specifically admin/admin
          const mockUser: AppUser = {
            id: 'mock-user-123',
            name: email.split('@')[0] || 'User',
            email: email,
            role: email.includes('admin') ? 'admin' : (email.includes('faculty') ? 'faculty' : 'student'),
            department: 'Computer Science',
            semester: 5
          };

          setUser(mockUser);
          localStorage.setItem('mock_user', JSON.stringify(mockUser));
          apiClient.setToken('mock-demo-token');

          resolve({ success: true, message: 'Login successful (Mock Mode)' });
        }, 800);
      });
    }

    try {
      const response = await authAPI.login({ email, password });

      if (response.success) {
        const token = response.token || response.data?.token;
        if (token) {
          apiClient.setToken(token);
        }

        const userData = response.data;
        setUser({
          id: userData._id || userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          department: userData.department,
          rollNo: userData.rollNo,
          empId: userData.empId,
          semester: userData.semester
        });

        return { success: true, message: response.message || 'Login successful' };
      }

      return { success: false, message: 'Login failed' };
    } catch (error: any) {
      return { success: false, message: error.message || 'Login failed' };
    }
  };

  const register = async (
    email: string,
    password: string,
    role: UserRole = 'student',
    name?: string
  ): Promise<{ success: boolean; message: string }> => {
    if (USE_MOCK_AUTH) {
      // MOCK REGISTER IMPLEMENTATION
      return new Promise((resolve) => {
        setTimeout(() => {
          // Automatically log in after register
          const mockUser: AppUser = {
            id: 'mock-user-' + Date.now(),
            name: name || email.split('@')[0],
            email: email,
            role: role,
            department: 'Computer Science',
            semester: 1
          };

          setUser(mockUser);
          localStorage.setItem('mock_user', JSON.stringify(mockUser));
          apiClient.setToken('mock-demo-token');

          resolve({ success: true, message: 'Registration successful! (Mock Mode)' });
        }, 800);
      });
    }

    try {
      const response = await authAPI.register({
        name: name || email.split('@')[0],
        email,
        password,
        role
      });

      if (response.success) {
        return { success: true, message: response.message || 'Registration successful! You can now login.' };
      }

      return { success: false, message: 'Registration failed' };
    } catch (error: any) {
      return { success: false, message: error.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    if (USE_MOCK_AUTH) {
      localStorage.removeItem('mock_user');
      apiClient.setToken(null);
      setUser(null);
      return;
    }

    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      apiClient.setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

