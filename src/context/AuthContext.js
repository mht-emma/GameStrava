import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [stravaToken, setStravaToken] = useState(null);

  const login = (userData, token) => {
    setUser(userData);
    setStravaToken(token);
  };

  const logout = () => {
    setUser(null);
    setStravaToken(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        stravaToken,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
