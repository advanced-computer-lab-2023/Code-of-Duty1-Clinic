import { createContext, useState, useContext, useEffect } from 'react';

import { axiosInstance } from 'src/utils/axiosInstance';

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState({ id: '', name: '', role: '' });
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');

  useEffect(() => {
    axiosInstance
      .get('/me/info')
      .then((res) => {
        const user = res.data.result[0];
        setUser({ id: user.id, name: user.name, role: user.role });
      })
      .catch((err) => {
        setUser({ id: '', name: '', role: '' });
        console.log(err);
      });
  }, [token]);

  return <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>;
};

export const useUserContext = () => useContext(UserContext);
