import React from 'react';
import { Box, Typography, Alert, Button, Paper } from '@mui/material';
import { useAuth } from '../contexts/useAuth';

const AuthDebugger: React.FC = () => {
  const { user, isAuthenticated, isLoading, login } = useAuth();

  const debugInfo = {
    isAuthenticated,
    isLoading,
    hasUser: !!user,
    userEmail: user?.email || 'Not available',
    hasAccessToken: !!user?.accessToken,
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    googleLoaded: !!window.google?.accounts?.id,
  };

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h6" gutterBottom>
        Authentication Debug Information
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" component="pre" sx={{ 
          backgroundColor: '#f5f5f5', 
          p: 2, 
          borderRadius: 1,
          fontSize: '12px',
          whiteSpace: 'pre-wrap'
        }}>
          {JSON.stringify(debugInfo, null, 2)}
        </Typography>
      </Box>

      {!isAuthenticated && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Not authenticated. Click the login button below to test authentication.
        </Alert>
      )}

      {!debugInfo.googleLoaded && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Google Identity Services not loaded. Check your internet connection and Google Client ID.
        </Alert>
      )}

      {!debugInfo.clientId || debugInfo.clientId.includes('your-google-client-id') && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Invalid Google Client ID in environment variables.
        </Alert>
      )}

      <Button variant="contained" onClick={login} disabled={isLoading}>
        Test Login
      </Button>
    </Paper>
  );
};

export default AuthDebugger;
