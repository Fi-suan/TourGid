import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import TranslationService from '../services/TranslationService';

export const InterestSelector = ({ interests, onSelect, selectedInterest }) => {
  const { theme } = useTheme();
  
  return (
    <View style={styles.container}>
      <FlatList
        data={interests}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isSelected = selectedInterest && selectedInterest.id === item.id;
          
          return (
            <TouchableOpacity
              style={[
                styles.interestItem,
                { backgroundColor: theme.isDark ? '#333333' : '#F0F8FF' },
                isSelected && { backgroundColor: theme.colors.primary }
              ]}
              onPress={() => onSelect(isSelected ? null : item)}
              activeOpacity={0.7}
            >
              <Ionicons 
                name={item.icon} 
                size={24} 
                color={isSelected ? '#FFFFFF' : theme.colors.primary} 
              />
              <Text 
                style={[
                  styles.interestText,
                  { color: isSelected ? '#FFFFFF' : theme.colors.primary },
                ]}
              >
                {TranslationService.translate(`interests.${item.id}`)}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
  },
  interestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 25,
    marginRight: 10,
  },
  interestText: {
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 14,
  }
}); 