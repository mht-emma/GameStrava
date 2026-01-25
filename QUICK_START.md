🚀 QUICK START - TESTER L'APP

═════════════════════════════════════════════════════════════════════════

ÉTAPE 1: Ajouter les clés Strava
─────────────────────────────────

Fichier: src/services/stravaService.js
Lignes: 20-21

❌ AVANT:
const STRAVA_CLIENT_ID = 'TON_CLIENT_ID';
const STRAVA_CLIENT_SECRET = 'TON_CLIENT_SECRET';

✅ APRÈS:
const STRAVA_CLIENT_ID = '12345'; // Ton vrai client ID
const STRAVA_CLIENT_SECRET = 'abc123def456'; // Ton vrai secret

📝 Où trouver tes clés?
   └─ https://www.strava.com/settings/api
      ├─ Register app
      ├─ Récupère Client ID
      └─ Récupère Client Secret

═════════════════════════════════════════════════════════════════════════

ÉTAPE 2: Vérifier Supabase
──────────────────────────

Fichier: src/services/supabaseClient.js

Vérifie que les clés sont correctes:
  ├─ SUPABASE_URL
  └─ SUPABASE_ANON_KEY

Et que les tables existent dans ta BD:
  ├─ profiles
  ├─ activities
  ├─ challenges
  └─ challenge_participant

═════════════════════════════════════════════════════════════════════════

ÉTAPE 3: Lancer l'app
────────────────────

Terminal:
  npm start
  
  ou

  expo start

─ Ios: Appuie sur 'i'
─ Android: Appuie sur 'a'
─ Web: Appuie sur 'w'

═════════════════════════════════════════════════════════════════════════

ÉTAPE 4: Tester le flow
───────────────────────

1️⃣ APP LAUNCH
   ├─ Vois-tu LoginScreen?
   │  └─ Si OUI: pas de session sauvegardée ✅
   │  └─ Si NON: session restaurée (skip LoginScreen) ✅
   └─ Console: regarder logs

2️⃣ LOGIN AVEC STRAVA
   ├─ Clique "Continuer avec Strava"
   ├─ Browser s'ouvre?
   │  └─ Si OUI: OAuth flow se lance ✅
   │  └─ Si NON: check Strava keys + logs
   ├─ Tu vois "Authorize GameStrava"?
   │  └─ Si OUI: clique "Authorize" ✅
   │  └─ Si NON: problème d'enregistrement app Strava
   └─ Attends le retour à l'app (~3-5 sec)

3️⃣ APRÈS LOGIN
   ├─ AppNavigator s'affiche?
   │  └─ Si OUI: authentification réussie ✅
   │  └─ Si NON: check logs pour erreurs
   ├─ Vois-tu ton nom/avatar?
   │  └─ Si OUI: user créé dans Supabase ✅
   │  └─ Si NON: check Supabase tables
   └─ HomeScreen affiche tes stats Strava?
      └─ Si OUI: synchronisation OK ✅
      └─ Si NON: check sync.service logs

4️⃣ NAVIGUE LES ÉCRANS
   ├─ HomeScreen: défis + stats
   ├─ ChallengesScreen: créer défis
   ├─ ClassementScreen: leaderboard
   └─ ProfileScreen: profil + logout

5️⃣ TEST LOGOUT
   ├─ ProfileScreen (bas à droite) → scroll down
   ├─ Clique le bouton logout
   ├─ Revenu à LoginScreen?
   │  └─ Si OUI: logout OK ✅
   │  └─ Si NON: check console
   └─ SessionStorage clear?
      └─ Relaunch app: LoginScreen devrait s'afficher

6️⃣ TEST SESSION PERSISTANCE
   ├─ Close et reopen app
   ├─ AppNavigator s'affiche directement?
   │  └─ Si OUI: session restaurée ✅
   │  └─ Si NON: check SecureStore logs

═════════════════════════════════════════════════════════════════════════

📋 CHECKLIST DE TEST COMPLET:

Authentication:
  [ ] LoginScreen s'affiche au premier launch
  [ ] Bouton "Continuer avec Strava" fonctionne
  [ ] OAuth browser redirect fonctionne
  [ ] User crée dans Supabase après auth
  [ ] AppNavigator s'affiche après login
  [ ] Tokens stockés dans SecureStore
  [ ] Session restaurée au relaunch
  [ ] Logout nettoie tout

