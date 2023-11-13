import 'src/global.css';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import Router from 'src/routes/sections';
import ThemeProvider from 'src/theme';
import { UserContextProvider } from './contexts/userContext';


// ---------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  return (
    <ThemeProvider>
      <UserContextProvider>
        <Router />
      </UserContextProvider>
    </ThemeProvider>
  );
}
