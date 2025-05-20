import { MantineProvider as BaseMantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext/index';

const lightTheme = createTheme({
  primaryColor: 'blue',
  defaultRadius: 'md',
  white: '#ffffff',
//  colorScheme: 'light',
  colors: {
    // Add your custom colors here
    blue: ['#E7F5FF', '#D0EBFF', '#A5D8FF', '#74C0FC', '#4DABF7', '#339AF0', '#228BE6', '#1C7ED6', '#1971C2', '#1864AB'],
    gray: ['#F8F9FA', '#F1F3F5', '#E9ECEF', '#DEE2E6', '#CED4DA', '#ADB5BD', '#868E96', '#495057', '#343A40', '#212529'],
  },
  shadows: {
    md: '0 2px 4px rgba(0,0,0,0.1)',
    lg: '0 4px 8px rgba(0,0,0,0.1)',
    xl: '0 8px 16px rgba(0,0,0,0.1)',
  },
  fontFamily: 'Inter, sans-serif',
  components: {
    Button: {
      defaultProps: {
        size: 'sm',
      },
    },
    TextInput: {
      defaultProps: {
        size: 'sm',
      },
    },
    Select: {
      defaultProps: {
        size: 'sm',
      },
    },
  },
});
const darkTheme = createTheme({
  ...lightTheme,
  //colorScheme: 'dark',
  colors: {
    ...lightTheme.colors,
    dark: [
      '#C1C2C5',
      '#A6A7AB',
      '#909296',
      '#5C5F66',
      '#373A40',
      '#2C2E33',
      '#25262B',
      '#1A1B1E',
      '#141517',
      '#101113',
    ],
  },
});
export function MantineProvider({ children }: { children: React.ReactNode }) {
  const { darkMode } = useContext(ThemeContext);
  return (
    <BaseMantineProvider
      theme={darkMode ? darkTheme : lightTheme}
    >
      <Notifications position="top-right" />
      {children}
    </BaseMantineProvider>
  );
}