Navigation:
  [ ] HomeScreen accessible
  [ ] ChallengesScreen accessible
  [ ] ClassementScreen accessible
  [ ] ProfileScreen accessible
  [ ] Tab bar nav fonctionne
  [ ] Bottom tabs affichent le bon écran

Data:
  [ ] HomeScreen affiche user name
  [ ] HomeScreen affiche stats Strava
  [ ] Activités synchronisées
  [ ] Défis affichés
  [ ] Classement affiche users
  [ ] ProfileScreen affiche user info

Error Handling:
  [ ] Erreur réseau: affichage graceful
  [ ] Token expiré: logout automatique
  [ ] Strava auth fail: message d'erreur clair
  [ ] Supabase fail: message d'erreur clair

═════════════════════════════════════════════════════════════════════════

🐛 TROUBLESHOOTING:

Problème: LoginScreen n'affiche pas
Solution:
  ├─ Check: AuthContext useEffect runs?
  │  └─ Add console.log('🔍 Restauring session...') 
  ├─ Check: restoreSession() returns null?
  │  └─ C'est normal (première visite)
  └─ Check: isAuthenticated = false?

Problème: OAuth button ne fait rien
Solution:
  ├─ Check: Strava CLIENT_ID est valide?
  │  └─ src/services/stravaService.js line 20
  ├─ Check: URL de redirection configurée dans Strava app?
  │  └─ https://www.strava.com/settings/api
  └─ Check: Console errors?
     └─ Terminal: voir les logs

Problème: Login success mais pas d'AppNavigator
Solution:
  ├─ Check: User crée dans Supabase profiles?
  │  └─ https://app.supabase.com → profiles table
  ├─ Check: isAuthenticated = true?
  │  └─ Add console.log in AuthContext.login()
  └─ Check: Erreur Supabase?
     └─ Browser dev tools → Network tab

Problème: Session ne persist pas
Solution:
  ├─ Check: SecureStore disponible?
  │  └─ expo-secure-store installed?
  ├─ Check: saveUserId() called?
  │  └─ Console.log in auth.service.js line 133
  └─ Check: getStoredUserId() récupère?
     └─ Console.log in restoreSession()

═════════════════════════════════════════════════════════════════════════

🔍 LOGS À SURVEILLER:

Au launch:
  ├─ 🔍 Recherche session existante...
  └─ ✅ Session restaurée (ou ❌ Pas de session)

Lors du login:
  ├─ 🔓 Démarrage authentification Strava...
  ├─ ✅ Code reçu: ...
  ├─ ✅ Token reçu
  ├─ ✅ Tokens sauvegardés
  ├─ ✅ Infos athlète reçues: XXX
  ├─ ✅ Activités synchronisées
  ├─ ✅ Utilisateur Supabase configuré: XXX
  ├─ ✅ Session persistée
  └─ ✅ Authentification réussie: XXX

Erreurs:
  ├─ ❌ Erreur authentification: ...
  ├─ ❌ Erreur restauration session: ...
  └─ ❌ Erreur Supabase: ...

═════════════════════════════════════════════════════════════════════════

✅ QUAND TU VOIS ÇA:

1. ✅ LoginScreen → Clique Strava → OAuth redirects
2. ✅ Browser ferme → App affiche AppNavigator
3. ✅ HomeScreen montre ton nom + avatar
4. ✅ Tes activités Strava affichées
5. ✅ Relaunch app → Session restaurée (skip LoginScreen)
6. ✅ ProfileScreen logout fonctionne

= L'APP FONCTIONNE PARFAITEMENT! 🎉

═════════════════════════════════════════════════════════════════════════

💬 QUESTIONS?

1. Workflow pas clair?
   └─ Lis WORKFLOW_AUTH.md

2. Quoi tester en priorité?
   └─ Lis CHECKLIST_IMPLEMENTATION.md

3. Détails des changements?
   └─ Lis README_CHANGES.md

═════════════════════════════════════════════════════════════════════════

LET'S GO! 🚀

Ajoute les clés Strava et lances `npm start`!

═════════════════════════════════════════════════════════════════════════
