import { Helmet } from 'react-helmet-async';

import { LoginView } from 'src/sections/login';

// ----------------------------------------------------------------------

export default function LoginPage() {
  const deleteCookie = (cookieName) => {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  }
  deleteCookie('token');
  return (
    <>
      <Helmet>
        <title> Login </title>
      </Helmet>
      {localStorage.clear()}
      <LoginView />
    </>
  );
}
