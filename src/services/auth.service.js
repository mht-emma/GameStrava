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
import { DEMO_MODE, DEMO_USER } from '../config/config';

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

export async function saveUserId(userId) {
  try {
    await StorageAdapter.setItem('user_id', userId);
    return true;
  } catch (error) {
    console.error('❌ Erreur sauvegarde user ID:', error);
    throw error;
  }
}

export async function getStoredUserId() {
  try {
    return await StorageAdapter.getItem('user_id');
  } catch (error) {
    console.error('❌ Erreur lecture user ID:', error);
    return null;
  }
}

export async function getStoredAccessToken() {
  try {
    return await StorageAdapter.getItem('strava_access_token');
  } catch (error) {
    console.error('❌ Erreur lecture token:', error);
    return null;
  }
}

export async function getStoredRefreshToken() {
  try {
    return await StorageAdapter.getItem('strava_refresh_token');
  } catch (error) {
    console.error('❌ Erreur lecture refresh token:', error);
    return null;
  }
}

export async function getStoredExpiresAt() {
  try {
    const expiresAt = await StorageAdapter.getItem('strava_expires_at');
    return expiresAt ? parseInt(expiresAt) : null;
  } catch (error) {
    console.error('❌ Erreur lecture expires_at:', error);
    return null;
  }
}

export function isTokenExpired(expiresAtSeconds) {
  try {
    if (!expiresAtSeconds) return true;
    return Date.now() > expiresAtSeconds * 1000;
  } catch (error) {
    console.error('❌ Erreur vérif expiration:', error);
    return true;
  }
}

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
 * GESTION UTILISATEUR SUPABASE
 * =============================
 */

/**
 * Crée un nouvel utilisateur ou récupère l'existant
 * ⚠️ ADAPTÉ AU SCHÉMA SQL FOURNI : Table 'users' (pas 'profiles')
 */
export async function createOrGetUser(athlete, tokenData) {
  try {
    // Mapping des données Strava -> Colonnes SQL 'users' et 'profiles' (si legacy, mais ici on vise 'users')
    // Le schéma fourni : users(user_id, username, first_name, last_name, city, country, email, sex, weight, height, avatar)

    const userData = {
      user_id: athlete.id.toString(), // TEXT PRIMARY KEY
      username: athlete.username || `athlete_${athlete.id}`,
      first_name: athlete.firstname,
      last_name: athlete.lastname,
      city: athlete.city || 'Unknown',
      country: athlete.country || 'Unknown',
      email: athlete.email || null,
      sex: athlete.sex || null,
      weight: athlete.weight || 0,
      height: 180, // Valeur arbitraire raisonnable si manquante
      avatar: athlete.profile,
      // created_at DEFAULT NOW()
    };

    console.log(`👤 Upsert user dans table 'users': ${userData.user_id}`);

    const { data: user, error } = await supabase
      .from('users') // Nom de table corrigé selon schéma
      .upsert(userData, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) {
      console.error('❌ Erreur Upsert User:', error);
      throw error;
    }

    // Compatibilité interne de l'app (attend souvent .id)
    if (user && user.user_id) {
      user.id = user.user_id;
    }

    return user;
  } catch (error) {
    console.error('❌ Erreur createOrGetUser:', error.message);
    throw error;
  }
}

/**
 * Récupère l'utilisateur actuel depuis Supabase
 */
export async function getCurrentUser(userId) {
  try {
    const { data, error } = await supabase
      .from('users') // Nom de table corrigé selon schéma
      .select('*')
      .eq('user_id', userId) // PK correcte
      .single();

    if (error) throw error;

    // Compatibilité interne
    if (data && data.user_id) {
      data.id = data.user_id;
    }

    return data;
  } catch (error) {
    console.error('❌ Erreur récupération utilisateur:', error.message);
    return null;
  }
}

/**
 * =============================
 * LOGIN STRAVA COMPLET
 * =============================
 */

