// src/screens/ChallengesScreen.js

import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp, SlideInRight, ZoomIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Card, ButtonPrimary, ProgressBar, Loader } from '../components';
import Icon from '../components/Icon';
import { spacing, typography, borderRadius, inputHeight, inputPadding, iconSizes, cardPadding, sectionSpacing, shadows } from '../theme';
import { AuthContext } from '../context/AuthContext';
import { useChallenges } from '../hooks/useChallenge';
import { challengeTypes, getChallengeTypeInfo, getChallengeProgressLabel } from '../utils/challengeHelpers';

const { width } = Dimensions.get('window');

// Palette de couleurs professionnelle avec pistache
const colors = {
  black: '#000000',
  darkGrey: '#121212',
  mediumGrey: '#444444',
  brandGreen: '#69a342', // Vert pistache
  textGrey: '#AAAAAA',
  white: '#FFFFFF',
  
  // Extensions professionnelles
  background: '#000000',
  surface: '#121212',
  surfaceLight: '#1A1A1A',
  primary: '#69a342',
  primaryDark: '#69a342',
  primaryLight: '#69a342',
  
  text: {
    primary: '#FFFFFF',
    secondary: '#AAAAAA',
    tertiary: '#666666',
  },
  
  gray: {
    dark: '#121212',
    medium: '#444444',
    light: '#666666',
  },
  
  status: {
    success: '#69a342',
    warning: '#F39C12',
    error: '#E74C3C',
    info: '#3498DB',
  },
  
  gradients: {
    premium: ['#000000', '#0A0A0A', '#121212'],
    primary: ['#69a342', '#69a342'],
    glass: ['rgba(18, 18, 18, 0.9)', 'rgba(26, 26, 26, 0.8)'],
  },
};

/**
 * 🎯 ÉCRAN DES DÉFIS PROFESSIONNEL
 * Design moderne avec animations et thème sombre élégant
 */
