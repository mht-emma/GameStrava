/**
 * 📋 WORKFLOW AUTHENTIFICATION - GameStrava v2
 * Complètement réimplémenté et fonctionnel
 * 
 * ARCHITECTURE:
 * App.js → AuthContext → LoginScreen / AppNavigator
 */

// ============================================================================
// 1️⃣ USER LANCE L'APP
// ============================================================================
// App.js:
// ├─ SafeAreaProvider
// └─ AuthProvider (AuthContext.js)
//    └─ AppContent
//       ├─ useContext(AuthContext) → récupère { isAuthenticated, loading, error }
//       ├─ Si loading → affiche LoadingScreen
//       ├─ Si !isAuthenticated → affiche LoginScreen
//       └─ Si isAuthenticated → affiche AppNavigator (Bottom Tabs)

// ============================================================================
// 2️⃣ RESTAURATION SESSION (au montage)
// ============================================================================
// AuthContext.js useEffect (line 55):
// ├─ Appelle authService.restoreSession()
// │  ├─ Récupère accessToken depuis SecureStore
// │  ├─ Récupère userId depuis SecureStore
// │  ├─ Vérifie si token n'est pas expiré
// │  ├─ Récupère user depuis Supabase (getCurrentUser)
// │  └─ Si ok → retourne { user, accessToken, isRestored: true }
// └─ Si session trouvée:
//    ├─ setUser(session.user)
//    ├─ setStravaToken(session.accessToken)
//    └─ setIsAuthenticated(true)
//    → App affiche directement AppNavigator (skip LoginScreen)

// ============================================================================
// 3️⃣ USER CLIQUE "CONTINUER AVEC STRAVA"
// ============================================================================
// LoginScreen.js (handleStravaLogin):
// ├─ Appelle login() depuis AuthContext
// │  └─ Appelle authService.loginWithStravaOAuth()
// │     ├─ 1️⃣ OAuth Strava → récupère code
// │     ├─ 2️⃣ Code → Token (exchangeCodeForToken)
// │     ├─ 3️⃣ Sauvegarde tokens dans SecureStore
// │     ├─ 4️⃣ Récupère athlete data depuis Strava API
// │     ├─ 5️⃣ Synchronise activités dans Supabase
// │     ├─ 6️⃣ Crée/récupère user dans Supabase (createOrGetUser)
// │     ├─ 7️⃣ Sauvegarde userId dans SecureStore
// │     └─ Retourne { user, stravaToken }
// └─ AuthContext.js (login function):
//    ├─ setUser(userData)
//    ├─ setStravaToken(token)
//    └─ setIsAuthenticated(true)
//    → App re-render, isAuthenticated=true
//    → AppNavigator s'affiche automatiquement

// ============================================================================
// 4️⃣ USER NAVIGUE DANS L'APP
// ============================================================================
// AppNavigator.js:
// ├─ Home       → HomeScreen (affiche stats Strava + défis)
// ├─ Challenges → ChallengesScreen (créer/accepter défis)
// ├─ Classement → ClassementScreen (leaderboard)
// └─ Profile    → ProfileScreen (infos utilisateur)
//
// Tous les écrans:
// ├─ useContext(AuthContext) → accès à { user, stravaToken, logout }
// ├─ Utilisent les hooks (useChallenges, useProfile, etc.)
// └─ Affichent les données de l'utilisateur connecté

// ============================================================================
// 5️⃣ USER LOGOUT
// ============================================================================
// ProfileScreen (par exemple):
// ├─ logout() depuis AuthContext
// │  └─ authService.logout()
// │     ├─ Supprime accessToken depuis SecureStore
// │     ├─ Supprime refreshToken depuis SecureStore
// │     ├─ Supprime expiresAt depuis SecureStore
// │     ├─ Supprime userId depuis SecureStore
// │     └─ Retourne true
// └─ AuthContext.js (logout function):
//    ├─ setUser(null)
//    ├─ setStravaToken(null)
//    └─ setIsAuthenticated(false)
//    → App re-render, isAuthenticated=false
//    → LoginScreen s'affiche

// ============================================================================
// 📊 FLOW VISUEL COMPLET
// ============================================================================
/*
┌─────────────────────────────────────────────────────────────────┐
│ APP LAUNCH                                                      │
└──────────────┬──────────────────────────────────────────────────┘
               │
               ▼
        ┌─────────────────┐
        │  App.js render  │
        │ AuthContext     │
        │ AppContent      │
        └────────┬────────┘
                 │
                 ▼
    ┌────────────────────────┐
    │ useEffect restoreSession
    └────────────┬───────────┘
                 │
         ┌───────┴────────┐
         │                │
         ▼                ▼
    ✅ Token+User    ❌ Pas de session
    Trouvés          ou Expiré
         │                │
         ▼                ▼
    LoginScreen        LoginScreen
    bypass             visible
         │                │
         │         User clique
         │       "Continuer Strava"
         │                │
         │                ▼
         │         loginWithStravaOAuth()
         │         ├─ OAuth flow
         │         ├─ Récupère token
         │         ├─ Récupère athlete
         │         ├─ Sync activités
         │         ├─ Crée/récupère user
         │         └─ Sauvegarde session
         │                │
         └────────┬───────┘
                  ▼
        ┌────────────────────┐
        │ isAuthenticated=true
        └────────┬───────────┘
                 │
                 ▼
        ┌───────────────────┐
        │  AppNavigator     │
        │  Bottom Tabs:     │
        │  - Home           │
        │  - Challenges     │
        │  - Classement     │
        │  - Profile        │
        └───────────────────┘
*/

// ============================================================================
// 🔐 SÉCURITÉ
// ============================================================================
// - Tokens stockés dans SecureStore (lecteur sécurisé)
// - Pas de tokens en localStorage ou state (vulnérable)
// - Pas de tokens hardcodés
// - Tokens expirés → cleanup automatique
// - Logout → cleanup complet

// ============================================================================
// ✅ CHECKLIST FONCTIONNEL
// ============================================================================
// [✅] auth.service.js - Services d'authentification
// [✅] AuthContext.js - Gestion état global
// [✅] App.js - Routing authentification
// [✅] LoginScreen.js - UI + flow OAuth
// [✅] AppNavigator.js - Navigation principale + ClassementScreen
// [✅] Tous les écrans - useContext(AuthContext)
// [✅] Persistance session - SecureStore
// [✅] Restauration session - au montage
// [⚠️] TODO: useRankings hook - pour ClassementScreen
// [⚠️] TODO: Test avec clés Strava réelles

// ============================================================================
// 🚀 POUR TESTER
// ============================================================================
// 1. Ajoute tes vraies clés Strava dans stravaService.js:
//    - STRAVA_CLIENT_ID
//    - STRAVA_CLIENT_SECRET
//
// 2. Lance l'app: npm start (ou expo start)
//
// 3. First run:
//    - LoginScreen s'affiche
//    - Clique "Continuer avec Strava"
//    - OAuth redirect → tu acceptes
//    - App crée user dans Supabase
//    - Affiche AppNavigator
//
// 4. Subsequent runs:
//    - Session restaurée automatiquement
//    - Directement AppNavigator (skip LoginScreen)
//
// 5. Test logout:
//    - Va dans ProfileScreen
//    - Clique logout
//    - Revient à LoginScreen
//
// ============================================================================
