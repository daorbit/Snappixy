import React, { useState } from 'react';
import { Box, Button, Typography, Paper, Avatar, Alert, CircularProgress } from '@mui/material';
import { Google as GoogleIcon, CloudSync } from '@mui/icons-material';
import { useAuth } from '../contexts/useAuth';

const EnhancedLoginComponent: React.FC = () => {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();
  const [requestingDriveAccess, setRequestingDriveAccess] = useState(false);

  const requestGoogleDriveAccess = async () => {
    if (!window.google?.accounts?.oauth2) {
      alert('Google OAuth2 not available');
      return;
    }

    setRequestingDriveAccess(true);
    try {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
        scope: 'https://www.googleapis.com/auth/drive',
        callback: (response: { access_token?: string; error?: string }) => {
          if (response.access_token && user) {
            // Update the user with the proper access token
            const updatedUser = { ...user, accessToken: response.access_token };
            localStorage.setItem('Snappixy_user', JSON.stringify(updatedUser));
            window.location.reload(); // Simple way to update the auth context
          } else {
            alert('Failed to get Google Drive access: ' + (response.error || 'Unknown error'));
          }
          setRequestingDriveAccess(false);
        },
      });
      tokenClient.requestAccessToken();
    } catch (error) {
      console.error('Error requesting Drive access:', error);
      setRequestingDriveAccess(false);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading...</Typography>
      </Box>
    );
  }

  if (isAuthenticated && user) {
    const hasValidAccessToken = user.accessToken && 
      user.accessToken.startsWith('ya29'); // Google access tokens start with ya29

    return (
      <Paper sx={{ p: 3, maxWidth: 500, mx: 'auto', textAlign: 'center' }}>
        <Avatar 
          src={user.picture} 
          alt={user.name}
          sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
        />
        <Typography variant="h6" gutterBottom>
          Welcome, {user.name}!
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {user.email}
        </Typography>
        
        {!hasValidAccessToken && (
          <Alert severity="warning" sx={{ mt: 2, mb: 2 }}>
            Google Drive access not yet authorized. Click below to access your images.
          </Alert>
        )}

        {hasValidAccessToken && (
          <Alert severity="success" sx={{ mt: 2, mb: 2 }}>
            ✓ Google Drive access authorized
          </Alert>
        )}

        <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center' }}>
          {!hasValidAccessToken && (
            <Button 
              variant="contained"
              startIcon={requestingDriveAccess ? <CircularProgress size={20} /> : <CloudSync />}
              onClick={requestGoogleDriveAccess}
              disabled={requestingDriveAccess}
              sx={{
                backgroundColor: '#4285f4',
                '&:hover': {
                  backgroundColor: '#3367d6',
                },
              }}
            >
              {requestingDriveAccess ? 'Authorizing...' : 'Authorize Google Drive'}
            </Button>
          )}
          
          <Button 
            variant="outlined" 
            onClick={logout}
          >
            Sign Out
          </Button>
        </Box>

        {/* Debug Info */}
        <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="caption" display="block">
            Access Token Status: {hasValidAccessToken ? '✓ Valid' : '✗ Invalid/Missing'}
          </Typography>
          <Typography variant="caption" display="block">
            Token Type: {user.accessToken?.substring(0, 10)}...
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 400, mx: 'auto', textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom>
        Sign in to access Google Drive
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Connect your Google account to fetch and optimize images from your Google Drive
      </Typography>
      <Button
        variant="contained"
        startIcon={<GoogleIcon />}
        onClick={login}
        size="large"
        disabled={isLoading}
        sx={{
          backgroundColor: '#4285f4',
          '&:hover': {
            backgroundColor: '#3367d6',
          },
        }}
      >
        {isLoading ? 'Signing in...' : 'Sign in with Google'}
      </Button>
    </Paper>
  );
};

export default EnhancedLoginComponent;
