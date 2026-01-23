/**
 * ⚙️ CONFIGURATION GLOBALE
 * Gère les constantes et les flags de fonctionnalités (Startups flags)
 */

// 🚧 MODE DÉMO (Bypass Strava OAuth)
// Mettre à false pour revenir au comportement normal
export const DEMO_MODE = true;

// 👤 UTILISATEUR DÉMO
export const DEMO_USER_ID = "demo_user_1"; // ID fictif compatible format Strava
export const DEMO_USER = {
    id: "demo_user_1", // user_id (PK)
    username: "DemoAthlete",
    firstname: "Demo",
    lastname: "Athlete",
    profile: "https://ui-avatars.com/api/?name=Demo+Athlete&background=69a342&color=fff",
    city: "Paris",
    country: "France",
    sex: "M",
    weight: 70.0,
    height: 175.0,
};
