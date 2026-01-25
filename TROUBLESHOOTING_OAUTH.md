# 🔐 Dépannage OAuth Strava (Expo / React Native)

Ce document explique comment configurer correctement le Dashboard Strava et le code Expo pour que l'authentification fonctionne.

## ⚠️ PROBLÈME LE PLUS FRÉQUENT : Identifiants Incorrects

Si vous avez l'erreur **"Bad Request"** ou **"client_id invalid"**, c'est que vous n'avez pas mis vos vrais identifiants Strava.

1.  Ouvrez le fichier `.env` à la racine du projet.
2.  Remplacez `YOUR_CLIENT_ID` par votre ID (ex: `12345`).
3.  Remplacez `YOUR_CLIENT_SECRET` par votre Secret (ex: `a1b2c3...`).
4.  **Redémarrez Expo** (`CTRL+C` puis `npx expo start --clear`) pour prendre en compte les changements.

## 1. Configuration sur le Dashboard Strava

Allez sur [Strava API Settings](https://www.strava.com/settings/api).

### A. Authorization Callback Domain
Strava est très strict sur le domaine.
*   **Recommandé** : Mettez `localhost` ou `127.0.0.1`.
    *   *Pourquoi ?* Cela permet d'utiliser des URLs de redirection de type `scheme://localhost/...` qui passent la validation de domaine tout en redirigeant vers l'app mobile.

### B. Mettre à jour l'application
Assurez-vous de sauvegarder les changements. Notez que la propagation peut prendre quelques minutes (rare, mais possible).

## 2. Configuration du Code (stravaService.js)

Le problème fréquent est l'utilisation de `useProxy: true` qui génère une URL `auth.expo.io` souvent rejetée si on ne possède pas le domaine.

**Solution appliquée** :
Nous forçons l'utilisation du schéma natif `gamestrava://`.

*   **URL de redirection générée** : `gamestrava://localhost/redirect` (ou similaire).
*   **Schéma** : Défini dans `app.json` (`"scheme": "gamestrava"`).

## 3. Checklist de vérification

1.  [ ] **.env** : `EXPO_PUBLIC_STRAVA_CLIENT_ID` est bien un nombre (ex: 12345), pas "YOUR_CLIENT_ID".
2.  [ ] **app.json** : Vérifier que `"scheme": "gamestrava"` est bien présent.
3.  [ ] **Strava Dashboard** : "Authorization Callback Domain" = `localhost`.
4.  [ ] **Mobile** : Si vous testez sur **Expo Go**, assurez-vous que le login s'ouvre. Si ça bloque, vérifiez que le dashboard Strava pointe bien vers localhost (ou l'IP si vous utilisez l'IP).

## 4. Test du Flow

1.  Lancer l'app (`npx expo start`).
2.  Clic "Se connecter avec Strava".
3.  Navigateur s'ouvre sur Strava.
4.  Validation.
5.  Navigateur demande "Ouvrir dans GameStrava ?".
6.  Retour app → Succès.
