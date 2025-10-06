import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  onMobileMenuToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMobileMenuToggle }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)'
          : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'text.primary',
        height: 61,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: '64px !important' }}>
        {/* Mobile Menu Button */}
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onMobileMenuToggle}
            sx={{
              mr: 2,
              display: { md: 'none' },
              color: 'text.primary',
              minHeight: 44,
              minWidth: 44,
            }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Spacer for non-mobile */}
        {!isMobile && <div />}
        
        {/* Profile Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {isAuthenticated && user ? (
            <>
              <IconButton
                size="large"
                onClick={() => navigate('/profile')}
                sx={{
                  p: 0.5,
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <Avatar
                  src={user.picture}
                  alt={user.name}
                  sx={{ 
                    width: 38, 
                    height: 38,
                    border: '2px solid',
                    borderColor: 'primary.main',
                  }}
                />
              </IconButton>
            </>
          ) : (
            <IconButton
              onClick={() => navigate('/login')}
              sx={{
                color: 'text.primary',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <Avatar sx={{ 
                width: 40, 
                height: 40,
                bgcolor: 'grey.300',
              }}>
                ?
              </Avatar>
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
