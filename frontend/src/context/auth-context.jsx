import React, { useState, createContext, useContext, useCallback } from "react";

const AuthContext = createContext({
  token: null,
  userId: null,
  login: (token, userId, tokenExpiration) => {},
  logout: () => {},
});

export const useAuthContext = () => {
  return useContext(AuthContext);
};
export const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const login = useCallback((token, userId) => {
    setToken(token);
    setUserId(userId);
  }, []);
  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
  }, []);
  return (
    <AuthContext.Provider value={{ token, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
