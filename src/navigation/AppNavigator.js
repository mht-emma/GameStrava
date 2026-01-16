import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
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

// Composant d'onglet animé personnalisé
const CustomTabBarButton = ({ children, onPress, accessibilityState }) => {
  const focused = accessibilityState.selected;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSpring(focused ? 1.1 : 1, {
            damping: 15,
            stiffness: 150,
          }),
        },
      ],
    };
  });

  return (
    <Animated.View style={[styles.tabButtonContainer, animatedStyle]}>
      <LinearGradient
        colors={focused ? colors.gradients.primary : colors.gradients.dark}
        style={styles.tabButtonGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {children}
      </LinearGradient>
    </Animated.View>
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
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.text.secondary,
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
                size={size}
                color={focused ? colors.black : color}
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
                size={size}
                color={focused ? colors.black : color}
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
                size={size}
                color={focused ? colors.black : color}
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
                size={size}
                color={focused ? colors.black : color}
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
    bottom: spacing.lg,
    left: spacing.xl,
    right: spacing.xl,
    height: 70,
    borderRadius: borderRadius.xxxl,
    borderTopWidth: 0,
    elevation: 10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary + '30',
    backgroundColor: 'transparent',
  },
  tabButtonContainer: {
    flex: 1,
    margin: spacing.xs,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  tabButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: spacing.xxs,
  },
});

export default AppNavigator;
