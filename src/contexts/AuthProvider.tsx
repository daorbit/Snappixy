/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback, type ReactNode } from 'react';
import { AuthContext } from './AuthContextProvider.ts';
import { type AuthContextType, type User } from '../types/index.ts';

interface AuthProviderProps {
  children: ReactNode;
}

interface GoogleCredentialResponse {
  credential: string;
}

interface GoogleTokenResponse {
  access_token: string;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleCredentialResponse = useCallback(async (response: GoogleCredentialResponse) => {
    try {
      setIsLoading(true);
      
      // Decode the JWT token to get user info
      const userInfo = parseJwt(response.credential);
      
      // Get access token for Google Drive API
      const accessToken = await getAccessToken();
      
      const userData: User = {
        id: userInfo.sub,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        accessToken: accessToken,
      };

      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('Snappixy_user', JSON.stringify(userData));
    } catch (error) {
      console.error('Authentication failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize Google Identity Services
  useEffect(() => {
    const initializeGoogleAuth = async () => {
      try {
        // Load Google Identity Services script
        if (!(window as any).google) {
          await loadGoogleScript();
        }

        // Initialize Google Identity Services
        (window as any).google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Check if user is already logged in
        const savedUser = localStorage.getItem('Snappixy_user');
        console.log('AuthProvider: Checking localStorage for saved user:', savedUser);
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          console.log('AuthProvider: Parsed user:', parsedUser);
          if (parsedUser.id) {
            console.log('AuthProvider: Setting user as authenticated');
            setUser(parsedUser);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Failed to initialize Google Auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeGoogleAuth();
  }, [handleCredentialResponse]);

  const loadGoogleScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (document.getElementById('google-script')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.id = 'google-script';
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google script'));
      document.head.appendChild(script);
    });
  };

  const getAccessToken = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!(window as any).google?.accounts?.oauth2) {
        reject(new Error('Google OAuth2 not available'));
        return;
      }

      (window as any).google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/drive',
        callback: (response: GoogleTokenResponse) => {
          if (response.access_token) {
            resolve(response.access_token);
          } else {
            reject(new Error('Failed to get access token'));
          }
        },
      }).requestAccessToken();
    });
  };

  const parseJwt = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Failed to parse JWT:', error);
      return {};
    }
  };

  const login = () => {
    if ((window as any).google?.accounts?.id) {
      (window as any).google.accounts.id.prompt();
    } else {
      console.error('Google Identity Services not loaded');
    }
  };

  // Function to refresh Google Drive access token
  const refreshGoogleDriveToken = useCallback((): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!window.google?.accounts?.oauth2) {
        reject(new Error('Google OAuth2 not available. Please refresh the page and try again.'));
        return;
      }

      try {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
          scope: 'https://www.googleapis.com/auth/drive',
          callback: (response: GoogleTokenResponse) => {
            if (response.access_token) {
              console.log('Successfully refreshed Google Drive access token');
              // Update user with new token
              if (user) {
                const updatedUser = { ...user, accessToken: response.access_token };
                setUser(updatedUser);
                localStorage.setItem('Snappixy_user', JSON.stringify(updatedUser));
              }
              resolve(response.access_token);
            } else {
              console.error('Failed to refresh access token:', (response as any).error);
              reject(new Error((response as any).error || 'Failed to refresh access token. Please sign in again.'));
            }
          },
        });
        
        console.log('Requesting new access token...');
        client.requestAccessToken();
      } catch (error) {
        console.error('Error initializing token refresh:', error);
        reject(new Error('Unable to refresh authentication. Please sign in again.'));
      }
    });
  }, [user]);

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('Snappixy_user');
    localStorage.removeItem('Snappixy_token');
    
    if ((window as any).google?.accounts?.id) {
      (window as any).google.accounts.id.disableAutoSelect();
    }
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshGoogleDriveToken,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
