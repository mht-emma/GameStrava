// src/services/auth.service.js
/**
 * 🔐 AUTHENTIFICATION SERVICE
 * Gère login Strava, tokens, persistance, et synchronisation Supabase
 */

import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { supabase } from './supabaseClient';
import { 
  loginWithStrava, 
  exchangeCodeForToken, 
  refreshAccessToken,
  getAthlete, 
  getActivities 
} from './stravaService';
import { syncActivities } from './sync.service';

// Configuration du logger
const logger = {
  info: (message, ...args) => console.log(`[Auth] ${message}`, ...args),
  error: (message, ...args) => console.error(`[Auth] ❌ ${message}`, ...args),
  warn: (message, ...args) => console.warn(`[Auth] ⚠️ ${message}`, ...args),
};

/**
 * Abstraction storage: localStorage sur web, SecureStore sur mobile
 */
const StorageAdapter = {
  async setItem(key, value) {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem(key, value);
      } else {
        await SecureStore.setItemAsync(key, value);
      }
    } catch (error) {
      console.error(`❌ Erreur setItem(${key}):`, error);
      throw error;
    }
  },

  async getItem(key) {
    try {
      if (Platform.OS === 'web') {
        return localStorage.getItem(key) || null;
      } else {
        return await SecureStore.getItemAsync(key);
      }
    } catch (error) {
      console.error(`❌ Erreur getItem(${key}):`, error);
      return null;
    }
  },

  async removeItem(key) {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem(key);
      } else {
        await SecureStore.deleteItemAsync(key);
      }
    } catch (error) {
      console.error(`❌ Erreur removeItem(${key}):`, error);
      throw error;
    }
  },
};

/**
 * =============================
 * GESTION TOKENS PERSISTANTS
 * =============================
 */

/**
 * Sauvegarde les tokens Strava de manière sécurisée
 */
export async function saveStravaTokens(tokenData) {
  try {
    await StorageAdapter.setItem('strava_access_token', tokenData.access_token);
    await StorageAdapter.setItem('strava_refresh_token', tokenData.refresh_token);
    await StorageAdapter.setItem('strava_expires_at', tokenData.expires_at.toString());
    return true;
  } catch (error) {
    console.error('❌ Erreur sauvegarde tokens:', error);
    throw error;
  }
}

/**
 * Sauvegarde l'ID de l'utilisateur Supabase (pour restauration session)
 */
export async function saveUserId(userId) {
  try {
    await StorageAdapter.setItem('user_id', userId);
    return true;
  } catch (error) {
    console.error('❌ Erreur sauvegarde user ID:', error);
    throw error;
  }
}

/**
 * Récupère l'ID utilisateur stocké
 */
export async function getStoredUserId() {
  try {
    return await StorageAdapter.getItem('user_id');
  } catch (error) {
    console.error('❌ Erreur lecture user ID:', error);
    return null;
  }
}

/**
 * Récupère le token d'accès stocké
 */
export async function getStoredAccessToken() {
  try {
    return await StorageAdapter.getItem('strava_access_token');
  } catch (error) {
    console.error('❌ Erreur lecture token:', error);
    return null;
  }
}

/**
 * Récupère le refresh token stocké
 */
export async function getStoredRefreshToken() {
  try {
    return await StorageAdapter.getItem('strava_refresh_token');
  } catch (error) {
    console.error('❌ Erreur lecture refresh token:', error);
    return null;
  }
}

/**
 * Récupère la date d'expiration du token
 */
export async function getStoredExpiresAt() {
  try {
    const expiresAt = await StorageAdapter.getItem('strava_expires_at');
    return expiresAt ? parseInt(expiresAt) : null;
  } catch (error) {
    console.error('❌ Erreur lecture expires_at:', error);
    return null;
  }
}

/**
 * Vérifie si le token est expiré
 */
export function isTokenExpired(expiresAtSeconds) {
  try {
    if (!expiresAtSeconds) return true;
    return Date.now() > expiresAtSeconds * 1000;
  } catch (error) {
    console.error('❌ Erreur vérif expiration:', error);
    return true;
  }
}

/**
 * Nettoie tous les tokens stockés
 */
