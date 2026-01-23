# ✅ Checklist de Correction OAuth Strava

Voici les étapes exactes pour corriger l'erreur `client_id invalid` et faire fonctionner le login.

## 1. 🛑 CORRECTION CRITIQUE (Bloquant)

Strava rejette la connexion car vous utilisez les valeurs par défaut.

1.  Ouvrez le fichier `.env` (à la racine du projet).
2.  **Modifiez `EXPO_PUBLIC_STRAVA_CLIENT_ID`**.
    *   ❌ Incorrect : `YOUR_CLIENT_ID`
    *   ✅ Correct : `12345` (Un nombre que vous trouvez sur votre Dashboard Strava)
3.  **Modifiez `EXPO_PUBLIC_STRAVA_CLIENT_SECRET`**.
    *   ❌ Incorrect : `YOUR_CLIENT_SECRET`
    *   ✅ Correct : `f7a8...` (Votre clé secrète Strava)
4.  ⚠️ **IMPORTANT : Redémarrez Expo** pour que ces changements soient pris en compte.
    *   Tapez `CTRL+C` dans le terminal.
    *   Relancez `npx expo start --clear`.

## 2. Configuration Strava (Dashboard)

Allez sur [Strava API Settings](https://www.strava.com/settings/api).

*   **Application Name** : GameStrava (ou votre choix)
*   **Category** : Game / Media
*   **Authorization Callback Domain** : `localhost`
    *   *C'est la valeur magique qui permet à l'authentification mobile (gamestrava://) de fonctionner.*

## 3. Code Correct (Déjà appliqué dans `stravaService.js`)

Votre fichier `src/services/stravaService.js` a déjà été corrigé pour utiliser la meilleure configuration pour Expo :

*   **Endpoint** : `https://www.strava.com/oauth/mobile/authorize` (automatiquement géré par le code selon la plateforme)
*   **Redirect URI** : `gamestrava://localhost/redirect`
    *   Cela force l'ouverture de l'application mobile après le login.
    *   Cela nécessite que le `Authorization Callback Domain` soit `localhost`.
*   **Proxy** : Désactivé (`useProxy: false`) pour éviter les erreurs liées aux serveurs Expo.

## 4. Vérification Finale

Si vous voyez encore `client_id invalid`, cela signifie que Expo utilise encore l'ancienne version de votre fichier `.env`. **Redémarrez le serveur Metro avec le cache vidé (`--clear`).**
