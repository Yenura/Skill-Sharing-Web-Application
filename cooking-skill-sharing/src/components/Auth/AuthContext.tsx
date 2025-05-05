"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

interface User {
  id: string;
  username: string;
  email: string;
  profilePicture?: string;
  // Assuming backend User object might have a roles field or similar
  roles?: string[]; // Add a potential roles field
  authorities?: { authority: string }[]; // Or authorities
}

// Type guard to check if an object is a User and has necessary fields
function isUser(obj: any): obj is User {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.username === 'string' &&
    typeof obj.email === 'string'
    // Add checks for roles/authorities if needed based on backend response
    // e.g., && (Array.isArray(obj.roles) || Array.isArray(obj.authorities))
  );
}

// Helper to check if user has admin role
export function isAdminUser(user: User | null): boolean {
  if (!user) return false;
  // Check if 'ADMIN' role exists in roles array
  if (Array.isArray(user.roles) && user.roles.includes('ADMIN')) return true;
  // Or check if authority 'ROLE_ADMIN' exists in authorities array
  if (Array.isArray(user.authorities)) {
    return user.authorities.some(auth => auth.authority === 'ROLE_ADMIN');
  }
  return false;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn?: number;
  userId?: string;
  user?: User;
}

interface TokenValidationResponse {
  valid: boolean;
  message?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  updateUserRole: (role: 'user' | 'admin') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing session
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Check if we have tokens in localStorage
      const accessToken = localStorage.getItem('authToken');
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!accessToken) {
        setLoading(false);
        return;
      }
      
      // Validate the access token with the backend
      const { data, error } = await api.post<TokenValidationResponse>('/auth/validate-token', null, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      if (error) {
        console.error('Auth check failed:', error);
        // If validation fails and we have a refresh token, try to refresh the access token
        if (refreshToken) {
          try {
            const { data: refreshData, error: refreshError } = await api.post<AuthResponse>('/auth/refresh-token', { refreshToken });
            if (!refreshError && refreshData?.accessToken) {
              localStorage.setItem('authToken', refreshData.accessToken);
              if (refreshData.refreshToken) {
                localStorage.setItem('refreshToken', refreshData.refreshToken);
              }
            } else {
              // If refresh fails, clear tokens and return
              localStorage.removeItem('authToken');
              localStorage.removeItem('refreshToken');
              setLoading(false);
              return;
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            setLoading(false);
            return;
          }
        } else {
          // If no refresh token, clear access token and return
          localStorage.removeItem('authToken');
          setLoading(false);
          return;
        }
      }
      
      // If token is valid, fetch user data
      const { data: userData, error: userError } = await api.get<User>('/users/me');
      
      if (userError) {
        console.error('Failed to fetch user data:', userError);
        setLoading(false);
        return;
      }
      
      if (userData && isUser(userData)) {
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await api.post<AuthResponse>('/auth/login', { 
        username: email, // The backend expects 'username' but we use email for login
        password 
      });

      // Check for API errors first
      if (error) {
        // If there's an API error (non-2xx response, etc.), throw it immediately.
        throw new Error(`Login failed: ${error}`);
      }

      // If no API error, check if the response data contains an access token.
      if (data?.accessToken) {
        // Save the tokens to localStorage
        localStorage.setItem('authToken', data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken);
        }
        
        // Fetch user data using the new access token
        const { data: userData, error: userError } = await api.get<User>('/users/me', {
          headers: {
            'Authorization': `Bearer ${data.accessToken}`
          }
        });
        
        if (userError) {
          throw new Error(`Failed to fetch user data: ${userError}`);
        }
        
        if (userData && isUser(userData)) {
          setUser(userData);
          router.push('/home'); // Redirect to home or dashboard after successful login
        } else {
          console.error('Login failed: Received unexpected user data format:', userData); // Log the received data
          throw new Error('Login failed: No user data returned or data format is incorrect'); // Update error message
        }
      } else {
        throw new Error('Login failed: No access token received');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const { data, error, status } = await api.post<AuthResponse>('/auth/register', { username, email, password });
      
      if (error) {
        console.error('Registration API error:', error, 'Status:', status);
        // Handle 409 Conflict (Duplicate Email as per backend change)
        if (status === 409) {
           // Use the error message from the backend if available, otherwise a default
          throw new Error(error || 'Email address already registered.');
        }
        // Handle other errors
        throw new Error(error || 'Registration failed. Please try again.');
      }
      
      if (!data) {
        console.error('No data received from registration API');
        throw new Error('Registration failed: No response data received');
      }

      // Check if access token exists
      if (!data.accessToken) {
        console.error('Registration response data:', data);
        throw new Error('Registration failed: Access token not found in response');
      }

      // Save both tokens to localStorage
      localStorage.setItem('authToken', data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }
      
      // Assume registration is successful, set a basic user object and redirect
      // Ideally, the backend registration response would include the user object
      // Or we could redirect to login page after registration
      setUser({
        id: '', // We don't have the ID from the response
        username: username,
        email: email,
        // role and isAdmin are now determined by roles/authorities from backend
        // Set default roles if needed, or rely on backend response structure
        roles: ['USER'], // Assuming a default 'USER' role
      });
      router.push('/home'); // Redirect to home page after registration

    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Remove tokens from localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      
      // Clear user state
      setUser(null);
      
      // Redirect to login page
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      const { data, error } = await api.put<User>('/user/profile', userData);
      
      if (error) {
        throw new Error(`Profile update failed: ${error}`);
      }
      
      if (data && isUser(data)) {
        setUser(data);
      } else {
        throw new Error('Profile update failed: No user data returned');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  const updateUserRole = async (role: 'user' | 'admin') => {
    try {
      const { data, error } = await api.put<User>('/user/role', { role });
      
      if (error) {
        throw new Error(`Role update failed: ${error}`);
      }
      
      if (data && isUser(data)) {
        // Assuming backend returns the updated user object with roles/authorities
        setUser(data);
      } else {
        throw new Error('Role update failed: No user data returned');
      }
    } catch (error) {
      console.error('Role update error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      logout, 
      updateProfile,
      updateUserRole 
    }}>
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
