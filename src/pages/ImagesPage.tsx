import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import SimpleImageViewer from '../components/SimpleImageViewer.tsx';

const ImagesPage: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ px: 4 }}>
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" gutterBottom>
          My Google Drive Images
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          View, download, and manage your Google Drive images.
        </Typography>
        
        <SimpleImageViewer />
      </Box>
    </Container>
  );
};

export default ImagesPage;
