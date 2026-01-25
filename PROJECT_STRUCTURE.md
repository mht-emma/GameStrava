📚 STRUCTURE COMPLÈTE DU PROJET - Vue d'ensemble

═══════════════════════════════════════════════════════════════════════════

ARBORESCENCE DES FICHIERS MODIFIÉS:

GameStrava/
│
├─ 📄 App.js (REFACTORISÉ)
│  ├─ Utilise AuthContext (plus de state local isLoggedIn)
│  ├─ AppContent gère 3 états: loading, !auth, auth
│  └─ Affiche LoginScreen OU AppNavigator

├─ 📂 src/
│  │
│  ├─ 🔐 services/
│  │  ├─ auth.service.js (CRÉÉ) ✨
│  │  │  ├─ loginWithStravaOAuth()
│  │  │  ├─ createOrGetUser()
│  │  │  ├─ saveStravaTokens()
│  │  │  ├─ restoreSession()
│  │  │  ├─ logout()
│  │  │  └─ Token management functions
│  │  │
│  │  ├─ stravaService.js ✅
│  │  │  ├─ loginWithStrava() - OAuth
│  │  │  ├─ exchangeCodeForToken()
│  │  │  ├─ getAthlete()
│  │  │  └─ getActivities()
│  │  │
│  │  ├─ sync.service.js ✅
│  │  │  └─ syncActivities()
│  │  │
│  │  └─ supabaseClient.js ✅
│  │
│  ├─ 📋 context/
│  │  └─ AuthContext.js (REFACTORISÉ) ✨
│  │     ├─ useEffect: restoreSession()
│  │     ├─ login() → authService.loginWithStravaOAuth()
│  │     ├─ logout() → authService.logout()
│  │     ├─ States: user, stravaToken, loading, error
│  │     └─ Expose: { user, stravaToken, login, logout, isAuth, loading }
│  │
│  ├─ 🎨 screens/
│  │  ├─ LoginScreen.js (MODIFIÉ) ✨
│  │  │  ├─ useContext(AuthContext)
│  │  │  ├─ handleStravaLogin() → context.login()
│  │  │  ├─ Affiche loading + errors
│  │  │  └─ OAuth flow intégré
│  │  │
│  │  ├─ HomeScreen.js ✅
│  │  │  ├─ useContext(AuthContext) → { user }
│  │  │  ├─ Affiche user + stats
│  │  │  └─ useChallenges hook
│  │  │
│  │  ├─ ChallengesScreen.js ✅
│  │  │  ├─ useContext(AuthContext) → { user }
│  │  │  ├─ useChallenges hook
│  │  │  └─ Créer/accepter défis
│  │  │
│  │  ├─ ClassementScreen.js ✅
│  │  │  ├─ useContext(AuthContext) → { user }
│  │  │  ├─ useRankings hook (to implement)
│  │  │  └─ Leaderboard view
│  │  │
│  │  └─ ProfileScreen.js ✅
│  │     ├─ useContext(AuthContext) → { user, logout }
│  │     ├─ useProfile hook
│  │     └─ Logout button
│  │
│  ├─ 🧭 navigation/
│  │  └─ AppNavigator.js (MODIFIÉ) ✨
│  │     ├─ Import ClassementScreen
│  │     ├─ 4 onglets:
│  │     │  ├─ Home → HomeScreen
│  │     │  ├─ Challenges → ChallengesScreen
│  │     │  ├─ Classement → ClassementScreen (ADDED)
│  │     │  └─ Profile → ProfileScreen
│  │     └─ Bottom tab navigator
│  │
│  ├─ 🎣 hooks/
│  │  ├─ useAuth.js ✅
│  │  ├─ useChallenges.js ✅
│  │  ├─ useProfile.js ✅
│  │  ├─ useRankings.js (to implement)
│  │  └─ useUserStats.js ✅
│  │
│  ├─ 🧩 components/
│  │  ├─ ButtonPrimary.js ✅
│  │  ├─ Card.js ✅
│  │  ├─ StatCard.js ✅
│  │  ├─ Avatar.js ✅
│  │  ├─ ProgressBar.js ✅
│  │  ├─ Loader.js ✅
│  │  ├─ Badge.js ✅
│  │  ├─ Icon.js ✅
│  │  └─ TabIcon.js ✅
│  │
│  ├─ 🎨 theme/
│  │  ├─ colors.js ✅
│  │  ├─ spacing.js ✅
│  │  ├─ typography.js ✅
│  │  ├─ icons.js ✅
│  │  ├─ animations.js ✅
│  │  └─ index.js ✅
│  │
│  └─ 🛠️ utils/
│     ├─ challengeRules.js ✅
│     ├─ pointsRules.js ✅
│     ├─ challengeDifficulty.js ✅
│     └─ challengeHelpers.js ✅
│
├─ 📚 Documentation (CRÉÉE) ✨
│  ├─ WORKFLOW_AUTH.md - Flowchart complet
│  ├─ CHECKLIST_IMPLEMENTATION.md - Résumé changes
│  ├─ README_CHANGES.md - Vue d'ensemble
│  └─ QUICK_START.md - Guide de test
│
├─ package.json ✅
├─ index.js ✅
└─ app.json ✅

