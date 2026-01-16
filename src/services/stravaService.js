// src/services/stravaService.js

import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

// Configuration pour le proxy de développement Expo
WebBrowser.maybeCompleteAuthSession();

/**
 * =========================
 * CONFIGURATION STRAVA
 * =========================
 */
// Ces variables doivent être définies dans votre fichier .env
const STRAVA_CLIENT_ID = process.env.EXPO_PUBLIC_STRAVA_CLIENT_ID || 'YOUR_CLIENT_ID';
const STRAVA_CLIENT_SECRET = process.env.EXPO_PUBLIC_STRAVA_CLIENT_SECRET || 'YOUR_CLIENT_SECRET';

// Configuration des URLs de l'API Strava
const STRAVA_AUTH_URL =
  Platform.OS === 'web'
    ? 'https://www.strava.com/oauth/authorize'
    : 'https://www.strava.com/oauth/mobile/authorize';
const STRAVA_TOKEN_URL = 'https://www.strava.com/oauth/token';
const STRAVA_API_URL = 'https://www.strava.com/api/v3';

// Scopes nécessaires pour l'application
const SCOPES = ['read', 'activity:read'];

/**
 * =========================
 * LOGIN OAUTH STRAVA
 * =========================
 */
export async function loginWithStrava() {
  try {
    // Configuration de l'URL de redirection
    const redirectUri = AuthSession.makeRedirectUri({
      // En développement, on utilise le proxy Expo
      useProxy: Platform.OS !== 'web' && __DEV__,
      // En production, on utilise le schéma de l'application
      native: 'gamestrava://auth',
      // Sur web, évite 127.0.0.1/localhost incohérents
      preferLocalhost: Platform.OS === 'web',
    });

    console.log('URL de redirection:', redirectUri);

    // Vérification de l'URL de redirection
    if (!redirectUri) {
      throw new Error('Impossible de générer l\'URL de redirection. Vérifiez votre configuration.');
    }

    const authUrl =
      `${STRAVA_AUTH_URL}?` +
      `client_id=${encodeURIComponent(STRAVA_CLIENT_ID)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code` +
      `&approval_prompt=auto` +
      `&scope=${encodeURIComponent(SCOPES.join(','))}`;

    console.log('Démarrage du flux OAuth avec Strava...');

    const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

    console.log('Résultat de l\'authentification:', result.type);

    // Vérification du résultat
    if (result.type !== 'success') {
      if (result.type === 'cancel') {
        throw new Error('Connexion annulée par l\'utilisateur');
      } else if (result.type === 'dismiss') {
        throw new Error('Fenêtre d\'authentification fermée');
      } else if (result.type === 'error') {
        throw new Error(`Erreur d'authentification: ${result.error?.message || 'Inconnue'}`);
      } else {
        throw new Error(`Échec de l'authentification: ${result.type}`);
      }
    }

    if (!result.url) {
      console.error('URL de retour manquante:', result);
      throw new Error('Réponse inattendue du serveur d\'authentification');
    }

    // Extraction du code depuis l'URL de retour
    const codeMatch = result.url.match(/[?&]code=([^&]+)/);
    const code = codeMatch ? decodeURIComponent(codeMatch[1]) : null;
    if (!code) {
      console.error('Code manquant dans l\'URL de retour:', result.url);
      throw new Error('Code d\'autorisation manquant');
    }

    console.log('Code d\'autorisation reçu, échange en cours...');
    return code;
  } catch (error) {
    console.error('Erreur lors de la connexion à Strava:', error);
    throw error;
  }
}

/**
 * =========================
 * ÉCHANGE CODE → TOKEN
 * =========================
 */
export async function exchangeCodeForToken(code) {
  try {
    console.log('Échange du code contre un token...');
    
    const response = await fetch(STRAVA_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: STRAVA_CLIENT_ID,
        client_secret: STRAVA_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Erreur lors de l\'échange du token:', errorData);
      throw new Error(`Échec de l'échange du code contre un token: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.access_token || !data.refresh_token || !data.expires_at) {
      console.error('Réponse de token invalide:', data);
      throw new Error('Réponse de token invalide de l\'API Strava');
    }

    return data;
  } catch (error) {
    console.error('Erreur lors de l\'échange du code contre un token:', error);
    throw error;
  }
}

/**
 * =========================
 * RAFRAÎCHISSEMENT DU TOKEN
 * =========================
 */
export async function refreshAccessToken(refreshToken) {
  try {
    console.log('Rafraîchissement du token d\'accès...');
    
    const response = await fetch(STRAVA_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: STRAVA_CLIENT_ID,
        client_secret: STRAVA_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Erreur lors du rafraîchissement du token:', errorData);
      throw new Error('Échec du rafraîchissement du token');
    }

    const data = await response.json();
    
    if (!data.access_token || !data.refresh_token) {
      throw new Error('Réponse de rafraîchissement de token invalide');
    }
    return data;
  } catch (error) {
    console.error('Erreur lors du rafraîchissement du token:', error);
    throw error;
  }
}

/**
 * =========================
 * RÉCUPÉRER L’ATHLETE
 * =========================
 */
export async function getAthlete(accessToken) {
  const response = await fetch(`${STRAVA_API_URL}/athlete`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch athlete');
  }

  return await response.json();
}

/**
 * =========================
 * RÉCUPÉRER LES ACTIVITÉS
 * =========================
 */
export async function getActivities(accessToken, page = 1) {
  const response = await fetch(
    `https://www.strava.com/api/v3/athlete/activities?per_page=30&page=${page}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch activities');
  }

  return await response.json();
}