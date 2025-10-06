import React, { useState, useEffect, type ReactNode } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ThemeContext, type ThemeContextType } from "./ThemeContext.tsx";

interface ThemeContextProviderProps {
  children: ReactNode;
}

const THEME_STORAGE_KEY = "Snappixy_theme_preference";

const ThemeContextProvider: React.FC<ThemeContextProviderProps> = ({
  children,
}) => {
  // Initialize theme from localStorage or default to dark mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      return savedTheme ? JSON.parse(savedTheme) : true;
    } catch (error) {
      console.warn("Failed to load theme preference from localStorage:", error);
      return true;
    }
  });

  // Save theme preference to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(isDarkMode));
    } catch (error) {
      console.warn("Failed to save theme preference to localStorage:", error);
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
      primary: {
        main: "#8B5CF6",
        light: "#A78BFA",
        dark: "#7C3AED",
        contrastText: "#FFFFFF",
      },
      secondary: {
        main: "#D946EF",
        light: "#F3E8FF",
        dark: "#C026D3",
        contrastText: "#FFFFFF",
      },
      background: {
        default: isDarkMode ? "#121212" : "#FAFAFA",
        paper: isDarkMode ? "#181818" : "#FFFFFF",
      },
      text: {
        primary: isDarkMode ? "#FFFFFF" : "#212121",
        secondary: isDarkMode ? "#B0B0B0" : "#757575",
      },
    },
    typography: {
      fontFamily: [
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
      ].join(","),
      h1: {
        fontSize: "3rem",
        fontWeight: 700,
        "@media (max-width:600px)": {
          fontSize: "2.2rem",
        },
      },
      h2: {
        fontSize: "2.5rem",
        fontWeight: 600,
        "@media (max-width:600px)": {
          fontSize: "1.8rem",
        },
      },
      h3: {
        fontSize: "2rem",
        fontWeight: 600,
        "@media (max-width:600px)": {
          fontSize: "1.5rem",
        },
      },
      h4: {
        fontSize: "1.7rem",
        fontWeight: 500,
        "@media (max-width:600px)": {
          fontSize: "1.3rem",
        },
      },
      h5: {
        fontSize: "1.4rem",
        fontWeight: 500,
        "@media (max-width:600px)": {
          fontSize: "1.1rem",
        },
      },
      h6: {
        fontSize: "1.2rem",
        fontWeight: 500,
        "@media (max-width:600px)": {
          fontSize: "1rem",
        },
      },
      body1: {
        fontSize: "1rem",
        lineHeight: 1.6,
        "@media (max-width:600px)": {
          fontSize: "0.9rem",
        },
      },
      body2: {
        fontSize: "0.875rem",
        lineHeight: 1.5,
        "@media (max-width:600px)": {
          fontSize: "0.8rem",
        },
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 600,
            padding: "7px 24px",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
               boxShadow: "0 8px 25px rgba(139, 92, 246, 0.4)",
              color: "inherit",
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: "16px",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            background: isDarkMode
              ? "linear-gradient(to right, rgba(39,39,42,0.4), rgba(63,63,70,0.2))"
              : "#fff",
            "&:hover": {
              transform: "scale(1)",
              boxShadow: "0 0 20px 5px transparent",
              transition: "all 0.3s ease",
            },
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
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;
