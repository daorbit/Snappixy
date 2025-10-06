import React, { useState, ReactNode } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ThemeContext, type ThemeContextType } from './ThemeContext.tsx';

interface ThemeContextProviderProps {
  children: ReactNode;
}

const ThemeContextProvider: React.FC<ThemeContextProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: '#8B5CF6', // Purple primary color
        light: '#C4B5FD',
        dark: '#6D28D9',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#D946EF', // Magenta secondary color
        light: '#F3E8FF',
        dark: '#A21CAF',
        contrastText: '#000000',
      },
      background: {
        default: isDarkMode ? '#121212' : '#FAFAFA',
        paper: isDarkMode ? '#1E1E1E' : '#FFFFFF',
      },
      text: {
        primary: isDarkMode ? '#FFFFFF' : '#212121',
        secondary: isDarkMode ? '#B0B0B0' : '#757575',
      },
    },
    typography: {
      fontFamily: [
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      h1: {
        fontSize: '3rem',
        fontWeight: 700,
        '@media (max-width:600px)': {
          fontSize: '2.2rem',
        },
      },
      h2: {
        fontSize: '2.5rem',
        fontWeight: 600,
        '@media (max-width:600px)': {
          fontSize: '1.8rem',
        },
      },
      h3: {
        fontSize: '2rem',
        fontWeight: 600,
        '@media (max-width:600px)': {
          fontSize: '1.5rem',
        },
      },
      h4: {
        fontSize: '1.7rem',
        fontWeight: 500,
        '@media (max-width:600px)': {
          fontSize: '1.3rem',
        },
      },
      h5: {
        fontSize: '1.4rem',
        fontWeight: 500,
        '@media (max-width:600px)': {
          fontSize: '1.1rem',
        },
      },
      h6: {
        fontSize: '1.2rem',
        fontWeight: 500,
        '@media (max-width:600px)': {
          fontSize: '1rem',
        },
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
        '@media (max-width:600px)': {
          fontSize: '0.9rem',
        },
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.5,
        '@media (max-width:600px)': {
          fontSize: '0.8rem',
        },
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '25px',
            textTransform: 'none',
            fontWeight: 600,
            padding: '10px 24px',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: isDarkMode 
                ? '0 8px 25px rgba(139, 92, 246, 0.4)'
                : '0 8px 25px rgba(139, 92, 246, 0.3)',
            },
            '&.MuiButton-contained': {
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                transition: 'left 0.5s',
              },
              '&:hover::before': {
                left: '100%',
              },
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '16px',
            boxShadow: isDarkMode 
              ? '0 4px 20px rgba(0, 0, 0, 0.3)'
              : '0 4px 20px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: isDarkMode 
                ? '0 12px 30px rgba(139, 92, 246, 0.2)'
                : '0 12px 30px rgba(139, 92, 246, 0.15)',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isDarkMode ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderBottom: isDarkMode ? '1px solid rgba(139, 92, 246, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },
  });

  const contextValue: ThemeContextType = {
    isDarkMode,
    toggleTheme,
    theme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;
