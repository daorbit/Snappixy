import React, { useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Divider,
  Alert,
  CircularProgress,
  Button,
} from '@mui/material';
import { Google } from '@mui/icons-material';
import { useAuth } from '../contexts/useAuth.ts';
import { useNavigate } from 'react-router-dom';
import GoogleSignInButton from '../components/GoogleSignInButton.tsx';

const LoginPage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Check authentication on mount and when storage changes
  useEffect(() => {
    console.log('LoginPage: Component mounted, checking authentication state');
    console.log('LoginPage: isAuthenticated =', isAuthenticated, 'isLoading =', isLoading);
    
    // Also manually check localStorage
    const savedUser = localStorage.getItem('Snappixy_user');
    console.log('LoginPage: savedUser in localStorage:', savedUser);
    
    if (isAuthenticated && !isLoading) {
      console.log('LoginPage: User is authenticated, navigating to dashboard...');
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Listen for storage changes (in case auth happens in another tab)
  useEffect(() => {
    const handleStorageChange = () => {
      console.log('LoginPage: Storage changed, checking authentication...');
      const savedUser = localStorage.getItem('Snappixy_user');
      if (savedUser && !isAuthenticated) {
        console.log('LoginPage: Found user in storage, reloading page to update auth state');
        window.location.reload();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isAuthenticated]);

  const handleGoogleSuccess = (credential: string) => {
    try {
      console.log('LoginPage: Google sign-in successful');
      // Decode JWT token (this is a simple decode, in production you'd validate the signature)
      const payload = JSON.parse(atob(credential.split('.')[1]));
      
      const userData = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      };
      
      console.log('LoginPage: Storing user data and reloading page');
      localStorage.setItem('Snappixy_user', JSON.stringify(userData));
      localStorage.setItem('Snappixy_token', credential);
      window.location.reload(); // Refresh to trigger auth state update
    } catch (error) {
      console.error('Error handling Google sign-in:', error);
    }
  };

  const handleGoogleError = (error: Error) => {
    console.error('Google Sign-In error:', error);
    alert('Google Sign-In failed. Please try again.');
  };

  const handleDemoSignIn = () => {
    console.log('LoginPage: Demo sign-in initiated');
    // Demo user data
    const demoUserData = {
      id: 'demo-user-123',
      email: 'demo@Snappixy.com',
      name: 'Demo User',
      picture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    };
    
    console.log('LoginPage: Storing demo user data');
    localStorage.setItem('Snappixy_user', JSON.stringify(demoUserData));
    localStorage.setItem('Snappixy_token', 'demo-token');
    
    // Force navigation to dashboard
    console.log('LoginPage: Navigating to dashboard');
    navigate('/dashboard');
    
    // Fallback: reload page if navigation doesn't work
    setTimeout(() => {
      if (window.location.pathname === '/login') {
        console.log('LoginPage: Still on login page, reloading...');
        window.location.reload();
      }
    }, 1000);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
          px: { xs: 2, sm: 3 },
        }}
      >
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading authentication...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        px: { xs: 2, sm: 3 },
        py: { xs: 3, sm: 4 },
      }}
    >
      <Container maxWidth="sm">
        <Paper 
          elevation={3} 
          sx={{ 
            p: { xs: 3, sm: 4, md: 5 },
            width: '100%',
            maxWidth: '500px',
            mx: 'auto',
            borderRadius: 2,
            bgcolor: 'background.paper',
            border: (theme) => theme.palette.mode === 'dark' ? '1px solid rgba(139, 92, 246, 0.2)' : 'none',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom
              sx={{
                fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' },
                fontWeight: 600,
              }}
            >
              Welcome to Snappixy
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{
                fontSize: { xs: '0.875rem', sm: '1rem' },
              }}
            >
              Sign in to access your image optimization tools
            </Typography>
          </Box>

          {!import.meta.env.VITE_GOOGLE_CLIENT_ID || import.meta.env.VITE_GOOGLE_CLIENT_ID === 'your-google-client-id.apps.googleusercontent.com' ? (
            <Alert severity="info" sx={{ mb: 3 }}>
              Demo Mode: Google OAuth is not configured. Click the demo button below to test the application.
            </Alert>
          ) : null}

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
            {import.meta.env.VITE_GOOGLE_CLIENT_ID && import.meta.env.VITE_GOOGLE_CLIENT_ID !== 'your-google-client-id.apps.googleusercontent.com' ? (
              <GoogleSignInButton
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                text="signin_with"
                theme="outline"
                size="large"
              />
            ) : (
              <Button
                variant="outlined"
                size="large"
                startIcon={<Google />}
                onClick={handleDemoSignIn}
                sx={{
                  width: '300px',
                  height: '48px',
                  borderColor: 'divider',
                  color: 'text.primary',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'action.hover',
                  },
                }}
              >
                Sign in with Google (Demo)
              </Button>
            )}
          </Box>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
              }}
            >
              By signing in, you agree to our Terms of Service and Privacy Policy
            </Typography>
          </Box>

          <Box 
            sx={{ 
              mt: 4, 
              p: { xs: 2, sm: 3 }, 
              bgcolor: (theme) => theme.palette.mode === 'dark' 
                ? 'rgba(139, 92, 246, 0.1)' 
                : 'grey.50', 
              borderRadius: 1,
              border: (theme) => theme.palette.mode === 'dark' 
                ? '1px solid rgba(139, 92, 246, 0.2)' 
                : 'none',
            }}
          >
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{
                fontSize: { xs: '1rem', sm: '1.125rem' },
                fontWeight: 600,
              }}
            >
              Why use Snappixy?
            </Typography>
            <Box component="ul" sx={{ pl: 2.5, m: 0 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography 
                  variant="body2"
                  sx={{
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  }}
                >
                  Optimize images with AI-powered compression
                </Typography>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography 
                  variant="body2"
                  sx={{
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  }}
                >
                  Create stunning thumbnails automatically
                </Typography>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography 
                  variant="body2"
                  sx={{
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  }}
                >
                  Seamless Google Drive integration
                </Typography>
              </Box>
              <Box component="li">
                <Typography 
                  variant="body2"
                  sx={{
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  }}
                >
                  Save time with batch processing
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
