import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Routes from './routes';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeContextProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './styles/fonts.css';

function App() {
  return (
    <Provider store={store}>
      <MantineProvider
        theme={{
          fontFamily: 'Open Sans, Arial, sans-serif',
          headings: { fontFamily: 'Open Sans, Arial, sans-serif' },
        }}
      >
        <Notifications />
        <ThemeContextProvider>
          <AuthProvider>
            <NotificationProvider>
              <Router>
                <Routes />
              </Router>
            </NotificationProvider>
          </AuthProvider>
        </ThemeContextProvider>
      </MantineProvider>
    </Provider>
  );
}

export default App;
