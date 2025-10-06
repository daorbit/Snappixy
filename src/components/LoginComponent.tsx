import React from 'react';
import { Box, Button, Typography, Paper, Avatar } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/useAuth.ts';

const LoginComponent: React.FC = () => {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (isAuthenticated && user) {
    return (
      <Paper sx={{ p: 3, maxWidth: 400, mx: 'auto', textAlign: 'center' }}>
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
        <Button 
          variant="outlined" 
          onClick={logout}
          sx={{ mt: 2 }}
        >
          Sign Out
        </Button>
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
        sx={{
          backgroundColor: '#4285f4',
          '&:hover': {
            backgroundColor: '#3367d6',
          },
        }}
      >
        Sign in with Google
      </Button>
    </Paper>
  );
};

export default LoginComponent;
