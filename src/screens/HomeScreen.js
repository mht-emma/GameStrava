// src/screens/HomeScreen.js
import React, { useState, useContext, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, StatusBar, TextInput } from 'react-native';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Card, ButtonPrimary } from '../components';
import Icon from '../components/Icon';
import { spacing, typography, borderRadius, inputHeight, inputPadding, iconSizes, cardPadding, sectionSpacing, shadows } from '../theme';
import { AuthContext } from '../context/AuthContext';
import { useChallenges } from '../hooks/useChallenge';
import { useProfile } from '../hooks/useProfile';
import { challengeTypes, getChallengeTypeInfo, getChallengeShortLabel, getChallengeProgressLabel } from '../utils/challengeHelpers';

const { width } = Dimensions.get('window');

// Ta nouvelle palette de couleurs avec pistache
const COLORS = {
  black: '#000000',
  darkGrey: '#121212', // Fond des cartes
  mediumGrey: '#444444', // Bordures et icônes
  brandGreen: '#528531', // Vert pistache
  textGrey: '#AAAAAA',
  white: '#FFFFFF'
};

const HomeScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const { profile, loading: statsLoading } = useProfile(user?.id);
  const { challenges, loading: challengesLoading, createChallenge } = useChallenges(user?.id);
  const { stats } = profile;
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false); // State for dropdown

  const [formData, setFormData] = useState({
    type: 'DISTANCE_TOTAL',
    target: '',
    sport: 'RUN',
  });

  // Pending invites for notifications
  const pendingInvites = useMemo(() => {
    return challenges.filter(c => c.participant_status === 'INVITED');
  }, [challenges]);

  // Filtrer les défis en fonction de la recherche
  const filteredChallenges = useMemo(() => {
    if (!searchQuery.trim()) return challenges;

    const query = searchQuery.toLowerCase();
    return challenges.filter(challenge => {
      const sportLabel = challenge.sport === 'RUN' ? 'course' : 'vélo';
      const typeInfo = getChallengeTypeInfo(challenge.type);

      return (
        sportLabel.includes(query) ||
        typeInfo.label.toLowerCase().includes(query) ||
        typeInfo.description.toLowerCase().includes(query) ||
        challenge.difficulty?.toLowerCase().includes(query) ||
        challenge.target?.toString().includes(query)
      );
    });
  }, [challenges, searchQuery]);

  // Trouver le défi actif le plus récent pour l'afficher
  const activeChallenge = filteredChallenges.find(c => c.participant_status === 'ACTIVE') || filteredChallenges[0];

  const handleCreateChallenge = async () => {
    if (!formData.target || formData.target <= 0) {
      alert('Le target doit être positif');
      return;
    }

    try {
      await createChallenge({
        creatorId: user.id,
        challengeData: {
          type: formData.type,
          target: parseFloat(formData.target),
          sport: formData.sport,
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 jours
        },
        invitedUserIds: []
      });

      // Réinitialiser le formulaire
      setFormData({
        type: 'DISTANCE_TOTAL',
        target: '',
        sport: 'RUN',
        start_date: null,
        end_date: null
      });
      setShowCreateForm(false);
      alert('Défi créé avec succès !');
    } catch (error) {
      console.error('Erreur lors de la création du défi:', error);
      alert('Erreur lors de la création du défi');
    }
  };

  const handleNotificationPress = () => {
    setShowNotifications(!showNotifications);
  };

  const navigateToChallenges = () => {
    setShowNotifications(false);
    navigation.navigate('Challenges');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* HEADER */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
          <View>
            <Text style={styles.usernameText}>Bonjour</Text>
            <Text style={styles.usernameText}>{user?.name || 'Athlète'}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={[styles.searchButton, showSearch && styles.searchButtonActive]}
              onPress={() => setShowSearch(!showSearch)}
            >
              <Ionicons name={showSearch ? "close" : "search"} size={24} color={showSearch ? COLORS.white : COLORS.brandGreen} />
            </TouchableOpacity>

            <View>
              <TouchableOpacity
                style={styles.avatarCircle}
                onPress={handleNotificationPress}
              >
                <Ionicons name="notifications" size={24} color={COLORS.brandGreen} />
                {pendingInvites.length > 0 && <View style={styles.dotBadge} />}
              </TouchableOpacity>

              {/* Notification Dropdown */}
              {showNotifications && (
                <Animated.View entering={ZoomIn.duration(200)} style={styles.notificationDropdown}>
                  <Text style={styles.notifTitle}>Notifications</Text>
                  {pendingInvites.length > 0 ? (
                    pendingInvites.map(invite => (
                      <TouchableOpacity
                        key={invite.challenge_id}
                        style={styles.notifItem}
                        onPress={navigateToChallenges}
                      >
                        <View style={styles.notifDot} />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.notifText}>
                            Invitation : <Text style={{ fontWeight: 'bold', color: COLORS.white }}>{getChallengeShortLabel(invite) || 'Nouveau défi'}</Text>
                          </Text>
                          <Text style={styles.notifSubtext}>Par {invite.creator_name || 'Inconnu'}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={16} color={COLORS.textGrey} />
                      </TouchableOpacity>
                    ))
                  ) : (
                    <Text style={styles.noNotifText}>Aucune nouvelle notification</Text>
                  )}
                  {pendingInvites.length > 0 && (
                    <TouchableOpacity style={styles.viewAllBtn} onPress={navigateToChallenges}>
                      <Text style={styles.viewAllText}>Voir toutes les invitations</Text>
                    </TouchableOpacity>
                  )}
                </Animated.View>
              )}
            </View>
          </View>
        </Animated.View>

        {/* REST OF THE CODE... (Search, Bento, Actions, etc.) logic remains similar but I need to be careful with replace_file_content chunking */}

        {/* SEARCH BAR */}
        {showSearch && (
          <Animated.View entering={FadeInDown.delay(150)} style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Ionicons name="search" size={20} color={COLORS.textGrey} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Rechercher des défis, activités..."
                placeholderTextColor={COLORS.textGrey}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus={true}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => setSearchQuery('')}
                >
                  <Ionicons name="close-circle" size={20} color={COLORS.textGrey} />
                </TouchableOpacity>
              )}
            </View>
            {searchQuery.length > 0 && (
              <View style={styles.searchResults}>
                <Text style={styles.searchResultsText}>
                  {filteredChallenges.length} résultat{filteredChallenges.length > 1 ? 's' : ''} trouvé{filteredChallenges.length > 1 ? 's' : ''}
                </Text>
              </View>
            )}
          </Animated.View>
        )}

        {/* ... Skipping Bento and Actions for now as they are unchanged ... */}
        {/* Actually, I should just supply the Header part update and the Styles update. */}
        {/* But the tool requires contiguous block logic. */}
        {/* Let's try to update Header section specifically. */}
        {/* And also add the styles at the end. */}



        {/* SEARCH BAR */}
        {showSearch && (
          <Animated.View entering={FadeInDown.delay(150)} style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Ionicons name="search" size={20} color={COLORS.textGrey} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Rechercher des défis, activités..."
                placeholderTextColor={COLORS.textGrey}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus={true}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => setSearchQuery('')}
                >
                  <Ionicons name="close-circle" size={20} color={COLORS.textGrey} />
                </TouchableOpacity>
              )}
            </View>
            {searchQuery.length > 0 && (
              <View style={styles.searchResults}>
                <Text style={styles.searchResultsText}>
                  {filteredChallenges.length} résultat{filteredChallenges.length > 1 ? 's' : ''} trouvé{filteredChallenges.length > 1 ? 's' : ''}
                </Text>
              </View>
            )}
          </Animated.View>
        )}

        {/* BENTO STATS SECTION */}
        <Text style={styles.sectionLabel}>Résumé hebdomadaire</Text>
        <View style={styles.bentoGrid}>
          {/* Card 1 */}
          <Animated.View entering={FadeInDown.delay(200)} style={styles.statCardSmall}>
            <View style={styles.iconBox}><Ionicons name="walk" size={18} color={COLORS.brandGreen} /></View>
            <Text style={styles.statValue}>{statsLoading ? '...' : stats.weeklyActivities}</Text>
            <Text style={styles.statLabelSmall}>Activités</Text>
          </Animated.View>

          {/* Card 2 - Vert Pistache */}
          <Animated.View entering={FadeInDown.delay(300)} style={[styles.statCardSmall, styles.highlightCard]}>
            <View style={styles.iconBoxLight}><Ionicons name="flash" size={20} color={COLORS.white} /></View>
            <Text style={[styles.statValue, { color: COLORS.white }]}>{statsLoading ? '...' : stats.totalPoints}</Text>
            <Text style={[styles.statLabelSmall, { color: 'rgba(255,255,255,0.7)' }]}>Points</Text>
          </Animated.View>

          {/* Card 3 */}
          <Animated.View entering={FadeInDown.delay(400)} style={styles.statCardSmall}>
            <View style={styles.iconBox}><Ionicons name="trophy" size={18} color={COLORS.brandGreen} /></View>
            <Text style={styles.statValue}>{challengesLoading ? '...' : stats.activeChallenges}</Text>
            <Text style={styles.statLabelSmall}>Défis</Text>
          </Animated.View>
        </View>

        {/* ACTIONS */}
        <Animated.View entering={FadeInUp.delay(500)} style={styles.actionGroup}>
          <TouchableOpacity style={styles.btnPrimary}>
            <Ionicons name="sync" size={20} color={COLORS.white} style={{ marginRight: 8 }} />
            <Text style={styles.btnPrimaryText}>Synchroniser Strava</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btnSecondary, showCreateForm && styles.btnSecondaryActive]}
            onPress={() => setShowCreateForm(!showCreateForm)}
          >
            <Text style={[styles.btnSecondaryText, showCreateForm && styles.btnSecondaryTextActive]}>
              {showCreateForm ? 'Annuler' : '+ Créer un défi'}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* FORMULAIRE DE CRÉATION DE DÉFI */}
        {showCreateForm && (
          <Animated.View entering={ZoomIn.springify()} style={styles.createFormContainer}>
            <Card style={styles.createCard} variant="glass">
              <View style={styles.formHeader}>
                <View style={styles.formIconContainer}>
                  <Ionicons name="trophy" size={24} color={COLORS.brandGreen} />
                </View>
                <Text style={styles.formTitle}>Créer un défi rapide</Text>
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
                          color={formData.type === challengeType.key ? COLORS.black : COLORS.brandGreen}
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
                  placeholderTextColor={COLORS.textGrey}
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
                      color={formData.sport === 'RUN' ? COLORS.black : COLORS.brandGreen}
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
                      color={formData.sport === 'BIKE' ? COLORS.black : COLORS.brandGreen}
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
                  colors={[COLORS.brandGreen, COLORS.brandGreen + '80']}
                  style={styles.submitButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.submitButtonText}>Créer le défi</Text>
                  <Ionicons name="arrow-forward" size={20} color={COLORS.black} />
                </LinearGradient>
              </TouchableOpacity>
            </Card>
          </Animated.View>
        )}

        {/* CHALLENGE CARD */}
        <Text style={styles.sectionLabel}>Défis en cours</Text>
        {challengesLoading ? (
          <Animated.View entering={FadeInUp.delay(600)} style={styles.challengeCard}>
            <Text style={styles.loadingText}>Chargement des défis...</Text>
          </Animated.View>
        ) : activeChallenge ? (
          <Animated.View entering={FadeInUp.delay(600)} style={styles.challengeCard}>
            <View style={styles.challengeHeader}>
              <View style={styles.challengeIcon}>
                <Ionicons
                  name={activeChallenge.sport === 'RUN' ? 'walk' : 'bicycle'}
                  size={24}
                  color={COLORS.brandGreen}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.challengeTitle}>
                  {getChallengeTypeInfo(activeChallenge.type).label} {activeChallenge.target} {getChallengeTypeInfo(activeChallenge.type).unit}
                </Text>
                <Text style={styles.challengeSubtitle}>
                  {activeChallenge.sport === 'RUN' ? 'Course' : 'Vélo'} • {activeChallenge.difficulty || 'En cours'}
                </Text>
              </View>
              <View style={styles.pointsTag}><Text style={styles.pointsTagText}>+{activeChallenge.points_reward || 150} XP</Text></View>
            </View>

            <View style={styles.progressSection}>
              <View style={styles.progressText}>
                <Text style={styles.progressLabel}>Progression</Text>
                <Text style={styles.progressValue}>
                  {getChallengeProgressLabel(activeChallenge)}
                </Text>
              </View>
              <View style={styles.barBg}>
                <View style={[styles.barFill, {
                  width: `${Math.min((activeChallenge.progress / activeChallenge.target) * 100, 100)}%`
                }]} />
              </View>
            </View>
          </Animated.View>
        ) : (
          <Animated.View entering={FadeInUp.delay(600)} style={styles.challengeCard}>
            <View style={styles.emptyChallenge}>
              <View style={styles.emptyIconContainer}>
                <Ionicons name="trophy-outline" size={48} color={COLORS.mediumGrey} />
              </View>
              <Text style={styles.emptyText}>
                {searchQuery ? 'Aucun résultat trouvé' : 'Aucun défi en cours'}
              </Text>
              <Text style={styles.emptySubtext}>
                {searchQuery ? 'Essayez une autre recherche' : 'Rejoignez un défi pour commencer !'}
              </Text>
            </View>
          </Animated.View>
        )}

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.black },
  scrollContent: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 40 },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 35,
    zIndex: 10, // Ensure notifications float above content
    elevation: 10
  },
  greetingText: { color: COLORS.textGrey, fontSize: 16 },
  usernameText: { color: COLORS.white, fontSize: 28, fontWeight: 'bold' },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.darkGrey,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.mediumGrey
  },

  // Bento
  sectionLabel: { color: COLORS.white, fontSize: 18, fontWeight: '700', marginBottom: 15 },
  bentoGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  statCardSmall: {
    width: (width - 55) / 3,
    backgroundColor: COLORS.darkGrey,
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1.2,
    borderColor: COLORS.mediumGrey
  },
  highlightCard: { backgroundColor: COLORS.brandGreen, borderColor: COLORS.brandGreen },
  iconBox: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.black, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  iconBoxLight: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  statValue: { color: COLORS.white, fontSize: 20, fontWeight: 'bold' },
  statLabelSmall: { color: COLORS.textGrey, fontSize: 11, marginTop: 2 },

  // Buttons
  actionGroup: { gap: 12, marginBottom: 35 },
  btnPrimary: {
    backgroundColor: COLORS.brandGreen,
    height: 55,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnPrimaryText: { color: COLORS.white, fontWeight: 'bold', fontSize: 16 },
  btnSecondary: {
    borderWidth: 1.5,
    borderColor: COLORS.brandGreen,
    height: 55,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnSecondaryText: { color: COLORS.brandGreen, fontWeight: 'bold', fontSize: 16 },

  // Challenge Card
  challengeCard: {
    backgroundColor: COLORS.darkGrey,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1.2,
    borderColor: COLORS.mediumGrey
  },
  challengeHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  challengeIcon: { width: 45, height: 45, borderRadius: 12, backgroundColor: COLORS.black, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  challengeTitle: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
  challengeSubtitle: { color: COLORS.textGrey, fontSize: 12 },
  pointsTag: { backgroundColor: 'rgba(147, 197, 114, 0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  pointsTagText: { color: COLORS.brandGreen, fontWeight: 'bold', fontSize: 12 },
  progressSection: { marginTop: 5 },
  progressText: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressLabel: { color: COLORS.textGrey, fontSize: 12 },
  progressValue: { color: COLORS.white, fontSize: 12, fontWeight: 'bold' },
  barBg: { height: 6, backgroundColor: COLORS.black, borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: COLORS.brandGreen },
  dotBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.brandGreen
  },
  loadingText: { color: COLORS.textGrey, fontSize: 14, textAlign: 'center', paddingVertical: 20 },
  emptyChallenge: { alignItems: 'center', paddingVertical: 20 },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.black,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15
  },
  emptyText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold', marginTop: 10 },
  emptySubtext: { color: COLORS.textGrey, fontSize: 12, marginTop: 5 },

  // Header Actions
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.darkGrey,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.mediumGrey
  },
  searchButtonActive: {
    backgroundColor: COLORS.brandGreen,
    borderColor: COLORS.brandGreen
  },

  // Search
  searchContainer: { marginBottom: 20 },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.darkGrey,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.mediumGrey
  },
  searchIcon: { marginRight: 12 },
  searchInput: {
    flex: 1,
    color: COLORS.white,
    fontSize: 16,
    paddingVertical: 0
  },
  clearButton: { padding: 4 },
  searchResults: {
    paddingTop: 8,
    paddingHorizontal: 4
  },
  searchResultsText: {
    color: COLORS.textGrey,
    fontSize: 13,
    fontStyle: 'italic'
  },

  // Create Form
  createFormContainer: { marginBottom: 30 },
  createCard: { padding: 20, backgroundColor: COLORS.darkGrey, borderWidth: 1, borderColor: COLORS.mediumGrey },
  formHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  formIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.brandGreen + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  formTitle: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
  formGroup: { marginBottom: 20 },
  label: { color: COLORS.white, fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: {
    backgroundColor: COLORS.black,
    borderWidth: 1,
    borderColor: COLORS.mediumGrey,
    borderRadius: 8,
    padding: 12,
    color: COLORS.white,
    fontSize: 16
  },
  radioGroup: { flexDirection: 'row', gap: 10 },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.darkGrey,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.mediumGrey,
    flex: 1,
    justifyContent: 'center'
  },
  radioButtonActive: { backgroundColor: COLORS.brandGreen, borderColor: COLORS.brandGreen },
  radioButtonText: { color: COLORS.textGrey, fontSize: 14, fontWeight: '600', marginLeft: 8 },
  radioButtonTextActive: { color: COLORS.black },
  submitButton: { marginTop: 10 },
  submitButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12
  },
  submitButtonText: { color: COLORS.black, fontSize: 16, fontWeight: 'bold', marginRight: 8 },

  // Challenge Types
  challengeTypesScroll: { paddingHorizontal: 0, gap: 10 },
  challengeTypeCard: {
    width: 100,
    padding: 12,
    borderRadius: 8,
    backgroundColor: COLORS.darkGrey,
    borderWidth: 1,
    borderColor: COLORS.mediumGrey,
    alignItems: 'center',
    marginRight: 10
  },
  challengeTypeCardActive: {
    backgroundColor: COLORS.brandGreen,
    borderColor: COLORS.brandGreen
  },
  challengeTypeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6
  },
  challengeTypeLabel: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 2
  },
  challengeTypeLabelActive: { color: COLORS.black },
  challengeTypeDesc: {
    color: COLORS.textGrey,
    fontSize: 9,
    textAlign: 'center',
    lineHeight: 10
  },
  challengeTypeDescActive: { color: COLORS.black + '80' },

  // Button states
  btnSecondaryActive: { backgroundColor: COLORS.brandGreen },
  btnSecondaryTextActive: { color: COLORS.black },

  // Notifications
  notificationDropdown: {
    position: 'absolute',
    top: 55,
    right: 0,
    width: 280,
    backgroundColor: COLORS.darkGrey,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.mediumGrey,
    padding: 15,
    zIndex: 1000,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  notifTitle: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.mediumGrey,
    paddingBottom: 8,
  },
  notifItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  notifDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.brandGreen,
  },
  notifText: {
    color: COLORS.textGrey,
    fontSize: 13,
  },
  notifSubtext: {
    color: COLORS.textGrey,
    fontSize: 11,
    opacity: 0.7,
  },
  noNotifText: {
    color: COLORS.textGrey,
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 10,
  },
  viewAllBtn: {
    marginTop: 5,
    paddingVertical: 8,
    backgroundColor: COLORS.brandGreen + '20',
    borderRadius: 8,
    alignItems: 'center',
  },
  viewAllText: {
    color: COLORS.brandGreen,
    fontSize: 12,
    fontWeight: 'bold',
  }
});

export default HomeScreen;