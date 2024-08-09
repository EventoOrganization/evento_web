import { createContext, useContext, useState, FC } from "react";
//import Cookies from "js-cookie";

const AuthContext = createContext({});
export const AuthProvider = ({ children }: { children: any }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  return (
    <AuthContext.Provider value={{ user, setUser, isLoading, setIsLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
