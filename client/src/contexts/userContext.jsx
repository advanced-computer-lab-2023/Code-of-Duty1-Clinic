import { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState({ name: '', role: '' });

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

export const useUserContext = () => useContext(UserContext);