const ChallengesScreen = () => {
  const { user } = useContext(AuthContext);
  const { challenges, loading, createChallenge, acceptChallenge, refuseChallenge } = useChallenges(user?.id);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'DISTANCE_TOTAL',
    target: '',
    sport: 'RUN',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Configuration des types de défis disponibles (importée depuis challengeHelpers)

  const handleCreateChallenge = async () => {
    console.log('🎯 Création défi:', formData);

    if (!formData.target || formData.target <= 0) {
      alert('Le target doit être positif');
      return;
    }

    try {
      await createChallenge({
        type: formData.type,
        target: parseFloat(formData.target),
        sport: formData.sport,
        creatorId: user?.id
      });
      setShowCreateForm(false);
      setFormData({
        type: 'DISTANCE_TOTAL',
        target: '',
        sport: 'RUN',
      });
    } catch (error) {
      console.error('Erreur lors de la création du défi:', error);
      alert('Erreur lors de la création du défi');
    }
  };

  const handleAccept = async (challengeId) => {
    console.log('✅ Accepter défi:', challengeId);
    try {
      await acceptChallenge(challengeId);
    } catch (error) {
      console.error('Erreur lors de l\'acceptation du défi:', error);
      alert('Erreur lors de l\'acceptation du défi');
    }
  };

  const handleRefuse = async (challengeId) => {
    console.log('❌ Refuser défi:', challengeId);
    try {
      await refuseChallenge(challengeId);
    } catch (error) {
      console.error('Erreur lors du refus du défi:', error);
      alert('Erreur lors du refus du défi');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'INVITED': return colors.status.warning;
      case 'ACTIVE': return colors.primary;
      case 'COMPLETED': return colors.status.success;
      case 'FAILED': return colors.status.error;
      case 'REFUSED': return colors.gray.medium;
      default: return colors.gray.medium;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'INVITED': return 'Invitation';
      case 'ACTIVE': return 'En cours';
      case 'COMPLETED': return 'Terminé';
      case 'FAILED': return 'Échoué';
      case 'REFUSED': return 'Refusé';
      default: return status;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.black} />
      
      <LinearGradient
        colors={colors.gradients.premium}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header moderne avec animation */}
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          style={styles.header}
        >
          <View>
            <Text style={styles.title}>Mes Défis</Text>
            <Text style={styles.subtitle}>Suivez votre progression</Text>
          </View>
          <TouchableOpacity
            style={[styles.createButton, showCreateForm && styles.createButtonActive]}
            onPress={() => setShowCreateForm(!showCreateForm)}
          >
            <Ionicons
              name={showCreateForm ? 'close' : 'add'}
              size={24}
              color={showCreateForm ? colors.black : colors.white}
            />
          </TouchableOpacity>
        </Animated.View>

        {/* Formulaire de création moderne avec animation */}
        {showCreateForm && (
          <Animated.View
            entering={ZoomIn.springify()}
            style={styles.createFormContainer}
          >
            <Card style={styles.createCard} variant="glass">
              <View style={styles.formHeader}>
                <View style={styles.formIconContainer}>
                  <Ionicons name="trophy" size={24} color={colors.brandGreen} />
                </View>
                <Text style={styles.formTitle}>Nouveau Défi</Text>
              </View>

              {/* Type */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Type de défi</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.challengeTypesScroll}
                >
                  {challengeTypes.map((challengeType) => (
                    <TouchableOpacity
                      key={challengeType.key}
                      style={[
                        styles.challengeTypeCard,
                        formData.type === challengeType.key && styles.challengeTypeCardActive
                      ]}
                      onPress={() => setFormData({ ...formData, type: challengeType.key })}
                    >
                      <View style={styles.challengeTypeIcon}>
                        <Icon
                          name={challengeType.icon}
                          size={20}
                          color={formData.type === challengeType.key ? colors.black : colors.brandGreen}
                        />
                      </View>
                      <Text style={[
                        styles.challengeTypeLabel,
                        formData.type === challengeType.key && styles.challengeTypeLabelActive
                      ]}>
                        {challengeType.label}
                      </Text>
                      <Text style={[
                        styles.challengeTypeDesc,
                        formData.type === challengeType.key && styles.challengeTypeDescActive
                      ]}>
                        {challengeType.description}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Target */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  Objectif ({challengeTypes.find(t => t.key === formData.type)?.unit || 'unités'})
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder={challengeTypes.find(t => t.key === formData.type)?.placeholder || "Entrez votre objectif"}
                  placeholderTextColor={colors.textGrey}
                  keyboardType="numeric"
                  value={formData.target}
                  onChangeText={(value) => setFormData({ ...formData, target: value })}
                />
              </View>

              {/* Sport */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Type d'activité</Text>
                <View style={styles.radioGroup}>
                  <TouchableOpacity
                    style={[
                      styles.radioButton,
                      formData.sport === 'RUN' && styles.radioButtonActive
                    ]}
                    onPress={() => setFormData({ ...formData, sport: 'RUN' })}
                  >
                    <Ionicons 
                      name="walk" 
                      size={18} 
                      color={formData.sport === 'RUN' ? colors.black : colors.brandGreen} 
                    />
                    <Text style={[
                      styles.radioButtonText,
                      formData.sport === 'RUN' && styles.radioButtonTextActive
                    ]}>
                      Course
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.radioButton,
                      formData.sport === 'BIKE' && styles.radioButtonActive
                    ]}
                    onPress={() => setFormData({ ...formData, sport: 'BIKE' })}
                  >
                    <Ionicons 
                      name="bicycle" 
                      size={18} 
                      color={formData.sport === 'BIKE' ? colors.black : colors.brandGreen} 
                    />
                    <Text style={[
                      styles.radioButtonText,
                      formData.sport === 'BIKE' && styles.radioButtonTextActive
                    ]}>
                      Vélo
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity 
                style={styles.submitButton}
                onPress={handleCreateChallenge}
              >
                <LinearGradient
                  colors={colors.gradients.primary}
                  style={styles.submitButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.submitButtonText}>Créer le défi</Text>
                  <Ionicons name="arrow-forward" size={20} color={colors.black} />
                </LinearGradient>
              </TouchableOpacity>
            </Card>
          </Animated.View>
        )}

        {/* SEARCH BAR */}
        <View style={styles.searchContainer}>
          <TouchableOpacity 
            style={styles.searchToggle}
            onPress={() => setShowSearch(!showSearch)}
          >
            <Ionicons name="search" size={20} color={colors.brandGreen} />
            <Text style={styles.searchToggleText}>
              {showSearch ? 'Masquer la recherche' : 'Rechercher des défis'}
            </Text>
          </TouchableOpacity>
          
          {showSearch && (
            <View style={styles.searchInputContainer}>
              <Ionicons name="search" size={20} color={colors.textGrey} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Titre, créateur, sport..."
                placeholderTextColor={colors.textGrey}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus={true}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity 
                  style={styles.clearButton}
                  onPress={() => setSearchQuery('')}
                >
                  <Ionicons name="close-circle" size={20} color={colors.textGrey} />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Liste des défis */}
        <Animated.View
          entering={FadeInUp.delay(600).springify()}
          style={styles.challengesList}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <Loader size="large" />
              <Text style={styles.loadingText}>Chargement des défis...</Text>
            </View>
          ) : (
            <>
              {challenges.length > 0 && (
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Défis Actifs</Text>
                  <View style={styles.countBadge}>
                    <Text style={styles.countText}>{challenges.length}</Text>
                  </View>
                </View>
              )}

              {challenges
                .filter(challenge => 
                  challenge.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  challenge.creator_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  challenge.sport?.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((challenge, index) => (
            <Animated.View
              key={challenge.challenge_id}
              entering={SlideInRight.delay(700 + index * 100).springify()}
            >
              <Card style={styles.challengeCard} variant="elevated">
                {/* Header du défi */}
                <View style={styles.challengeHeader}>
                  <LinearGradient
                    colors={colors.gradients.primary}
                    style={styles.challengeIconContainer}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Ionicons
                      name={challenge.sport === 'RUN' ? 'walk' : 'bicycle'}
                      size={28}
                      color={colors.black}
                    />
                  </LinearGradient>
                  <View style={styles.challengeInfo}>
                    <Text style={styles.challengeTitle}>
                      {getChallengeTypeInfo(challenge.type).progressLabel(challenge.target, challenge.target)}
                    </Text>
                    <View style={styles.metaRow}>
                      <Ionicons name="person" size={12} color={colors.textGrey} />
                      <Text style={styles.challengeSubtitle}>
                        {challenge.creator_name || 'Personnel'}
                      </Text>
                      <View style={styles.dot} />
                      <Text style={styles.challengeSubtitle}>
                        {challenge.sport === 'RUN' ? 'Course' : 'Vélo'}
                      </Text>
                    </View>
                  </View>
                  <View style={[
                    styles.statusBadge, 
                    { backgroundColor: getStatusColor(challenge.participant_status) + '20' }
                  ]}>
                    <Text style={[
                      styles.statusText, 
                      { color: getStatusColor(challenge.participant_status) }
                    ]}>
                      {getStatusLabel(challenge.participant_status)}
                    </Text>
                  </View>
                </View>

                {/* Progression (si actif) */}
                {challenge.participant_status === 'ACTIVE' && (
                  <View style={styles.progressContainer}>
                    <View style={styles.progressHeader}>
                      <Text style={styles.progressLabel}>Progression</Text>
                      <Text style={styles.progressPercentage}>
                        {Math.round((challenge.progress / challenge.target) * 100)}%
                      </Text>
                    </View>
                    <View style={styles.progressBarContainer}>
                      <View style={styles.progressBarBg}>
                        <Animated.View 
                          style={[
                            styles.progressBarFill, 
                            { width: `${(challenge.progress / challenge.target) * 100}%` }
                          ]} 
                        >
                          <LinearGradient
                            colors={colors.gradients.primary}
                            style={styles.progressBarGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                          />
                        </Animated.View>
                      </View>
                    </View>
                    <Text style={styles.progressInfo}>
                      {getChallengeTypeInfo(challenge.type).progressLabel(challenge.progress, challenge.target)} complétés
                    </Text>
                  </View>
                )}

                {/* Actions si invitation */}
                {challenge.participant_status === 'INVITED' && (
                  <View style={styles.actionButtons}>
                    <TouchableOpacity 
                      style={styles.btnAccept}
                      onPress={() => handleAccept(challenge.challenge_id)}
                    >
                      <LinearGradient
                        colors={colors.gradients.primary}
                        style={styles.btnAcceptGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      >
                        <Ionicons name="checkmark" size={18} color={colors.black} />
                        <Text style={styles.btnAcceptText}>Accepter</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.btnRefuse}
                      onPress={() => handleRefuse(challenge.challenge_id)}
                    >
                      <Ionicons name="close" size={18} color={colors.textGrey} />
                      <Text style={styles.btnRefuseText}>Refuser</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Difficulté */}
                {challenge.difficulty && (
                  <View style={styles.difficultyContainer}>
                    <Text style={styles.difficultyLabel}>Difficulté:</Text>
                    <Text style={styles.difficultyValue}>{challenge.difficulty}</Text>
                  </View>
                )}
              </Card>
            </Animated.View>
          ))}

          {/* État vide */}
          {challenges.length === 0 && (
            <Card style={styles.emptyCard} variant="glass">
              <View style={styles.emptyState}>
                <LinearGradient
                  colors={[colors.darkGrey, colors.surfaceLight]}
                  style={styles.emptyIconContainer}
                >
                  <Ionicons name="trophy-outline" size={44} color={colors.brandGreen} />
                </LinearGradient>
                <Text style={styles.emptyText}>Aucun défi pour le moment</Text>
                <Text style={styles.emptySubtext}>
                  Créez votre premier défi pour commencer !
                </Text>
              </View>
            </Card>
          )}
            </>
          )}
        </Animated.View>

        {/* Spacer bottom */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.xl,
    paddingTop: spacing.xxl + 20,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textGrey,
    marginTop: 4,
    fontWeight: '500',
  },
  createButton: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.darkGrey,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.brandGreen,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  createButtonActive: {
    backgroundColor: colors.brandGreen,
    shadowColor: colors.brandGreen,
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },

  // Form
  createFormContainer: {
    paddingHorizontal: spacing.xl,
    marginBottom: sectionSpacing.md,
  },
  createCard: {
    padding: cardPadding.lg,
    backgroundColor: colors.darkGrey,
    borderWidth: 1,
    borderColor: colors.mediumGrey + '40',
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  formIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.brandGreen + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: -0.3,
  },
  formGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textGrey,
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  input: {
    height: 52,
    backgroundColor: colors.black,
    borderRadius: 14,
    paddingHorizontal: 16,
    color: colors.white,
    fontSize: 16,
    fontWeight: '500',
    borderWidth: 1.5,
    borderColor: colors.mediumGrey,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  radioButton: {
    flex: 1,
    flexDirection: 'row',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: colors.black,
    borderWidth: 1.5,
    borderColor: colors.brandGreen + '40',
    gap: 6,
  },
  radioButtonActive: {
    backgroundColor: colors.brandGreen,
    borderColor: colors.brandGreen,
    shadowColor: colors.brandGreen,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  radioButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.brandGreen,
  },
  radioButtonTextActive: {
    color: colors.black,
    fontWeight: '700',
  },
  submitButton: {
    marginTop: spacing.md,
    height: 54,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: colors.brandGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  submitButtonGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.black,
    letterSpacing: 0.3,
  },

  // List
  challengesList: {
    paddingHorizontal: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: -0.3,
  },
  countBadge: {
    backgroundColor: colors.brandGreen + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  countText: {
    color: colors.brandGreen,
    fontSize: 13,
    fontWeight: '700',
  },
  challengeCard: {
    marginBottom: spacing.md,
    padding: cardPadding.md,
    backgroundColor: colors.darkGrey,
    borderWidth: 1,
    borderColor: colors.mediumGrey + '30',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  challengeIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.brandGreen + '30',
  },
  challengeInfo: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: -0.2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  challengeSubtitle: {
    fontSize: 13,
    color: colors.textGrey,
    fontWeight: '500',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.textGrey,
    opacity: 0.5,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // Progress
  progressContainer: {
    marginTop: 18,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: colors.mediumGrey + '30',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textGrey,
    letterSpacing: 0.2,
  },
  progressPercentage: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
  },
  progressBarContainer: {
    marginBottom: 8,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: colors.black,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
  },
  progressBarGradient: {
    flex: 1,
  },
  progressInfo: {
    fontSize: 12,
    color: colors.textGrey,
    marginTop: 8,
    fontWeight: '500',
  },

  // Actions
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: colors.mediumGrey + '30',
  },
  btnAccept: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: colors.brandGreen,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnAcceptGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
  },
  btnAcceptText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.black,
    letterSpacing: 0.2,
  },
  btnRefuse: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1.5,
    borderColor: colors.mediumGrey,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  btnRefuseText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textGrey,
    letterSpacing: 0.2,
  },
  difficultyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.mediumGrey + '30',
  },
  difficultyLabel: {
    fontSize: 12,
    color: colors.textGrey,
    marginRight: spacing.xs,
  },
  difficultyValue: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.brandGreen,
  },

  // Search
  searchContainer: {
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  searchToggle: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: colors.darkGrey, 
    padding: spacing.md, 
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.mediumGrey
  },
  searchToggleText: { 
    color: colors.brandGreen, 
    fontSize: 14, 
    fontWeight: '600', 
    marginLeft: spacing.sm 
  },
  searchInputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: colors.darkGrey, 
    borderRadius: borderRadius.lg, 
    paddingHorizontal: spacing.lg, 
    height: 50,
    borderWidth: 1,
    borderColor: colors.mediumGrey,
    marginTop: spacing.sm
  },
  searchIcon: { marginRight: spacing.sm },
  searchInput: { 
    flex: 1, 
    color: colors.white, 
    fontSize: 16,
    paddingVertical: 0
  },
  clearButton: { padding: spacing.xs },

  // Empty state
  emptyCard: {
    padding: spacing.xxl,
    backgroundColor: colors.darkGrey,
    borderWidth: 1,
    borderColor: colors.mediumGrey + '30',
  },
  emptyState: {
    alignItems: 'center',
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: colors.brandGreen + '30',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textGrey,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  loadingText: {
    ...typography.bodyMedium,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
  bottomSpacer: {
    height: spacing.xxl,
  },

  // Challenge Types
  challengeTypesScroll: {
    paddingHorizontal: spacing.sm,
    gap: spacing.sm,
  },
  challengeTypeCard: {
    width: 120,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.darkGrey,
    borderWidth: 1,
    borderColor: colors.mediumGrey,
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  challengeTypeCardActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  challengeTypeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  challengeTypeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  challengeTypeLabelActive: {
    color: colors.black,
  },
  challengeTypeDesc: {
    fontSize: 10,
    color: colors.textGrey,
    textAlign: 'center',
    lineHeight: 12,
  },
  challengeTypeDescActive: {
    color: colors.black + '80',
  },
});

export default ChallengesScreen;