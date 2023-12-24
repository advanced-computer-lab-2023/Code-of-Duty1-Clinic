import { createContext, useState, useContext, useEffect } from 'react';

import { axiosInstance } from 'src/utils/axiosInstance';

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [isLogged, setIsLogged] = useState(false);

  // useEffect(() => {
  //   try {
  //     if (!token) {
  //       setIsLogged(false);
  //       localStorage.clear();
  //       return;
  //     }

  //     console.log(token);
  //     var base64Url = token.split('.')[1];
  //     var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  //     var jsonPayload = decodeURIComponent(
  //       window
  //         .atob(base64)
  //         .split('')
  //         .map(function (c) {
  //           return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  //         })
  //         .join('')
  //     );

  //     const decodedJwt = JSON.parse(jsonPayload);

  //     if (decodedJwt.exp * 1000 < Date.now()) {
  //       localStorage.clear();
  //       setIsLogged(false);
  //       setToken('');
  //     } else {
  //       setIsLogged(true);
  //     }
  //   } catch (error) {
  //     console.error('Error decoding token:', error);
  //     setIsLogged(false);
  //     setToken('');
  //   }
  // }, []);

  // so what if session expires but token is still valid?
  // we need to check if token is valid on every request
  // why use context to store user info?
  // because we need to access user info from anywhere in the app
  // why not just localStorage?
  // because localStorage is not reactive
  // what does reactive mean in this context?
  // it means that when we update user info, the app will update itself
  // why is that important?
  // because we need to update the app when user info changes

  return <AuthContext.Provider value={isLogged}>{children}</AuthContext.Provider>;
};
