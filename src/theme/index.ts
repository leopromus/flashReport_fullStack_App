import { createTheme } from '@mui/material/styles';

const theme = createTheme({
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
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h1: {
      fontFamily: 'MTNBrighterSans, sans-serif',
      fontWeight: 'bold',
    },
    h2: {
      fontFamily: 'MTNBrighterSans, sans-serif',
      fontWeight: 'bold',
    },
    h3: {
      fontFamily: 'MTNBrighterSans, sans-serif',
      fontWeight: 'bold',
    },
    h4: {
      fontFamily: 'MTNBrighterSans, sans-serif',
      fontWeight: 'bold',
    },
    h5: {
      fontFamily: 'MTNBrighterSans, sans-serif',
      fontWeight: 'bold',
    },
    h6: {
      fontFamily: 'MTNBrighterSans, sans-serif',
      fontWeight: 'bold',
    },
    button: {
      fontFamily: 'MTNBrighterSans, sans-serif',
      fontWeight: 'bold',
    },
  },
});

export default theme; 