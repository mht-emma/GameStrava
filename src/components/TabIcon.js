// TabIcon.js - Composant d'icône pour la navigation
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../theme';

const TabIcon = ({ name, size = 24, color = colors.text.secondary, style }) => {
    return (
        <View style={[styles.container, style]}>
            <Icon name={name} size={size} color={color} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default TabIcon;