export async function loginWithStravaOAuth() {
  // 🚧 MODE DÉMO ACTIVÉ
  if (DEMO_MODE) {
    logger.info('[DEMO MODE] ⏩ Bypass OAuth Strava activé');

    // 1. Simulation de l'athlète
    const demoAthlete = {
      id: DEMO_USER.id,
      username: DEMO_USER.username,
      firstname: DEMO_USER.firstname,
      lastname: DEMO_USER.lastname,
      profile: DEMO_USER.profile,
      city: DEMO_USER.city,
      country: DEMO_USER.country,
      sex: DEMO_USER.sex,
      weight: DEMO_USER.weight,
      email: 'demo@athletix.app'
    };

    const demoToken = {
      access_token: 'demo_access_token_123',
      refresh_token: 'demo_refresh_token_123',
      expires_at: Math.floor(Date.now() / 1000) + 86400, // +24h
      athlete: demoAthlete
    };

    // 2. Création/Update en BDD Supabase (via createOrGetUser pour cohérence)
    logger.info('[DEMO MODE] Upsert du User Démo en BDD...');
    const user = await createOrGetUser(demoAthlete, demoToken);

    // 3. Sauvegarde session locale
    await Promise.all([
      saveStravaTokens(demoToken),
      saveUserId(user.user_id), // Attention : user_id (Supabase PK)
    ]);

    logger.info('[DEMO MODE] Session établie avec succès.');
    return { user, stravaToken: demoToken };
  }

  // --- FLUX NORMAL (DEMO_MODE = false) ---
  try {
    logger.info('Démarrage connexion Strava (Normal Flow)...');

    const authCode = await loginWithStrava();
    if (!authCode) throw new Error('Aucun code reçu.');

    const tokenData = await exchangeCodeForToken(authCode);
    if (!tokenData?.access_token) throw new Error('Pas de token d\'accès.');

    const athlete = await getAthlete(tokenData.access_token);
    if (!athlete?.id) throw new Error('Infos athlète introuvables.');

    const user = await createOrGetUser(athlete, tokenData);

    await Promise.all([
      saveStravaTokens(tokenData),
      saveUserId(user.user_id),
    ]);

    // Sync non bloquante
    syncActivities(tokenData.access_token, user.user_id).catch(e => logger.warn('Sync error:', e));

    return { user, stravaToken: tokenData };

  } catch (error) {
    logger.error('Erreur login:', error);
    await clearStoredTokens().catch(() => { });
    throw error;
  }
}

/**
 * =============================
 * LOGOUT
 * =============================
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

export async function restoreSession() {
  // 🚧 MODE DÉMO : Restauration forcée
  if (DEMO_MODE) {
    logger.info('[DEMO MODE] ⏩ Restauration session Démo forcée');

    const demoAthlete = {
      id: DEMO_USER.id,
      username: DEMO_USER.username,
      firstname: DEMO_USER.firstname,
      lastname: DEMO_USER.lastname,
      profile: DEMO_USER.profile,
      city: DEMO_USER.city,
      country: DEMO_USER.country,
      sex: DEMO_USER.sex,
      weight: DEMO_USER.weight,
    };

    // On s'assure que l'utilisateur est bien en base au démarrage
    // (utile pour afficher le dashboard même si login pas appelé explicitement)
    try {
      const user = await createOrGetUser(demoAthlete, null);
      return {
        user,
        stravaToken: { access_token: 'demo', refresh_token: 'demo' }
      };
    } catch (e) {
      logger.error('[DEMO MODE] Erreur restauration user:', e);
      return { user: null, stravaToken: null };
    }
  }

  // --- RESTAURATION NORMALE ---
  try {
    logger.info('Tentative restauration session...');

    const [accessToken, refreshToken, expiresAt] = await Promise.all([
      getStoredAccessToken(),
      getStoredRefreshToken(),
      getStoredExpiresAt(),
    ]);

    if (!accessToken || !refreshToken || !expiresAt) {
      return { user: null, stravaToken: null };
    }

    if (isTokenExpired(expiresAt)) {
      logger.info('Token expiré, refresh...');
      try {
        const newTokenData = await refreshAccessToken(refreshToken);
        await saveStravaTokens(newTokenData);

        const userId = await getStoredUserId();
        if (!userId) throw new Error('No User ID');

        const user = await getCurrentUser(userId);
        if (!user) throw new Error('User not found in DB');

        return { user, stravaToken: newTokenData };
      } catch (e) {
        logger.warn('Refresh failed:', e);
        await clearStoredTokens();
        return { user: null, stravaToken: null };
      }
    }

    // Token valide
    const userId = await getStoredUserId();
    if (!userId) {
      await clearStoredTokens();
      return { user: null, stravaToken: null };
    }

    const user = await getCurrentUser(userId);
    if (!user) {
      await clearStoredTokens();
      return { user: null, stravaToken: null };
    }

    logger.info(`Session restaurée: ${user.user_id}`);

    return {
      user,
      stravaToken: {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_at: parseInt(expiresAt, 10),
      }
    };

  } catch (error) {
    logger.error('Erreur restauration:', error);
    return { user: null, stravaToken: null };
  }
}