export async function clearStoredTokens() {
  try {
    await StorageAdapter.removeItem('strava_access_token');
    await StorageAdapter.removeItem('strava_refresh_token');
    await StorageAdapter.removeItem('strava_expires_at');
    await StorageAdapter.removeItem('user_id');
    return true;
  } catch (error) {
    console.error('❌ Erreur suppression tokens:', error);
    throw error;
  }
}

/**
 * =============================
 * LOGIN STRAVA COMPLET
 * =============================
 */

/**
 * 🔓 WORKFLOW COMPLET: OAuth → Tokens → User Supabase
 * @returns {Promise<{user: Object, stravaToken: Object}>} Les informations de l'utilisateur et le token Strava
 */
export async function loginWithStravaOAuth() {
  try {
    logger.info('Démarrage du processus de connexion avec Strava...');
    
    // 1. Lancer le flux OAuth avec Strava
    logger.info('Étape 1/4: Lancement du flux OAuth...');
    const authCode = await loginWithStrava();
    
    if (!authCode) {
      throw new Error('Aucun code d\'autorisation reçu de Strava');
    }
    
    logger.info('Code d\'autorisation reçu, échange en cours...');
    
    // 2. Échanger le code contre un token d'accès
    const tokenData = await exchangeCodeForToken(authCode);
    
    if (!tokenData?.access_token) {
      throw new Error('Échec de l\'obtention du token d\'accès');
    }
    
    logger.info('Token obtenu avec succès, récupération des informations de l\'athlète...');
    
    // 3. Récupérer les infos de l'athlète
    const athlete = await getAthlete(tokenData.access_token);
    
    if (!athlete?.id) {
      throw new Error('Impossible de récupérer les informations de l\'athlète');
    }
    
    logger.info(`Athlète récupéré: ${athlete.firstname} ${athlete.lastname} (ID: ${athlete.id})`);
    
    // 4. Créer ou mettre à jour l'utilisateur dans Supabase
    const user = await createOrGetUser(athlete, tokenData);
    
    if (!user?.id) {
      throw new Error('Échec de la création/mise à jour de l\'utilisateur');
    }
    
    logger.info(`Utilisateur ${user.id} connecté avec succès`);

    await Promise.all([
      saveStravaTokens(tokenData),
      saveUserId(user.id),
    ]);
    
    // 5. Synchroniser les activités en arrière-plan (sans attendre la fin)
    syncActivities(tokenData.access_token, user.id)
      .then(() => logger.info('Synchronisation des activités terminée avec succès'))
      .catch(syncError => 
        logger.warn('Échec de la synchronisation initiale des activités:', syncError.message)
      );
    
    return { user, stravaToken: tokenData };
    
  } catch (error) {
    logger.error('Erreur lors de la connexion avec Strava:', error);
    
    // Nettoyage en cas d'erreur
    try {
      await clearStoredTokens();
    } catch (cleanupError) {
      logger.error('Erreur lors du nettoyage des tokens:', cleanupError);
    }
    
    // Amélioration du message d'erreur pour l'utilisateur
    let errorMessage = 'Une erreur est survenue lors de la connexion';
    
    if (error.message.includes('network')) {
      errorMessage = 'Erreur de réseau. Vérifiez votre connexion Internet.';
    } else if (error.message.includes('cancel')) {
      errorMessage = 'Connexion annulée';
    } else if (error.message.includes('invalid_grant')) {
      errorMessage = 'Session expirée. Veuillez vous reconnecter.';
    }
    
    const enhancedError = new Error(errorMessage);
    enhancedError.originalError = error;
    throw enhancedError;
  }
}

/**
 * =============================
 * GESTION UTILISATEUR SUPABASE
 * =============================
 */

/**
 * Crée un nouvel utilisateur ou récupère l'existant
 */
