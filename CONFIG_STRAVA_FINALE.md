# 🚀 Configuration Finale OAuth Strava (Local / Expo)

Le code a été mis à jour avec vos identifiants réels (Client ID: 196323).
Pour que le login fonctionne, il reste **UNE seule action** à vérifier sur le site de Strava.

## 1. Configurer le Dashboard Strava (INDISPENSABLE)

1.  Allez sur : [https://www.strava.com/settings/api](https://www.strava.com/settings/api)
2.  Dans le formulaire "Update Application" :
    *   **Authorization Callback Domain** : `localhost`
    *   (Ne mettez PAS d'URL complète, juste le mot `localhost`)
3.  Cliquez sur **Save**.

*Pourquoi ?* Cela autorise l'application à rediriger vers `gamestrava://localhost/redirect`.

## 2. Redémarrer Expo

Comme nous avons modifié le fichier `.env`, vous devez redémarrer le serveur :

1.  Coupez le serveur actuel (`CTRL + C`)
2.  Relancez avec nettoyage du cache :
    ```bash
    npx expo start --clear
    ```

## 3. Informations Techniques (Résumé)

Pour votre gouverne, voici les paramètres utilisés par l'app corrigée :

*   **Client ID** : `196323` (Injecté via .env)
*   **Redirect URI** : `gamestrava://localhost/redirect`
*   **Endpoint** : `https://www.strava.com/oauth/mobile/authorize`
*   **Proxy Expo** : DÉSACTIVÉ (Source d'erreurs fréquente avec Strava)

Tout est prêt. Une fois le paramètre "localhost" sauvegardé sur Strava, le login fonctionnera.
