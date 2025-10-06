import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/useTheme.tsx';

const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const theme = useMuiTheme();

  return (
    <Tooltip title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
      <IconButton
        onClick={toggleTheme}
        color="inherit"
        sx={{
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'scale(1.1)',
            filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.5))',
          },
        }}
      >
        {isDarkMode ? (
          <Sun size={24} color={theme.palette.warning.main} />
        ) : (
          <Moon size={24} color={theme.palette.primary.main} />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
