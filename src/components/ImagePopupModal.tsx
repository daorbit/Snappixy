import React from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
} from '@mui/material';
import { Close } from '@mui/icons-material';

interface ImagePopupModalProps {
  open: boolean;
  src: string;
  alt: string;
  onClose: () => void;
}

const ImagePopupModal: React.FC<ImagePopupModalProps> = ({
  open,
  src,
  alt,
  onClose,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
    >
      <DialogContent sx={{ p: 0, position: 'relative' }}>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.7)',
            },
            zIndex: 1,
          }}
        >
          <Close />
        </IconButton>
        <Box
          component="img"
          src={src}
          alt={alt}
          sx={{
            width: '100%',
            height: 'auto',
            maxHeight: '80vh',
            objectFit: 'contain',
            display: 'block',
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ImagePopupModal;