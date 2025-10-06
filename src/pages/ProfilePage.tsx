import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Chip,
} from '@mui/material';
import {
  Person,
  CloudSync,
  Security,
  Notifications,
  Storage,
  AccountCircle,
} from '@mui/icons-material';
import { useAuth } from '../contexts/useAuth';
import EnhancedLoginComponent from '../components/EnhancedLoginComponent';
import AuthDebugger from '../components/AuthDebugger';

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [requestingDriveAccess, setRequestingDriveAccess] = useState(false);
  const [showDebugInfo, setShowDebugInfo] = useState(false);

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
            const updatedUser = { ...user, accessToken: response.access_token };
            localStorage.setItem('Snappixy_user', JSON.stringify(updatedUser));
            window.location.reload();
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

  const revokeGoogleDriveAccess = () => {
    if (user) {
      const updatedUser = { ...user, accessToken: undefined };
      localStorage.setItem('Snappixy_user', JSON.stringify(updatedUser));
      window.location.reload();
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Profile Settings
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Please sign in to access your profile settings.
        </Typography>
        <EnhancedLoginComponent />
      </Container>
    );
  }

  const hasValidAccessToken = user.accessToken && user.accessToken.startsWith('ya29');

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <Person sx={{ mr: 2 }} />
        Profile Settings
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Information */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar
                src={user.picture}
                alt={user.name}
                sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
              />
              <Typography variant="h5" gutterBottom>
                {user.name}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {user.email}
              </Typography>
              <Chip
                label={hasValidAccessToken ? 'Google Drive Connected' : 'Google Drive Disconnected'}
                color={hasValidAccessToken ? 'success' : 'default'}
                variant="outlined"
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Settings */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Account Settings
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <AccountCircle />
                  </ListItemIcon>
                  <ListItemText
                    primary="Account Information"
                    secondary={`Signed in as ${user.email}`}
                  />
                </ListItem>

                <Divider />

                <ListItem>
                  <ListItemIcon>
                    <CloudSync />
                  </ListItemIcon>
                  <ListItemText
                    primary="Google Drive Integration"
                    secondary={
                      hasValidAccessToken
                        ? 'Connected - You can access and manage your Google Drive images'
                        : 'Disconnected - Connect to access your Google Drive images'
                    }
                  />
                  <ListItemSecondaryAction>
                    {hasValidAccessToken ? (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={revokeGoogleDriveAccess}
                        size="small"
                      >
                        Disconnect
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        onClick={requestGoogleDriveAccess}
                        disabled={requestingDriveAccess}
                        startIcon={requestingDriveAccess ? <CircularProgress size={20} /> : <CloudSync />}
                        size="small"
                      >
                        {requestingDriveAccess ? 'Connecting...' : 'Connect'}
                      </Button>
                    )}
                  </ListItemSecondaryAction>
                </ListItem>

                <Divider />

                <ListItem>
                  <ListItemIcon>
                    <Storage />
                  </ListItemIcon>
                  <ListItemText
                    primary="Storage Permissions"
                    secondary="Manage what data the app can access in your Google Drive"
                  />
                </ListItem>

                <Divider />

                <ListItem>
                  <ListItemIcon>
                    <Security />
                  </ListItemIcon>
                  <ListItemText
                    primary="Privacy & Security"
                    secondary="Your data is processed locally and securely"
                  />
                </ListItem>

                <Divider />

                <ListItem>
                  <ListItemIcon>
                    <Notifications />
                  </ListItemIcon>
                  <ListItemText
                    primary="Notifications"
                    secondary="Get notified about optimization completions"
                  />
                  <ListItemSecondaryAction>
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label=""
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Google Drive Status */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <CloudSync sx={{ mr: 1 }} />
                Google Drive Connection Status
              </Typography>

              {hasValidAccessToken ? (
                <Alert severity="success" sx={{ mb: 2 }}>
                  <Typography variant="body1" gutterBottom>
                    ✓ Successfully connected to Google Drive
                  </Typography>
                  <Typography variant="body2">
                    You can now access, view, and optimize images from your Google Drive.
                    The app has permission to read your images and save optimized versions.
                  </Typography>
                </Alert>
              ) : (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  <Typography variant="body1" gutterBottom>
                    Google Drive not connected
                  </Typography>
                  <Typography variant="body2">
                    Connect your Google Drive to access and optimize your images.
                    The app will request permission to read and modify your Drive files.
                  </Typography>
                </Alert>
              )}

              <Typography variant="subtitle2" gutterBottom sx={{ mt: 3 }}>
                Requested Permissions:
              </Typography>
              <Box sx={{ pl: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  • <strong>Read access:</strong> View and download your images
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  • <strong>Write access:</strong> Save optimized versions of your images
                </Typography>
                <Typography variant="body2">
                  • <strong>File management:</strong> Create folders and organize optimized images
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Debug Information (Developer Mode) */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Developer Debug Information
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={showDebugInfo}
                      onChange={(e) => setShowDebugInfo(e.target.checked)}
                    />
                  }
                  label="Show Debug Info"
                />
              </Box>

              {showDebugInfo && <AuthDebugger />}
            </CardContent>
          </Card>
        </Grid>

        {/* Account Actions */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color="error">
              Account Actions
            </Typography>
            <Button
              variant="outlined"
              color="error"
              onClick={logout}
              sx={{ mr: 2 }}
            >
              Sign Out
            </Button>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Signing out will remove all local data and disconnect Google Drive access.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfilePage;
