// src/screens/ClassementScreen.js

import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { useRankings } from '../hooks/useRankings';

const { width } = Dimensions.get('window');

const COLORS = {
  black: '#000000',
  darkGrey: '#121212', // Fond des cartes
  mediumGrey: '#444444', // Bordures et icônes
  brandGreen: '#69a342', // Vert pistache
  textGrey: '#AAAAAA',
  white: '#FFFFFF'
};

const ClassementScreen = () => {
  const { user } = useContext(AuthContext);
  const [period, setPeriod] = useState('week');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const { rankings, loading, currentUserRank } = useRankings(period, user?.id);

  // Filtrer les rankings selon la recherche
  const filteredRankings = rankings.filter(ranking => 
    ranking.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const podium = filteredRankings.slice(0, 3);
  const restOfRankings = filteredRankings.slice(3);

  const getPeriodLabel = () => {
    switch (period) {
      case 'week': return 'Cette semaine';
      case 'month': return 'Ce mois';
      case 'all': return 'Tout le temps';
      default: return '';
    }
  };

  const getMedalColor = (rank) => {
    switch (rank) {
      case 1: return COLORS.brandGreen; // Or -> Vert pour cohérence marque
      case 2: return COLORS.mediumGrey;
      case 3: return '#855E42'; // Bronze
      default: return COLORS.mediumGrey;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.black} />

      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Classement</Text>
            <Text style={styles.headerSubtitle}>{getPeriodLabel()}</Text>
          </View>
          <View style={styles.trophyIcon}>
            <Ionicons name="trophy" size={24} color={COLORS.brandGreen} />
          </View>
        </View>

        {/* Period Filters */}
        <View style={styles.filtersContainer}>
          {[
            { key: 'week', label: 'Semaine' },
            { key: 'month', label: 'Mois' },
            { key: 'all', label: 'Global' }
          ].map((p) => (
            <TouchableOpacity
              key={p.key}
              style={[styles.filterButton, period === p.key && styles.filterButtonActive]}
              onPress={() => setPeriod(p.key)}
            >
              <Text style={[styles.filterText, period === p.key && styles.filterTextActive]}>
                {p.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* SEARCH BAR */}
        <View style={styles.searchContainer}>
          <TouchableOpacity 
            style={styles.searchToggle}
            onPress={() => setShowSearch(!showSearch)}
          >
            <Ionicons name="search" size={20} color={COLORS.brandGreen} />
            <Text style={styles.searchToggleText}>
              {showSearch ? 'Masquer la recherche' : 'Rechercher un joueur'}
            </Text>
          </TouchableOpacity>
          
          {showSearch && (
            <View style={styles.searchInputContainer}>
              <Ionicons name="search" size={20} color={COLORS.textGrey} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Nom du joueur..."
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
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Podium Section */}
        <View style={styles.podiumSection}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Chargement du classement...</Text>
            </View>
          ) : podium.length >= 3 ? (
            <View style={styles.podiumContainer}>
              {/* 2nd Place */}
              <View style={styles.podiumItem}>
                <View style={[styles.avatarCircle, { borderColor: COLORS.mediumGrey }]}>
                  <Ionicons name="person" size={28} color={COLORS.mediumGrey} />
                </View>
                <Text style={styles.podiumName} numberOfLines={1}>{podium[1]?.name || 'Utilisateur'}</Text>
                <Text style={styles.podiumPoints}>{podium[1]?.points || 0} pts</Text>
                <View style={[styles.podiumBar, { height: 80, backgroundColor: COLORS.darkGrey }]} />
              </View>

              {/* 1st Place */}
              <View style={[styles.podiumItem, styles.podiumFirst]}>
                <View style={styles.crownContainer}>
                  <Ionicons name="trophy" size={24} color={COLORS.brandGreen} />
                </View>
                <View style={[styles.avatarCircle, styles.avatarCircleFirst, { borderColor: COLORS.brandGreen }]}>
                  <Ionicons name="person" size={38} color={COLORS.brandGreen} />
                </View>
                <Text style={styles.podiumNameFirst} numberOfLines={1}>{podium[0]?.name || 'Utilisateur'}</Text>
                <Text style={styles.podiumPointsFirst}>{podium[0]?.points || 0} pts</Text>
                <View style={[styles.podiumBar, styles.podiumBarFirst, { height: 120, backgroundColor: COLORS.darkGrey }]} />
              </View>

              {/* 3rd Place */}
              <View style={styles.podiumItem}>
                <View style={[styles.avatarCircle, { borderColor: COLORS.mediumGrey }]}>
                  <Ionicons name="person" size={28} color={COLORS.mediumGrey} />
                </View>
                <Text style={styles.podiumName} numberOfLines={1}>{podium[2]?.name || 'Utilisateur'}</Text>
                <Text style={styles.podiumPoints}>{podium[2]?.points || 0} pts</Text>
                <View style={[styles.podiumBar, { height: 60, backgroundColor: COLORS.darkGrey }]} />
              </View>
            </View>
          ) : (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Classement indisponible</Text>
            </View>
          )}
        </View>

        {/* Rankings List */}
        <View style={styles.listSection}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Chargement de la liste...</Text>
            </View>
          ) : restOfRankings.length > 0 ? (
            restOfRankings.map((user) => (
              <View
                key={user.id}
                style={[
                  styles.rankCard,
                  user.isCurrentUser && styles.currentUserCard,
                ]}
              >
                <View style={styles.rankRow}>
                  <Text style={[styles.rankNumber, user.isCurrentUser && { color: COLORS.brandGreen }]}>
                    {user.rank}
                  </Text>

                  <View style={[styles.listAvatar, user.isCurrentUser && { borderColor: COLORS.brandGreen }]}>
                    <Ionicons 
                      name="person" 
                      size={20} 
                      color={user.isCurrentUser ? COLORS.brandGreen : COLORS.mediumGrey} 
                    />
                  </View>

                  <View style={styles.userInfo}>
                    <Text style={[styles.userName, user.isCurrentUser && { color: COLORS.brandGreen }]}>
                      {user.name}
                    </Text>
                    <View style={styles.trendContainer}>
                      <Ionicons name="trending-up" size={12} color={COLORS.brandGreen} />
                      <Text style={styles.trendText}>{user.trend}</Text>
                    </View>
                  </View>

                  <View style={styles.pointsColumn}>
                    <Text style={[styles.listPoints, user.isCurrentUser && { color: COLORS.brandGreen }]}>
                      {user.points}
                    </Text>
                    <Text style={styles.listPointsLabel}>points</Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Aucun classement disponible</Text>
            </View>
          )}
        </View>

        {/* Footer Info */}
        <View style={styles.infoCard}>
          <View style={styles.infoIconContainer}>
            <Ionicons name="information-circle" size={20} color={COLORS.brandGreen} />
          </View>
          <Text style={styles.infoText}>
            Les points sont calculés selon vos défis complétés et votre régularité.
          </Text>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.black },
  headerContainer: { backgroundColor: COLORS.black, borderBottomWidth: 1, borderBottomColor: COLORS.mediumGrey },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: COLORS.white },
  headerSubtitle: { fontSize: 14, color: COLORS.textGrey, marginTop: 4 },
  trophyIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.darkGrey, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.mediumGrey },
  
  // Filters
  filtersContainer: { flexDirection: 'row', paddingHorizontal: 20, paddingBottom: 16, gap: 10 },
  filterButton: { flex: 1, paddingVertical: 10, borderRadius: 12, backgroundColor: COLORS.darkGrey, alignItems: 'center', borderWidth: 1, borderColor: COLORS.mediumGrey },
  filterButtonActive: { backgroundColor: COLORS.brandGreen, borderColor: COLORS.brandGreen },
  filterText: { fontSize: 14, fontWeight: '600', color: COLORS.textGrey },
  filterTextActive: { color: COLORS.white },

  // Search
  searchContainer: { paddingHorizontal: 20, paddingBottom: 16 },
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

  // Podium
  podiumSection: { paddingTop: 30, paddingBottom: 20 },
  podiumContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', gap: 10 },
  podiumItem: { alignItems: 'center', flex: 1 },
  podiumFirst: { marginBottom: 15 },
  avatarCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.darkGrey, borderWidth: 2, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  avatarCircleFirst: { width: 80, height: 80, borderRadius: 40, borderWidth: 3 },
  crownContainer: { marginBottom: 4 },
  podiumName: { fontSize: 12, color: COLORS.textGrey, marginBottom: 4 },
  podiumNameFirst: { fontSize: 14, fontWeight: 'bold', color: COLORS.white, marginBottom: 4 },
  podiumPoints: { fontSize: 14, fontWeight: 'bold', color: COLORS.white },
  podiumPointsFirst: { fontSize: 18, fontWeight: 'bold', color: COLORS.brandGreen },
  podiumBar: { width: '100%', borderTopLeftRadius: 12, borderTopRightRadius: 12, borderWidth: 1, borderColor: COLORS.mediumGrey, borderBottomWidth: 0 },
  podiumBarFirst: { borderColor: COLORS.brandGreen },

  // List
  scrollContent: { paddingHorizontal: 20 },
  rankCard: { backgroundColor: COLORS.darkGrey, borderRadius: 16, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: COLORS.mediumGrey },
  currentUserCard: { borderColor: COLORS.brandGreen, borderWidth: 1.5 },
  rankRow: { flexDirection: 'row', alignItems: 'center' },
  rankNumber: { fontSize: 18, fontWeight: 'bold', color: COLORS.mediumGrey, width: 30 },
  listAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.black, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.mediumGrey, marginRight: 12 },
  userInfo: { flex: 1 },
  userName: { fontSize: 16, fontWeight: '600', color: COLORS.white },
  trendContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 2, gap: 4 },
  trendText: { fontSize: 12, color: COLORS.brandGreen, fontWeight: 'bold' },
  pointsColumn: { alignItems: 'flex-end' },
  listPoints: { fontSize: 18, fontWeight: 'bold', color: COLORS.white },
  listPointsLabel: { fontSize: 10, color: COLORS.textGrey },

  // Info
  infoCard: { 
    marginTop: 20, 
    padding: 16, 
    backgroundColor: COLORS.darkGrey, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: COLORS.mediumGrey,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  infoIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.brandGreen + '20',
    justifyContent: 'center',
    alignItems: 'center'
  },
  infoText: { color: COLORS.textGrey, fontSize: 12, lineHeight: 18, flex: 1 },
  loadingContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  loadingText: { color: COLORS.textGrey, fontSize: 16 },
  bottomSpacer: { height: 50 }
});

export default ClassementScreen;