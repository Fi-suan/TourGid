import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import TranslationService from '../services/TranslationService';
import { useLanguage } from '../context/LanguageContext';

const TranslatedText = React.memo(({ textKey, style }) => {
  const { language } = useLanguage();
  const [text, setText] = useState(textKey);

  useEffect(() => {
    let isMounted = true;
    const translate = async () => {
      const translationResult = TranslationService.translate(textKey);
      if (typeof translationResult.then === 'function') {
        translationResult.then(translatedText => {
          if (isMounted) {
            setText(translatedText);
          }
        });
      } else {
        setText(translationResult);
      }
    };
    translate();
    return () => { isMounted = false; };
  }, [textKey, language]);

  return <Text style={style}>{text}</Text>;
});

export const AttractionCard = React.memo(({ item, interests }) => {
  const navigation = useNavigation();
  const { theme } = useTheme();

  const getCategoryName = (categoryId) => {
    const interest = interests.find(i => i.id === categoryId);
    return interest ? TranslationService.translate(interest.name) : '';
  };

  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: theme.colors.cardBackground }]}
      onPress={() => navigation.navigate('AttractionDetail', { attraction: item })}
      activeOpacity={0.8}
    >
      <Image source={item.image} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.categoryContainer}>
            {item.categories.slice(0, 2).map(cat => (
              <View key={cat} style={[styles.categoryBadge, { backgroundColor: theme.colors.primary + '20' }]}>
                <Text style={[styles.categoryText, { color: theme.colors.primary }]}>
                  {getCategoryName(cat)}
                </Text>
              </View>
            ))}
          </View>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={[styles.rating, { color: theme.colors.text }]}>{item.rating}</Text>
          </View>
        </View>
        <Text style={[styles.title, { color: theme.colors.text }]}>{item.name}</Text>
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={14} color={theme.colors.textSecondary} />
          <Text style={[styles.location, { color: theme.colors.textSecondary }]}>{item.location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginVertical: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover'
  },
  content: {
    flex: 1,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  categoryContainer: {
    flexDirection: 'row',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 5,
    fontSize: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  location: {
    marginLeft: 5,
    fontSize: 14,
  },
}); 