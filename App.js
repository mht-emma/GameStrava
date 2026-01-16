// App.js - GameStrava
// Navigation moderne avec authentification OAuth Strava réelle

import React, { useContext } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Text,
  ActivityIndicator,
  LogBox,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';

// Ignorer les avertissements spécifiques
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'AsyncStorage has been extracted from react-native core',
]);

// Configuration pour le navigateur Web
WebBrowser.maybeCompleteAuthSession();

// Theme
import { colors } from './src/theme';

// Screens
import LoginScreen from './src/screens/LoginScreen';

// Context & Navigation
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

/**
 * 🎯 COMPOSANT PRINCIPAL - Gère la logique d'authentification
 */
const AppContent = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  // ⏳ Affiche un écran de chargement pendant la restauration de session
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Chargement de votre session...</Text>
      </View>
    );
  }

  // ❌ Non authentifié → Affiche LoginScreen
  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        <LoginScreen />
      </View>
    );
  }

  // ✅ Authentifié → Affiche l'application
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <AppNavigator />
    </SafeAreaProvider>
  );
};

/**
 * 📱 APPLICATION - Wrapper avec AuthProvider
 */
const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 20,
    color: colors.text,
    fontSize: 16,
  },
});

export default App;
