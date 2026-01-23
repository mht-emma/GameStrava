// src/screens/ProfileScreen.js

import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, ButtonPrimary, Avatar, Badge, StatCard, ProgressBar } from '../components';
import { AuthContext } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';

const { width } = Dimensions.get('window');

// Palette avec vert pistache
const COLORS = {
  black: '#000000',
  darkGrey: '#121212', // Fond des cartes
  mediumGrey: '#444444', // Bordures et icônes
  brandGreen: '#69a342', // Vert pistache
  textGrey: '#AAAAAA',
  white: '#FFFFFF',
  error: '#EF4444'
};

const ProfileScreen = () => {
  const { user: authUser } = useContext(AuthContext);
  const { profile, loading, updateUserProfile } = useProfile(authUser?.id);
  const [activeSection, setActiveSection] = useState('stats');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');

  const { user, stats, badges, recentActivity } = profile;

  const handleStartEdit = () => {
    setEditName(user.name);
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    await updateUserProfile({ name: editName });
    setIsEditing(false);
  };

  const levelProgress = user.xpToNextLevel > 0 ? (user.xp / user.xpToNextLevel) * 100 : 0;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.black} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeader}>
          <View style={styles.headerGlow} />

          <View style={styles.avatarSection}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Chargement du profil...</Text>
              </View>
            ) : (
              <>
                <View style={styles.avatarWrapper}>
                  <Avatar
                    source={user.avatar?.startsWith('http') ? user.avatar : undefined}
                    emoji={!user.avatar?.startsWith('http') ? user.avatar : undefined}
                    size="xxxl"
                    showBorder
                  />
                  <View style={styles.levelBadge}>
                    <Ionicons name="ribbon" size={12} color={COLORS.white} style={{ marginRight: 4 }} />
                    <Text style={styles.levelText}>Niv. {user.level}</Text>
                  </View>
                </View>

                {isEditing ? (
                  <TextInput
                    style={styles.editNameInput}
                    value={editName}
                    onChangeText={setEditName}
                    autoFocus
                    selectionColor={COLORS.brandGreen}
                  />
                ) : (
                  <Text style={styles.userName}>{user.name || 'Utilisateur'}</Text>
                )}

                <Text style={styles.userEmail}>{user.email || 'email@example.com'}</Text>

                <View style={styles.levelProgress}>
                  <View style={styles.levelProgressHeader}>
                    <Text style={styles.levelProgressLabel}>Niveau {user.level}</Text>
                    <Text style={styles.levelProgressXP}>{user.xp} / {user.xpToNextLevel} XP</Text>
                  </View>
                  <ProgressBar progress={levelProgress} variant="glow" size="sm" />
                </View>

                {isEditing ? (
                  <View style={styles.editActions}>
                    <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                      <Ionicons name="checkmark" size={18} color={COLORS.black} />
                      <Text style={styles.saveButtonText}>Enregistrer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditing(false)}>
                      <Ionicons name="close" size={18} color={COLORS.white} />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity style={styles.editButton} onPress={handleStartEdit}>
                    <Ionicons name="create-outline" size={18} color={COLORS.brandGreen} />
                    <Text style={styles.editButtonText}>Modifier le profil</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </View>

        {/* SEARCH BAR */}
        <View style={styles.searchContainer}>
          <TouchableOpacity
            style={styles.searchToggle}
            onPress={() => setShowSearch(!showSearch)}
          >
            <Ionicons name="search" size={20} color={COLORS.brandGreen} />
            <Text style={styles.searchToggleText}>
              {showSearch ? 'Masquer la recherche' : 'Rechercher dans le profil'}
            </Text>
          </TouchableOpacity>

          {showSearch && (
            <View style={styles.searchInputContainer}>
              <Ionicons name="search" size={20} color={COLORS.textGrey} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Rechercher badges, activités..."
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
          )}
        </View>

        <View style={styles.quickStatsRow}>
          <View style={styles.quickStat}>
            <Ionicons name="flash" size={20} color={COLORS.brandGreen} style={{ marginBottom: 4 }} />
            <Text style={styles.quickStatValue}>{loading ? '...' : stats.totalPoints}</Text>
            <Text style={styles.quickStatLabel}>Points</Text>
          </View>
          <View style={styles.quickStatDivider} />
          <View style={styles.quickStat}>
            <Ionicons name="trophy" size={20} color={COLORS.brandGreen} style={{ marginBottom: 4 }} />
            <Text style={styles.quickStatValue}>{loading ? '...' : stats.challengesWon}</Text>
            <Text style={styles.quickStatLabel}>Victoires</Text>
          </View>
          <View style={styles.quickStatDivider} />
          <View style={styles.quickStat}>
            <Ionicons name="podium" size={20} color={COLORS.brandGreen} style={{ marginBottom: 4 }} />
            <Text style={styles.quickStatValue}>{loading ? '...' : `#${stats.rank}`}</Text>
            <Text style={styles.quickStatLabel}>Rang</Text>
          </View>
        </View>

        <View style={styles.tabsContainer}>
          {[
            { key: 'stats', label: 'Stats', icon: 'bar-chart' },
            { key: 'badges', label: 'Badges', icon: 'medal' },
            { key: 'activity', label: 'Activité', icon: 'list' }
          ].map((section) => (
            <TouchableOpacity
              key={section.key}
              style={[styles.tab, activeSection === section.key && styles.tabActive]}
              onPress={() => setActiveSection(section.key)}
            >
              <Ionicons
                name={section.icon}
                size={16}
                color={activeSection === section.key ? COLORS.brandGreen : COLORS.textGrey}
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.tabText, activeSection === section.key && styles.tabTextActive]}>
                {section.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeSection === 'stats' && (
          <View style={styles.section}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Chargement des statistiques...</Text>
              </View>
            ) : (
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <View style={styles.statIconContainer}>
                    <Ionicons name="trophy" size={24} color={COLORS.brandGreen} />
                  </View>
                  <Text style={styles.statValue}>{stats.challengesCompleted}</Text>
                  <Text style={styles.statLabel}>Défis complétés</Text>
                </View>

                <View style={styles.statCard}>
                  <View style={styles.statIconContainer}>
                    <Ionicons name="ribbon" size={24} color={COLORS.brandGreen} />
                  </View>
                  <Text style={styles.statValue}>{stats.challengesWon}</Text>
                  <Text style={styles.statLabel}>Défis gagnés</Text>
                </View>

                <View style={styles.statCard}>
                  <View style={styles.statIconContainer}>
                    <Ionicons name="walk" size={24} color={COLORS.brandGreen} />
                  </View>
                  <Text style={styles.statValue}>{stats.totalActivities}</Text>
                  <Text style={styles.statLabel}>Activités totales</Text>
                </View>

                <View style={styles.statCard}>
                  <View style={styles.statIconContainer}>
                    <Ionicons name="navigate" size={24} color={COLORS.brandGreen} />
                  </View>
                  <Text style={styles.statValue}>{stats.totalDistance} km</Text>
                  <Text style={styles.statLabel}>Distance totale</Text>
                </View>

                <View style={styles.statCard}>
                  <View style={styles.statIconContainer}>
                    <Ionicons name="flame" size={24} color={COLORS.brandGreen} />
                  </View>
                  <Text style={styles.statValue}>{stats.currentStreak} jours</Text>
                  <Text style={styles.statLabel}>Série actuelle</Text>
                </View>

                <View style={styles.statCard}>
                  <View style={styles.statIconContainer}>
                    <Ionicons name="star" size={24} color={COLORS.brandGreen} />
                  </View>
                  <Text style={styles.statValue}>{stats.bestStreak} jours</Text>
                  <Text style={styles.statLabel}>Meilleure série</Text>
                </View>
              </View>
            )}
          </View>
        )}

        {activeSection === 'badges' && (
          <View style={styles.section}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Chargement des badges...</Text>
              </View>
            ) : badges.length > 0 ? (
              <View style={styles.badgesGrid}>
                {badges.map((badge) => (
                  <View key={badge.id} style={[styles.badgeCard, !badge.unlocked && styles.badgeCardLocked]}>
                    <View style={[styles.badgeIcon, badge.unlocked && styles.badgeIconUnlocked]}>
                      <Ionicons
                        name={badge.unlocked ? 'medal' : 'lock-closed'}
                        size={28}
                        color={badge.unlocked ? COLORS.brandGreen : COLORS.mediumGrey}
                      />
                    </View>
                    <Text style={[styles.badgeName, !badge.unlocked && styles.badgeNameLocked]}>
                      {badge.name}
                    </Text>
                    <Text style={[styles.badgeDescription, !badge.unlocked && styles.badgeDescriptionLocked]}>
                      {badge.description}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="medal-outline" size={48} color={COLORS.mediumGrey} style={{ marginBottom: 10 }} />
                <Text style={styles.emptyText}>Aucun badge disponible</Text>
              </View>
            )}
          </View>
        )}

        {activeSection === 'activity' && (
          <View style={styles.section}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Chargement de l'activité...</Text>
              </View>
            ) : recentActivity.length > 0 ? (
              <View style={styles.activityList}>
                {recentActivity.map((activity) => {
                  const getActivityIcon = (type) => {
                    switch (type) {
                      case 'challenge_won': return 'trophy';
                      case 'badge': return 'medal';
                      case 'challenge_completed': return 'checkmark-circle';
                      default: return 'walk';
                    }
                  };

                  return (
                    <View key={activity.id} style={styles.activityItem}>
                      <View style={styles.activityIcon}>
                        <Ionicons
                          name={getActivityIcon(activity.type)}
                          size={20}
                          color={COLORS.brandGreen}
                        />
                      </View>
                      <View style={styles.activityContent}>
                        <Text style={styles.activityTitle}>{activity.title}</Text>
                        <Text style={styles.activityDate}>{activity.date}</Text>
                      </View>
                      <View style={styles.activityPoints}>
                        <Text style={styles.activityPointsText}>+{activity.points} XP</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="time-outline" size={48} color={COLORS.mediumGrey} style={{ marginBottom: 10 }} />
                <Text style={styles.emptyText}>Aucune activité récente</Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Paramètres</Text>
          <Card style={styles.settingsCard}>
            {[
              { label: 'Connecter Strava', icon: 'link' },
              { label: 'Notifications', icon: 'notifications' },
              { label: 'Confidentialité', icon: 'shield-checkmark' }
            ].map((item, index) => (
              <View key={index}>
                <TouchableOpacity style={styles.settingsItem}>
                  <Ionicons name={item.icon} size={20} color={COLORS.brandGreen} style={{ marginRight: 12 }} />
                  <Text style={styles.settingsLabel}>{item.label}</Text>
                  <Ionicons name="chevron-forward" size={20} color={COLORS.mediumGrey} />
                </TouchableOpacity>
                {index < 2 && <View style={styles.settingsDivider} />}
              </View>
            ))}
          </Card>

          <TouchableOpacity style={styles.logoutButton} onPress={() => { }}>
            <Ionicons name="log-out-outline" size={20} color={COLORS.error} style={{ marginRight: 8 }} />
            <Text style={styles.logoutText}>Déconnexion</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Ionicons name="information-circle-outline" size={16} color={COLORS.mediumGrey} style={{ marginBottom: 8 }} />
          <Text style={styles.footerText}>AthletiX v1.0.0</Text>
          <Text style={styles.footerText}>Membre depuis {user.memberSince || 'récemment'}</Text>
        </View>
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.black },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 20 },
  profileHeader: { position: 'relative', paddingTop: 40, paddingBottom: 20 },
  headerGlow: { position: 'absolute', top: 0, left: '25%', width: '50%', height: 150, backgroundColor: COLORS.brandGreen, opacity: 0.1, borderRadius: 100 },
  avatarSection: { alignItems: 'center' },
  avatarWrapper: { position: 'relative', marginBottom: 15 },
  levelBadge: {
    position: 'absolute',
    bottom: -8,
    left: '50%',
    transform: [{ translateX: -40 }],
    backgroundColor: COLORS.brandGreen,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  levelText: { color: COLORS.white, fontWeight: 'bold', fontSize: 12 },
  userName: { fontSize: 24, fontWeight: 'bold', color: COLORS.white, marginTop: 10 },
  userEmail: { fontSize: 14, color: COLORS.textGrey, marginTop: 4 },
  levelProgress: { width: '80%', marginTop: 20, marginBottom: 10 },
  levelProgressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  levelProgressLabel: { color: COLORS.textGrey, fontSize: 12 },
  levelProgressXP: { color: COLORS.brandGreen, fontWeight: 'bold', fontSize: 12 },
  editButton: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.brandGreen
  },
  editButtonText: { color: COLORS.brandGreen, fontWeight: '600', fontSize: 14, marginLeft: 6 },
  quickStatsRow: { flexDirection: 'row', backgroundColor: COLORS.darkGrey, borderRadius: 16, padding: 15, marginBottom: 20, borderWidth: 1, borderColor: COLORS.mediumGrey },
  quickStat: { flex: 1, alignItems: 'center' },
  quickStatValue: { fontSize: 18, fontWeight: 'bold', color: COLORS.white },
  quickStatLabel: { fontSize: 12, color: COLORS.textGrey, marginTop: 4 },
  quickStatDivider: { width: 1, backgroundColor: COLORS.mediumGrey, marginVertical: 5 },
  tabsContainer: { flexDirection: 'row', marginBottom: 20, gap: 10 },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.darkGrey,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.mediumGrey,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  tabActive: { backgroundColor: COLORS.brandGreen + '20', borderColor: COLORS.brandGreen },
  tabText: { color: COLORS.textGrey, fontWeight: '600', fontSize: 13 },
  tabTextActive: { color: COLORS.brandGreen },
  section: { marginBottom: 20 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },

  // Search
  searchContainer: { marginBottom: 20 },
  searchToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.darkGrey,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.mediumGrey
  },
  searchToggleText: {
    color: COLORS.brandGreen,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.darkGrey,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.mediumGrey,
    marginTop: 10
  },
  searchIcon: { marginRight: 12 },
  searchInput: {
    flex: 1,
    color: COLORS.white,
    fontSize: 16,
    paddingVertical: 0
  },
  clearButton: { padding: 4 },

  // Stats Cards
  statCard: {
    width: (width - 50) / 2,
    backgroundColor: COLORS.darkGrey,
    borderColor: COLORS.mediumGrey,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1
  },
  statIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.brandGreen + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textGrey,
    textAlign: 'center'
  },

  settingsSection: { marginTop: 10 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.white, marginBottom: 15 },
  settingsCard: { backgroundColor: COLORS.darkGrey, padding: 0, borderRadius: 16, borderWidth: 1, borderColor: COLORS.mediumGrey },
  settingsItem: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  settingsLabel: { color: COLORS.white, flex: 1, fontSize: 15 },
  settingsDivider: { height: 1, backgroundColor: COLORS.mediumGrey, marginHorizontal: 16 },
  logoutButton: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: COLORS.darkGrey,
    borderWidth: 1,
    borderColor: COLORS.error + '40'
  },
  logoutText: { color: COLORS.error, fontSize: 15, fontWeight: '600' },
  footer: { alignItems: 'center', paddingVertical: 30 },
  footerText: { fontSize: 12, color: COLORS.mediumGrey, marginBottom: 5 },
  loadingContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  loadingText: { color: COLORS.textGrey, fontSize: 16 },
  emptyContainer: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { color: COLORS.textGrey, fontSize: 16 },
  badgesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  badgeCard: { width: (width - 50) / 2, backgroundColor: COLORS.darkGrey, borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: COLORS.mediumGrey },
  badgeCardLocked: { opacity: 0.5 },
  badgeIcon: { width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.black, justifyContent: 'center', alignItems: 'center', marginBottom: 10, borderWidth: 2, borderColor: COLORS.mediumGrey },
  badgeIconUnlocked: { borderColor: COLORS.brandGreen },
  badgeName: { color: COLORS.white, fontSize: 14, fontWeight: 'bold', textAlign: 'center', marginBottom: 5 },
  badgeNameLocked: { color: COLORS.mediumGrey },
  badgeDescription: { color: COLORS.textGrey, fontSize: 12, textAlign: 'center', lineHeight: 16 },
  badgeDescriptionLocked: { color: COLORS.mediumGrey },
  activityList: { gap: 10 },
  activityItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.darkGrey, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: COLORS.mediumGrey },
  activityIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.brandGreen + '20', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  activityContent: { flex: 1 },
  activityTitle: { color: COLORS.white, fontSize: 14, fontWeight: '600' },
  activityDate: { color: COLORS.textGrey, fontSize: 12, marginTop: 2 },
  activityPoints: { alignItems: 'flex-end' },
  activityPointsText: { color: COLORS.brandGreen, fontSize: 14, fontWeight: 'bold' },

  // Edit Mode Styles
  editNameInput: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.brandGreen,
    textAlign: 'center',
    minWidth: 200,
    paddingVertical: 5
  },
  editActions: {
    flexDirection: 'row',
    marginTop: 15,
    gap: 10,
    alignItems: 'center'
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.brandGreen,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  saveButtonText: {
    color: COLORS.black,
    fontWeight: 'bold',
    marginLeft: 5
  },
  cancelButton: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: COLORS.mediumGrey,
  },

  bottomSpacer: { height: 50 },
});

export default ProfileScreen;