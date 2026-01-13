//lancer le login OAuth
//récupérer athlete.id
//récupérer le token
// src/services/stravaService.js

import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as SecureStore from 'expo-secure-store';


WebBrowser.maybeCompleteAuthSession();

/**
 * =========================
 * CONFIGURATION STRAVA
 * =========================
 */
const STRAVA_CLIENT_ID = 'TON_CLIENT_ID';
const STRAVA_CLIENT_SECRET = 'TON_CLIENT_SECRET';

const STRAVA_AUTH_URL = 'https://www.strava.com/oauth/mobile/authorize';
const STRAVA_TOKEN_URL = 'https://www.strava.com/oauth/token';
const STRAVA_API_URL = 'https://www.strava.com/api/v3';

const SCOPES = ['read', 'activity:read'];

/**
 * =========================
 * LOGIN OAUTH STRAVA
 * =========================
 */
export async function loginWithStrava() {
  // URL de redirection (Expo)
  const redirectUri = AuthSession.makeRedirectUri({
    useProxy: true,
  });

  // Construction de l’URL d’auth Strava
  const authUrl =
    `${STRAVA_AUTH_URL}?` +
    `client_id=${STRAVA_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code` +
    `&approval_prompt=auto` +
    `&scope=${SCOPES.join(',')}`;

  // Ouvre la page Strava
  const result = await AuthSession.startAsync({ authUrl });

  // L’utilisateur a annulé ou une erreur est survenue
  if (result.type !== 'success') {
    throw new Error('Strava login cancelled');
  }

  // Code temporaire renvoyé par Strava
  return result.params.code;
}

/**
 * =========================
 * ÉCHANGE CODE → TOKEN
 * =========================
 */
export async function exchangeCodeForToken(code) {
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
  // après le fetch
  const data = await response.json();

  await SecureStore.setItemAsync('strava_access_token', data.access_token);
  await SecureStore.setItemAsync('strava_refresh_token', data.refresh_token);
  await SecureStore.setItemAsync('strava_expires_at', data.expires_at.toString());
  
  return data;

  if (!response.ok) {
    throw new Error('Failed to exchange token with Strava');
  }

  return await response.json();
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
export async function getActivities(accessToken) {
  const response = await fetch(
    'https://www.strava.com/api/v3/athlete/activities?per_page=50',
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


