import 'src/global.css';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import ThemeProvider from 'src/theme';
import Router from 'src/routes/sections';
import { AuthContextProvider } from './contexts/userContext';
import { ToastContainer } from 'react-toastify';
// ---------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  return (
    <ThemeProvider>
      <AuthContextProvider>
        <Router />
      </AuthContextProvider>
      <ToastContainer />
    </ThemeProvider>
  );
}
