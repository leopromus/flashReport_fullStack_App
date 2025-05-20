import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';

interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  toggleDarkMode: () => {},
});

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeContextProviderProps {
  children: ReactNode;
}

export const ThemeContextProvider: React.FC<ThemeContextProviderProps> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('darkMode');
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#6366F1',
        dark: '#4F46E5',
        light: '#818CF8',
      },
      secondary: {
        main: '#4F46E5',
        dark: '#4338CA',
        light: '#6366F1',
      },
      background: {
        default: darkMode ? '#121212' : '#F3F4F6',
        paper: darkMode ? '#1E1E1E' : '#FFFFFF',
      },
    },
    typography: {
      fontFamily: [
        'MTNBrighterSans',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      h1: {
        fontFamily: 'MTNBrighterSans, sans-serif',
        fontWeight: 700,
        letterSpacing: '-0.02em',
        lineHeight: 1.2,
      },
      h2: {
        fontFamily: 'MTNBrighterSans, sans-serif',
        fontWeight: 700,
        letterSpacing: '-0.02em',
        lineHeight: 1.2,
      },
      h3: {
        fontFamily: 'MTNBrighterSans, sans-serif',
        fontWeight: 700,
        letterSpacing: '-0.02em',
        lineHeight: 1.3,
      },
      h4: {
        fontFamily: 'MTNBrighterSans, sans-serif',
        fontWeight: 700,
        letterSpacing: '-0.01em',
        lineHeight: 1.3,
      },
      h5: {
        fontFamily: 'MTNBrighterSans, sans-serif',
        fontWeight: 700,
        letterSpacing: '-0.01em',
        lineHeight: 1.4,
      },
      h6: {
        fontFamily: 'MTNBrighterSans, sans-serif',
        fontWeight: 700,
        letterSpacing: '-0.01em',
        lineHeight: 1.4,
      },
      button: {
        fontFamily: 'MTNBrighterSans, sans-serif',
        fontWeight: 700,
        letterSpacing: '0.02em',
        textTransform: 'none',
      },
      subtitle1: {
        fontFamily: 'MTNBrighterSans, sans-serif',
        fontWeight: 700,
        letterSpacing: '0.01em',
      },
      subtitle2: {
        fontFamily: 'MTNBrighterSans, sans-serif',
        fontWeight: 700,
        letterSpacing: '0.01em',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            fontFamily: 'MTNBrighterSans, sans-serif',
            fontWeight: 700,
            letterSpacing: '0.02em',
            textTransform: 'none',
            borderRadius: '8px',
          },
        },
      },
      MuiTypography: {
        defaultProps: {
          variantMapping: {
            h1: 'h1',
            h2: 'h2',
            h3: 'h3',
            h4: 'h4',
            h5: 'h5',
            h6: 'h6',
            subtitle1: 'p',
            subtitle2: 'p',
            body1: 'p',
            body2: 'p',
          },
        },
      },
    },
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeContext; 