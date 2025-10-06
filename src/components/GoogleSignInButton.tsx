import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';

interface GoogleSignInButtonProps {
  onSuccess: (credential: string) => void;
  onError?: (error: Error) => void;
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  theme?: 'outline' | 'filled_blue' | 'filled_black' | 'purple_gradient';
  size?: 'large' | 'medium' | 'small';
  shape?: 'rectangular' | 'pill' | 'circle' | 'square';
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onSuccess,
  onError,
  text = 'signin_with',
  theme = 'purple_gradient',
  size = 'large',
  shape = 'rectangular',
}) => {
  const buttonRef = useRef<HTMLDivElement>(null);

  const isPurpleGradient = theme === 'purple_gradient';
  const googleTheme = isPurpleGradient ? 'outline' : theme;

  useEffect(() => {
    const initializeButton = () => {
      if (window.google?.accounts?.id && buttonRef.current) {
        try {
          const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
          
          if (!clientId || clientId === 'your-google-client-id.apps.googleusercontent.com') {
            console.error('Google Client ID not configured');
            return;
          }

          console.log('Initializing Google Sign-In button with Client ID:', clientId);

          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: (response: { credential: string }) => {
              console.log('Google Sign-In successful');
              onSuccess(response.credential);
            },
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          // Clear any existing content
          buttonRef.current.innerHTML = '';

          window.google.accounts.id.renderButton(buttonRef.current, {
            theme: googleTheme,
            size,
            type: 'standard',
            text,
            shape,
            logo_alignment: 'left',
            width: 300,
          });

          console.log('Google Sign-In button rendered successfully');
        } catch (error) {
          console.error('Error initializing Google Sign-In button:', error);
          if (onError) onError(error instanceof Error ? error : new Error('Unknown error occurred'));
        }
      }
    };

    // Check if Google script is already loaded
    if (window.google?.accounts?.id) {
      initializeButton();
    } else {
      // Load Google Identity script
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log('Google Identity script loaded for button');
        setTimeout(initializeButton, 100);
      };
      script.onerror = () => {
        console.error('Failed to load Google Identity script for button');
        if (onError) onError(new Error('Failed to load Google script'));
      };
      
      // Only add script if it's not already added
      if (!document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
        document.head.appendChild(script);
      } else {
        setTimeout(initializeButton, 100);
      }
    }
  }, [onSuccess, onError, text, theme, googleTheme, size, shape]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        position: 'relative',
      }}
    >
      {isPurpleGradient ? (
        /* Purple gradient wrapper */
        <Box
          sx={{
            position: 'relative',
            borderRadius: '6px',
            background: 'linear-gradient(45deg, #8B5CF6 30%, #D946EF 90%)',
            padding: '2px',
            boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              boxShadow: '0 6px 25px rgba(139, 92, 246, 0.6)',
              transform: 'translateY(-2px)',
            },
          }}
        >
          <Box
            ref={buttonRef}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '48px',
              width: '100%',
              borderRadius: '4px',
              overflow: 'hidden',
              '& > div': {
                margin: '0 auto',
                borderRadius: '4px !important',
              },
              '& iframe': {
                margin: '0 auto !important',
                borderRadius: '4px !important',
              },
              // Override Google button styles to match our gradient
              '& div[role="button"]': {
                borderRadius: '4px !important',
                border: 'none !important',
                boxShadow: 'none !important',
              },
            }}
          />
        </Box>
      ) : (
        /* Standard Google button */
        <Box
          ref={buttonRef}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '48px',
            width: '100%',
            '& > div': {
              margin: '0 auto',
            },
            '& iframe': {
              margin: '0 auto !important',
            },
          }}
        />
      )}
    </Box>
  );
};

export default GoogleSignInButton;
