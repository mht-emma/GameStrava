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
const STRAVA_CLIENT_ID = process.env.EXPO_PUBLIC_STRAVA_CLIENT_ID;
const STRAVA_CLIENT_SECRET = process.env.EXPO_PUBLIC_STRAVA_CLIENT_SECRET;

// Sécurité : Vérification que les clés ne sont pas les valeurs par défaut
if (!STRAVA_CLIENT_ID || STRAVA_CLIENT_ID === 'YOUR_CLIENT_ID' || STRAVA_CLIENT_ID === 'TON_CLIENT_ID') {
  console.error('❌ ERREUR CRITIQUE : Strava Client ID non configuré !');
  console.error('👉 Modifiez le fichier .env avec vos vrais identifiants Strava.');
}

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
    // 1️⃣ Configuration de l'URL de redirection
    // On génère l'URI de base gérée par Expo (exp:// en dev, schema natif en prod)
    let redirectUri = AuthSession.makeRedirectUri({
      useProxy: false, // Important : pas de proxy pour Strava
    });

    // 🩹 CORRECTION CRITIQUE POUR STRAVA :
    // Strava restreint les domaines de redirection (Callback Domain).
    // Si on est en "localhost" sur le dashboard Strava, il faut que l'URI contienne "localhost".
    // Problème : Expo Go génère souvent une IP (ex: exp://192.168.1.10:8081).
    // Solution : On remplace l'IP par "localhost" pour satisfaire Strava.
    // L'OS mobile saura quand même router "exp://" ou "athletix://" vers la bonne app.

    // Regex pour remplacer l'IP/Domaine par localhost tout en gardant le port et le schéma
    // Ex: exp://192.168.1.10:8081/... -> exp://localhost:8081/...
    // Ex: athletix://redirect -> athletix://localhost/redirect
    if (!redirectUri.includes('localhost')) {
      // On remplace tout ce qui est entre "://" et le prochain "/" ou la fin par "localhost"
      // Attention aux ports
      const schemeIndex = redirectUri.indexOf('://');
      if (schemeIndex > -1) {
        const scheme = redirectUri.substring(0, schemeIndex);
        const rest = redirectUri.substring(schemeIndex + 3);

        // Si on a un port (cas Expo Go: 192.168.1.10:8081)
        if (rest.includes(':')) {
          const portIndex = rest.indexOf(':');
          const pathIndex = rest.indexOf('/');
          const port = pathIndex > -1 ? rest.substring(portIndex, pathIndex) : rest.substring(portIndex);
          const path = pathIndex > -1 ? rest.substring(pathIndex) : '';
          redirectUri = `${scheme}://localhost${port}${path}`;
        } else {
          // Pas de port (cas Standalone: athletix://redirect)
          const pathIndex = rest.indexOf('/');
          const path = pathIndex > -1 ? rest.substring(pathIndex) : '';
          redirectUri = `${scheme}://localhost${path}`;
        }
      }
    }

    // Fallback de sécurité si le regex échoue ou si path vide
    if (!redirectUri.endsWith('/redirect') && !redirectUri.includes('redirect')) {
      // Expo Go root path sometimes fails deep linking without path
      // redirectUri += '/redirect'; 
    }

    console.log('🔗 URL de redirection optimisée :', redirectUri);

    // 2️⃣ Paramètres d'autorisation
    const authUrl =
      `${STRAVA_AUTH_URL}?` +
      `client_id=${encodeURIComponent(STRAVA_CLIENT_ID)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code` +
      `&approval_prompt=auto` +
      `&scope=${encodeURIComponent(SCOPES.join(','))}`;

    console.log('🚀 Démarrage OAuth Strava...');

    // 3️⃣ Ouverture du navigateur
    // On passe redirectUri pour que WebBrowser sache quand fermer la fenêtre
    const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

    console.log('📥 Résultat Auth:', result.type, result.url);

    // 4️⃣ Gestion du retour
    if (result.type !== 'success') {
      if (result.type === 'cancel') throw new Error('Connexion annulée par l\'utilisateur');
      if (result.type === 'dismiss') throw new Error('Fenêtre fermée sans connexion (Vérifiez le schéma URL)');
      throw new Error(`Erreur authentification: ${result.type}`);
    }

    if (!result.url) throw new Error('URL de retour vide');

    // 5️⃣ Extraction du code
    // L'URL de retour contient le code
    const codeMatch = result.url.match(/[?&]code=([^&]+)/);
    const code = codeMatch ? decodeURIComponent(codeMatch[1]) : null;

    if (!code) throw new Error('Code OAuth introuvable dans l\'URL de retour');

    console.log('✅ Code d\'autorisation reçu !');
    return code;

  } catch (error) {
    console.error('❌ Erreur loginWithStrava:', error);
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