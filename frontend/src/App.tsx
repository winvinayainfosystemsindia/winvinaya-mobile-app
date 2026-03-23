import { Provider } from 'react-redux';
import { store } from './store/store';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { SnackbarProvider } from 'notistack';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './router/AppRouter';
import { AuthProvider } from './context/AuthContext';
import { AuthInitializer } from './components/auth';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider maxSnack={3}>
          <Router>
              <AuthProvider>
                <AuthInitializer>
                  <AppRouter />
                </AuthInitializer>
              </AuthProvider>
          </Router>
        </SnackbarProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
