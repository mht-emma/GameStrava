// src/screens/LoginScreen.js
import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Pressable, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp, FadeIn, useAnimatedStyle, withSpring, withSequence, withTiming, useSharedValue } from 'react-native-reanimated';
import { Card, ButtonPrimary } from '../components';
import Icon from '../components/Icon';
import { colors, spacing, typography, borderRadius } from '../theme';
import { icons } from '../theme/icons';
import { AuthContext } from '../context/AuthContext';

/**
 * 🔐 LOGIN SCREEN - DARK MODE (GREEN & GREY)
 * Intégré avec authentification OAuth Strava réelle
 */
const LoginScreen = () => {
  const { login, loading: authLoading, error: authError } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const logoScale = useSharedValue(1);
  const logoRotate = useSharedValue(0);

  /**
   * 🔓 Gère le login Strava OAuth réel
   */
  const handleStravaLogin = async () => {
    try {
      logoScale.value = withSequence(withSpring(1.2), withSpring(1));
      logoRotate.value = withSequence(withTiming(360, { duration: 600 }), withTiming(0, { duration: 0 }));

      await login();
      // Le succès est géré par AuthContext → App.js rendra AppNavigator
      Alert.alert('✅ Succès', 'Authentification réussie!');
    } catch (err) {
      console.error('❌ Login error:', err);
      Alert.alert('❌ Erreur', err.message || 'Authentification échouée');
    }
  };

  /**
   * ⚠️ Login local (pour développement/fallback)
   */
  const handleLocalLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }
    Alert.alert('ℹ️', 'Cette fonction est désactivée. Utilisez Strava.');
  };

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }, { rotate: `${logoRotate.value}deg` }],
  }));

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {/* Background sombre */}
      <LinearGradient
        colors={['#121212', '#1A1A1A', '#000000']}
        style={styles.backgroundGradient}
      />

      {/* Orbes décoratives subtiles */}
      <Animated.View entering={FadeIn.delay(300)} style={[styles.floatingOrb, styles.orb1]} />
      <Animated.View entering={FadeIn.delay(500)} style={[styles.floatingOrb, styles.orb2]} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Header Section */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
          <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
            <View style={styles.logoOuterRing}>
              <LinearGradient colors={['#69a342', '#69a342']} style={styles.logoInner}>
                <Icon name={icons.running} size={42} color="#121212" />
              </LinearGradient>
            </View>
          </Animated.View>

          <Text style={styles.title}>AthletiX</Text>
          <View style={styles.taglineContainer}>
            <View style={styles.accentLine} />
            <Text style={styles.subtitle}>Défie tes limites</Text>
            <View style={styles.accentLine} />
          </View>
        </Animated.View>

        {/* Form Card */}
        <Animated.View entering={FadeInUp.delay(500).springify()} style={styles.glassCard}>
          <View style={styles.cardContent}>

            {/* Input Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <View style={[styles.inputWrapper, emailFocused && styles.inputWrapperFocused]}>
                <Icon name={icons.mail} size={20} color={emailFocused ? '#69a342' : '#666'} />
                <TextInput
                  style={styles.input}
                  placeholder="votre@email.com"
                  placeholderTextColor="#444"
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                />
              </View>
            </View>

            {/* Input Password */}
            <View style={styles.inputContainer}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Mot de passe</Text>
                <TouchableOpacity><Text style={styles.forgotText}>Oublié ?</Text></TouchableOpacity>
              </View>
              <View style={[styles.inputWrapper, passwordFocused && styles.inputWrapperFocused]}>
                <Icon name={icons.lock} size={20} color={passwordFocused ? '#69a342' : '#666'} />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#444"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                />
              </View>
            </View>

            {/* Login Button */}
            <Pressable onPress={handleLocalLogin} disabled={authLoading} style={({ pressed }) => [styles.loginButton, (pressed || authLoading) && { opacity: 0.6 }]}>
              <LinearGradient colors={['#69a342', '#69a342']} style={styles.loginButtonGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={styles.loginButtonText}>{authLoading ? '⏳ Chargement...' : 'SE CONNECTER'}</Text>
              </LinearGradient>
            </Pressable>

            <View style={styles.divider}>
              <View style={styles.dividerLine} /><Text style={styles.dividerText}>OU</Text><View style={styles.dividerLine} />
            </View>

            {/* Strava Button - AUTHENTIFICATION RÉELLE */}
            <TouchableOpacity
              style={[styles.stravaButton, authLoading && { opacity: 0.6 }]}
              onPress={handleStravaLogin}
              disabled={authLoading}
            >
              <Icon name={icons.sync} size={20} color="#FFF" />
              <Text style={styles.stravaButtonText}>
                {authLoading ? '⏳ Connexion...' : 'Continuer avec Strava'}
              </Text>
            </TouchableOpacity>

            {/* Affichage des erreurs */}
            {authError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>❌ {authError}</Text>
              </View>
            )}
          </View>
        </Animated.View>

        {/* Footer */}
        <TouchableOpacity style={styles.footer}>
          <Text style={styles.footerText}>Pas de compte ? <Text style={styles.footerLink}>S'inscrire</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  backgroundGradient: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  floatingOrb: { position: 'absolute', width: 250, height: 250, borderRadius: 125, opacity: 0.05 },
  orb1: { backgroundColor: '#69a342', top: -50, right: -50 },
  orb2: { backgroundColor: '#333', bottom: -50, left: -50 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 60 },
  header: { alignItems: 'center', marginBottom: 30 },
  logoContainer: { width: 100, height: 100 },
  logoOuterRing: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(46, 204, 113, 0.1)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(46, 204, 113, 0.2)' },
  logoInner: { width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 38, fontWeight: '900', color: '#FFF', marginTop: 15 },
  taglineContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  accentLine: { width: 30, height: 2, backgroundColor: '#69a342' },
  subtitle: { color: '#666', marginHorizontal: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  glassCard: { backgroundColor: '#1E1E1E', borderRadius: 24, borderWidth: 1, borderColor: '#333', overflow: 'hidden' },
  cardContent: { padding: 25 },
  inputContainer: { marginBottom: 20 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { color: '#AAA', fontSize: 13, fontWeight: '600', marginBottom: 8 },
  forgotText: { color: '#69a342', fontSize: 12 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#252525', borderRadius: 12, borderWidth: 1, borderColor: '#333', paddingHorizontal: 15, height: 55 },
  inputWrapperFocused: { borderColor: '#69a342' },
  input: { flex: 1, color: '#FFF', marginLeft: 10, fontSize: 15 },
  loginButton: { borderRadius: 12, overflow: 'hidden', marginTop: 10 },
  loginButtonGradient: { height: 55, justifyContent: 'center', alignItems: 'center' },
  loginButtonText: { color: '#121212', fontWeight: '800', fontSize: 16, letterSpacing: 1 },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 25 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#333' },
  dividerText: { color: '#444', marginHorizontal: 15, fontWeight: '700' },
  stravaButton: { flexDirection: 'row', height: 55, borderRadius: 12, borderWidth: 1, borderColor: '#444', justifyContent: 'center', alignItems: 'center', gap: 10 },
  stravaButtonText: { color: '#FFF', fontWeight: '600' },
  errorContainer: { marginTop: 15, backgroundColor: '#5E1C1C', borderRadius: 8, padding: 12, borderLeftWidth: 4, borderLeftColor: '#EF4444' },
  errorText: { color: '#FFA5A5', fontSize: 13, fontWeight: '500' },
  footer: { marginTop: 30, alignItems: 'center', marginBottom: 40 },
  footerText: { color: '#666' },
  footerLink: { color: '#69a342', fontWeight: '700' },
});

export default LoginScreen;