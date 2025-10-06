import React, { useState, useEffect, useCallback, type ReactNode } from 'react';
import { type AuthContextType, type User } from '../types/index.ts';
import { AuthContext } from './AuthContextProvider.ts';

interface CredentialResponse {
  credential: string;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [googleLoaded, setGoogleLoaded] = useState(false);
  // const [tokenClient, setTokenClient] = useState<any>(null);

  // Function to refresh Google Drive access token
  const refreshGoogleDriveToken = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!window.google?.accounts?.oauth2) {
        reject(new Error('Google OAuth2 not available. Please refresh the page and try again.'));
        return;
      }

      try {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
          scope: 'https://www.googleapis.com/auth/drive',
          callback: (response: { access_token?: string; error?: string }) => {
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
              console.error('Failed to refresh access token:', response.error);
              reject(new Error(response.error || 'Failed to refresh access token. Please sign in again.'));
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
  };

  const handleCredentialResponse = useCallback((response: CredentialResponse) => {
    console.log('Received credential response');
    try {
      const credential = response.credential;
      // Decode JWT token (this is a simple decode, in production you'd validate the signature)
      const payload = JSON.parse(atob(credential.split('.')[1]));
      
      const userData: User = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        // Initially set JWT token, but we need a proper access token
        accessToken: credential,
      };
      
      console.log('User data extracted:', userData);
      
      // First set the user with basic info
      setUser(userData);
      localStorage.setItem('Snappixy_user', JSON.stringify(userData));
      localStorage.setItem('Snappixy_token', credential);
      
      // Immediately try to get a proper Google Drive access token
      console.log('Attempting to get Google Drive access token...');
      getGoogleDriveAccessToken().then((accessToken: string | null) => {
        if (accessToken) {
          console.log('Successfully obtained Google Drive access token');
          const updatedUser = { ...userData, accessToken };
          setUser(updatedUser);
          localStorage.setItem('Snappixy_user', JSON.stringify(updatedUser));
        } else {
          console.error('Failed to get Google Drive access token - user will need to manually authorize');
          // Set access token to null so components know authentication is incomplete
          const updatedUser = { ...userData, accessToken: undefined };
          setUser(updatedUser);
        }
      }).catch((error: Error) => {
        console.error('Error getting Google Drive access token:', error);
        // Set access token to null so components know authentication is incomplete
        const updatedUser = { ...userData, accessToken: undefined };
        setUser(updatedUser);
      });
    } catch (error) {
      console.error('Error handling credential response:', error);
    }
  }, []);

  useEffect(() => {
    // Check if user is already signed in
    const savedUser = localStorage.getItem('Snappixy_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('Snappixy_user');
      }
    }

    // Initialize Google Sign-In
    const initializeGoogleAuth = async () => {
      try {
        if (window.google?.accounts?.id) {
          const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
          console.log('Initializing Google Auth with Client ID:', clientId);
          
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });
          setGoogleLoaded(true);
          console.log('Google Auth initialized successfully');
        }
      } catch (error) {
        console.error('Failed to initialize Google Auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Load Google Identity script if not already loaded
    if (!window.google?.accounts?.id) {
      console.log('Loading Google Identity script...');
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log('Google Identity script loaded');
        setTimeout(initializeGoogleAuth, 100); // Small delay to ensure script is fully loaded
      };
      script.onerror = () => {
        console.error('Failed to load Google Identity script');
        setIsLoading(false);
      };
      document.head.appendChild(script);
    } else {
      initializeGoogleAuth();
    }
  }, [handleCredentialResponse]);

  const getGoogleDriveAccessToken = (): Promise<string | null> => {
    return new Promise((resolve, reject) => {
      if (!window.google?.accounts?.oauth2) {
        reject(new Error('Google OAuth2 not available'));
        return;
      }

      try {
        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
          scope: 'https://www.googleapis.com/auth/drive',
          callback: (response: { access_token?: string; error?: string }) => {
            if (response.access_token) {
              resolve(response.access_token);
            } else {
              reject(new Error(response.error || 'Failed to get access token'));
            }
          },
        });
        tokenClient.requestAccessToken();
      } catch (error) {
        reject(error);
      }
    });
  };

  const login = () => {
    console.log('Login attempt - Google loaded:', googleLoaded);
    
    if (!import.meta.env.VITE_GOOGLE_CLIENT_ID || import.meta.env.VITE_GOOGLE_CLIENT_ID === 'your-google-client-id.apps.googleusercontent.com') {
      console.log('No valid Google Client ID, showing alert');
      alert('Google OAuth is not properly configured. Please set up your Google Client ID in the .env file.');
      return;
    }

    if (window.google?.accounts?.id && googleLoaded) {
      try {
        console.log('Triggering Google Sign-In popup...');
        // First try to render button and click it programmatically
        const buttonContainer = document.createElement('div');
        buttonContainer.style.position = 'absolute';
        buttonContainer.style.top = '-9999px';
        buttonContainer.style.left = '-9999px';
        document.body.appendChild(buttonContainer);

        window.google.accounts.id.renderButton(buttonContainer, {
          theme: 'outline',
          size: 'large',
          type: 'standard',
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left',
        });

        // Try to trigger the button click
        setTimeout(() => {
          const button = buttonContainer.querySelector('div[role="button"]') as HTMLElement;
          if (button) {
            button.click();
          } else {
            // Fallback to prompt
            window.google.accounts.id.prompt((notification: { isNotDisplayed(): boolean; isSkippedMoment(): boolean }) => {
              console.log('Prompt notification:', notification);
              if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                console.log('Prompt was not displayed or skipped');
                // Try OAuth2 flow as final fallback
                initiateOAuth2Flow();
              }
            });
          }
          // Clean up
          setTimeout(() => {
            if (buttonContainer.parentNode) {
              buttonContainer.parentNode.removeChild(buttonContainer);
            }
          }, 1000);
        }, 100);

      } catch (error) {
        console.error('Error during login:', error);
        initiateOAuth2Flow();
      }
    } else {
      console.error('Google Identity not loaded');
      alert('Google authentication is not available. Please check your internet connection and try again.');
    }
  };

  const initiateOAuth2Flow = () => {
    console.log('Initiating OAuth2 flow as fallback');
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = window.location.origin;
    const scope = 'openid email profile';
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${encodeURIComponent(scope)}&` +
      `response_type=code&` +
      `state=google_signin`;
    
    window.location.href = authUrl;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('Snappixy_user');
    localStorage.removeItem('Snappixy_token');
    if (window.google?.accounts?.id) {
      try {
        window.google.accounts.id.disableAutoSelect();
      } catch (error) {
        console.error('Error during logout:', error);
      }
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshGoogleDriveToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