export async function createOrGetUser(athlete, tokenData) {
  try {
    // Vérifier si l'utilisateur existe
    const { data: existingUser, error: selectError } = await supabase
      .from('profiles')
      .select('*')
      .eq('strava_athlete_id', athlete.id)
      .single();

    // L'utilisateur existe
    if (existingUser) {
      console.log('👤 Utilisateur existant trouvé');

      // Mettre à jour les infos si changées
      await supabase
        .from('profiles')
        .update({
          username: athlete.username,
          avatar: athlete.profile,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingUser.id);

      return existingUser;
    }

    // Créer un nouvel utilisateur
    console.log('👤 Création nouvel utilisateur');
    const { data: newUser, error: insertError } = await supabase
      .from('profiles')
      .insert({
        strava_athlete_id: athlete.id,
        username: athlete.username,
        email: athlete.email || null,
        avatar: athlete.profile,
        first_name: athlete.firstname,
        last_name: athlete.lastname,
        city: athlete.city || null,
        state: athlete.state || null,
        country: athlete.country || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    return newUser;
  } catch (error) {
    console.error('❌ Erreur gestion utilisateur:', error.message);
    throw error;
  }
}

/**
 * Récupère l'utilisateur actuel depuis Supabase
 */
export async function getCurrentUser(userId) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('❌ Erreur récupération utilisateur:', error.message);
    return null;
  }
}

/**
 * =============================
 * LOGOUT
 * =============================
 */

/**
 * Déconnexion complète
 */
export async function logout() {
  try {
    console.log('🚪 Déconnexion...');
    await clearStoredTokens();
    console.log('✅ Déconnexion réussie');
    return true;
  } catch (error) {
    console.error('❌ Erreur déconnexion:', error.message);
    throw error;
  }
}

/**
 * =============================
 * SESSION RESTORATION
 * =============================
 */

/**
 * Restaure une session depuis les tokens stockés
 * Appelé au démarrage de l'app
 * @returns {Promise<{user: Object|null, stravaToken: Object|null}>} L'utilisateur et le token Strava s'ils existent
 */
export async function restoreSession() {
  try {
    logger.info('Tentative de restauration de la session...');
    
    // Récupération des tokens stockés
    const [accessToken, refreshToken, expiresAt] = await Promise.all([
      getStoredAccessToken(),
      getStoredRefreshToken(),
      getStoredExpiresAt(),
    ]);
    
    // Vérification de la présence des tokens
    if (!accessToken || !refreshToken || !expiresAt) {
      logger.info('Aucun token stocké trouvé');
      return { user: null, stravaToken: null };
    }
    
    logger.info('Tokens trouvés, vérification de la validité...');
    
    // Vérification de l'expiration du token
    const isExpired = isTokenExpired(expiresAt);
    
    if (isExpired) {
      logger.info('Token expiré, tentative de rafraîchissement...');
      
      try {
        // Tentative de rafraîchissement du token
        const newTokenData = await refreshAccessToken(refreshToken);
        
        // Mise à jour des tokens dans le stockage
        await saveStravaTokens(newTokenData);
        
        // Récupération de l'utilisateur
        const userId = await getStoredUserId();
        if (!userId) {
          throw new Error('ID utilisateur non trouvé');
        }
        
        const user = await getCurrentUser(userId);
        
        if (!user) {
          throw new Error('Utilisateur non trouvé');
        }
        
        logger.info('Session restaurée avec succès après rafraîchissement');
        return { user, stravaToken: newTokenData };
        
      } catch (refreshError) {
        logger.warn('Échec du rafraîchissement du token:', refreshError.message);
        await clearStoredTokens();
        return { user: null, stravaToken: null };
      }
    }
    
    // Si le token est toujours valide, récupérer l'utilisateur
    logger.info('Token toujours valide, récupération de l\'utilisateur...');
    
    const userId = await getStoredUserId();
    if (!userId) {
      logger.warn('Aucun ID utilisateur trouvé dans le stockage');
      await clearStoredTokens();
      return { user: null, stravaToken: null };
    }
    
    const user = await getCurrentUser(userId);
    
    if (!user) {
      logger.warn('Utilisateur non trouvé dans la base de données');
      await clearStoredTokens();
      return { user: null, stravaToken: null };
    }
    
    logger.info(`Session restaurée pour l'utilisateur ${user.id}`);
    
    return { 
      user, 
      stravaToken: { 
        access_token: accessToken, 
        refresh_token: refreshToken, 
        expires_at: parseInt(expiresAt, 10),
        athlete: user.athlete_data // Ajout des données athlète pour une utilisation immédiate
      } 
    };
    
  } catch (error) {
    logger.error('Erreur lors de la restauration de la session:', error);
    
    // En cas d'erreur grave, on nettoie tout
    try {
      await clearStoredTokens();
    } catch (cleanupError) {
      logger.error('Erreur lors du nettoyage des tokens:', cleanupError);
    }
    
    return { user: null, stravaToken: null };
  }
}
