import React, { createContext, useState, useEffect, useCallback } from "react";
import * as authService from "../services/auth.service";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [stravaToken, setStravaToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  /**
   * 🔓 LOGIN - Démarre le flow OAuth Strava complet
   */
  const login = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { user: userData, stravaToken: token } = await authService.loginWithStravaOAuth();
      
      setUser(userData);
      setStravaToken(token);
      setIsAuthenticated(true);
      
      console.log("✅ Authentification réussie:", userData.id);
      return userData;
    } catch (err) {
      const errorMsg = err.message || "Erreur d'authentification";
      console.error("❌ Login error:", errorMsg);
      setError(errorMsg);
      setUser(null);
      setStravaToken(null);
      setIsAuthenticated(false);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 🚪 LOGOUT - Déconnecte complètement
   */
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      setStravaToken(null);
      setIsAuthenticated(false);
      setError(null);
      console.log("✅ Déconnexion réussie");
    } catch (err) {
      console.error("❌ Logout error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 🔍 RESTAURATION SESSION
   * Appelée au montage de l'app pour vérifier une session existante
   */
  useEffect(() => {
    const restoreSession = async () => {
      try {
        setLoading(true);
        
        const session = await authService.restoreSession();
        
        if (session && session.user && session.stravaToken) {
          console.log("✅ Session restaurée");
          setUser(session.user);
          setStravaToken(session.stravaToken);
          setIsAuthenticated(true);
        } else {
          console.log("❌ Pas de session valide");
          setUser(null);
          setStravaToken(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("❌ Erreur restauration session:", err.message);
        setUser(null);
        setStravaToken(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        stravaToken,
        login,
        logout,
        isAuthenticated,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
