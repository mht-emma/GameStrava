import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

// Screens
import HomeScreen from '../screens/HomeScreen';
import ChallengesScreen from '../screens/ChallengesScreen';
import ClassementScreen from '../screens/ClassementScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Components
import Icon from '../components/Icon';

// Theme
import { colors, spacing, borderRadius, shadows } from '../theme';
import { icons } from '../theme/icons';

const Tab = createBottomTabNavigator();

// Composant d'onglet animé personnalisé (Minimaliste)
const CustomTabBarButton = ({ children, onPress, accessibilityState }) => {
  const focused = accessibilityState?.selected;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSpring(focused ? 1.05 : 1, {
            damping: 15,
            stiffness: 150,
          }),
        },
      ],
    };
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{ flex: 1 }}
    >
      <Animated.View style={[styles.tabButtonContainer, animatedStyle]}>
        <View style={styles.tabButtonContent}>
          {children}
          {focused && <View style={styles.activeDot} />}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarStyle: styles.tabBar,
          tabBarBackground: () => (
            <LinearGradient
              colors={colors.gradients.premium}
              style={StyleSheet.absoluteFillObject}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          ),
          tabBarActiveTintColor: colors.primary, // Green when active
          tabBarInactiveTintColor: colors.text.secondary, // Grey when inactive
          headerShown: false,
          tabBarShowLabel: true,
          tabBarLabelStyle: styles.tabLabel,
          tabBarButton: CustomTabBarButton,
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Accueil',
            tabBarIcon: ({ focused, color, size }) => (
              <Icon
                name={focused ? icons.homeFilled : icons.home}
                size={24}
                color={color} // Use the color passed by react-navigation (Green or Grey)
              />
            ),
          }}
        />
        <Tab.Screen
          name="Challenges"
          component={ChallengesScreen}
          options={{
            tabBarLabel: 'Défis',
            tabBarIcon: ({ focused, color, size }) => (
              <Icon
                name={focused ? icons.challengesFilled : icons.challenges}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Classement"
          component={ClassementScreen}
          options={{
            tabBarLabel: 'Classement',
            tabBarIcon: ({ focused, color, size }) => (
              <Icon
                name={focused ? 'trophy' : 'trophy-outline'}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: 'Profil',
            tabBarIcon: ({ focused, color, size }) => (
              <Icon
                name={focused ? icons.profileFilled : icons.profile}
                size={24}
                color={color}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    height: 80,
    borderRadius: 30, // Softer roundness, less pill-like
    borderTopWidth: 0,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)', // Subtle glass border
    backgroundColor: 'transparent',
  },
  tabButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabButtonContent: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
    position: 'absolute',
    bottom: 12, // Positioning underneath the label
  }
});

export default AppNavigator;