═══════════════════════════════════════════════════════════════════════════

DEPENDENCIES:

Production:
  ├─ React Native 0.81.5
  ├─ Expo 54.0.30
  ├─ @react-navigation/native ✅
  ├─ @react-navigation/bottom-tabs ✅
  ├─ @supabase/supabase-js ✅
  ├─ expo-auth-session ✅
  ├─ expo-web-browser ✅
  ├─ expo-secure-store ✅ (TOKENS SÉCURISÉS)
  ├─ expo-linear-gradient ✅
  ├─ react-native-reanimated ✅
  ├─ @expo/vector-icons ✅
  └─ ...

═══════════════════════════════════════════════════════════════════════════

DATA FLOW (Authentification):

                    ┌──────────────────┐
                    │   App Launches   │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │  AuthProvider    │
                    │  (AuthContext)   │
                    └────────┬─────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
        useEffect              ┌───────────▼──────────┐
         │                     │ AppContent renders   │
         │                     └──────────┬───────────┘
         │                                │
         └─────► restoreSession()         │
                        │                 │
              ┌─────────┴──────────┐      │
              │                    │      │
          ✅ Found         ❌ Not Found  │
              │                    │      │
              │            ┌───────▼──────▼──┐
              │            │ isAuthenticated  │
              │            │ = false          │
              │            └─────────┬────────┘
              │                      │
        ┌─────▼────────┐      ┌──────▼────────┐
        │ setUser()    │      │ LoginScreen   │
        │ setToken()   │      │ appears       │
        │ setAuth(true)│      └──────┬────────┘
        └─────┬────────┘             │
              │                 User clicks
              │           "Continue with Strava"
              │                      │
              │            ┌─────────▼──────────┐
              │            │ handleStravaLogin()│
              │            │ context.login()    │
              │            └─────────┬──────────┘
              │                      │
              │        loginWithStravaOAuth()
              │                      │
              │        ┌─────────────┼─────────────┐
              │        │             │             │
              │   OAuth Flow   Sync Data   Create User
              │        │             │             │
              │        └─────────────┼─────────────┘
              │                      │
              │        ┌─────────────▼─────────────┐
              │        │ Save tokens (SecureStore) │
              │        │ Save userId (SecureStore) │
              │        └─────────────┬─────────────┘
              │                      │
              │        ┌─────────────▼──────────┐
              │        │ Return { user, token }│
              │        └─────────────┬──────────┘
              │                      │
              │        ┌─────────────▼──────────┐
              └────────► setUser(userData)       │
                       │ setToken(token)        │
                       │ setAuth(true)          │
                       └──────────┬─────────────┘
                                  │
                         ┌────────▼──────────┐
                         │ AppNavigator      │
                         │ (4 onglets)       │
                         └───────────────────┘

═══════════════════════════════════════════════════════════════════════════

STATE MANAGEMENT (AuthContext):

┌────────────────────────────────────────────────────────────┐
│ AuthContext.Provider VALUE                                 │
├────────────────────────────────────────────────────────────┤
│                                                             │
│ user: {                                                    │
│   id: string                                               │
│   username: string                                         │
│   email: string                                            │
│   avatar: string                                           │
│   level: number                                            │
│   xp: number                                               │
│   ...                                                      │
│ } | null                                                   │
│                                                             │
│ stravaToken: string | null                                 │
│                                                             │
│ login: async () => Promise<user>                           │
│   └─ Déclenche OAuth Strava complet                        │
│                                                             │
│ logout: async () => Promise<boolean>                       │
│   └─ Nettoie tokens + user                                 │
│                                                             │
│ isAuthenticated: boolean                                   │
│   └─ true si user && stravaToken existent                  │
│                                                             │
│ loading: boolean                                            │
│   └─ true pendant OAuth ou restoreSession                  │
│                                                             │
│ error: string | null                                        │
│   └─ Message d'erreur si authentification échoue           │
│                                                             │
└────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════

SECURE STORAGE (SecureStore):

Clé                    Type      Usage
─────────────────────────────────────────────────────────────
strava_access_token    string    API calls à Strava
strava_refresh_token   string    Refresh token (futur)
strava_expires_at      number    Token expiration check
user_id                string    Session restoration

═══════════════════════════════════════════════════════════════════════════

API INTEGRATIONS:

1. Strava OAuth 2.0
   ├─ https://www.strava.com/oauth/mobile/authorize
   ├─ https://www.strava.com/oauth/token
   └─ https://www.strava.com/api/v3/athlete
      └─ Activities, athlete data, etc.

2. Supabase
   ├─ profiles table
   ├─ activities table
   ├─ challenges table
   └─ challenge_participant table

═══════════════════════════════════════════════════════════════════════════

COMPONENT TREE:

App
  └─ SafeAreaProvider
     └─ AuthProvider
        └─ AppContent
           ├─ loading → LoadingScreen
           ├─ !authenticated → LoginScreen
           │  ├─ LogoAnimation
           │  ├─ EmailInput
           │  ├─ PasswordInput
           │  ├─ LoginButton (disabled)
           │  └─ StravaButton (active)
           │     └─ OAuth flow
           │
           └─ authenticated → AppNavigator
              ├─ Tab.Navigator
              │  ├─ Home
              │  │  └─ HomeScreen
              │  │     ├─ Header
              │  │     ├─ SearchBar
              │  │     ├─ StatsCard
              │  │     └─ ChallengesList
              │  │
              │  ├─ Challenges
              │  │  └─ ChallengesScreen
              │  │     ├─ CreateForm
              │  │     ├─ SearchBar
              │  │     └─ ChallengesList
              │  │
              │  ├─ Classement
              │  │  └─ ClassementScreen
              │  │     ├─ Tabs (Points/XP)
              │  │     ├─ YourRankCard
              │  │     └─ RankingsList
              │  │
              │  └─ Profile
              │     └─ ProfileScreen
              │        ├─ AvatarSection
              │        ├─ StatsSection
              │        ├─ BadgesSection
              │        ├─ RecentActivity
              │        └─ LogoutButton

═══════════════════════════════════════════════════════════════════════════

KEY FILES SUMMARY:

✅ App.js
   └─ Entry point, routing auth logic

✅ src/services/auth.service.js ✨
   └─ Core authentication logic

✅ src/context/AuthContext.js ✨
   └─ Global state + session management

✅ src/screens/LoginScreen.js ✨
   └─ OAuth Strava UI + flow

✅ src/navigation/AppNavigator.js ✨
   └─ Bottom tab navigation

✅ WORKFLOW_AUTH.md ✨
   └─ Architecture flowchart

✅ QUICK_START.md ✨
   └─ Testing guide

═══════════════════════════════════════════════════════════════════════════

TOUT EST PRÊT! 🚀

Ajoute tes clés Strava et lance `npm start`!

═══════════════════════════════════════════════════════════════════════════
