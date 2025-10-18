import React, { useState, useEffect, memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useRegion } from '../context/RegionContext';
import TranslationService from '../services/TranslationService';
import * as ApiService from '../services/ApiService';
import { mapImage } from '../utils/imageMapper';

export const AttractionCard = memo(({ item }) => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { selectedRegionId } = useRegion();
  const t = (key) => TranslationService.translate(key);
  const [imageUri, setImageUri] = useState(null);
  const [translatedName, setTranslatedName] = useState('');
  const [translatedDescription, setTranslatedDescription] = useState('');
  const scaleAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      const nameKey = item.name;
      const descriptionKey = item.description;
      setTranslatedName(TranslationService.translate(nameKey));
      setTranslatedDescription(TranslationService.translate(descriptionKey));

      // ПРИОРИТЕТ 1: Если есть прямой URL из БД (photoUrl) - используем его
      if (item.photoUrl) {
        setImageUri(item.photoUrl);
        return;
      }

      // ПРИОРИТЕТ 2: Локальное изображение (для Павлодара)
      if (item.image) {
        const localImage = mapImage(item.image);
        if (localImage) {
          setImageUri(localImage);
          return;
        }
      }

      // ПРИОРИТЕТ 3: Google Places API (запасной вариант)
      try {
        const nameEn = await TranslationService.translate(nameKey, {}, 'en');
        const regions = await ApiService.getRegions();
        const region = regions.find(r => r.id === item.regionId);
        const cityEn = region ? await TranslationService.translate(region.name, {}, 'en') : '';
        
        if (nameEn && !nameEn.includes('attractions.')) {
          const searchQuery = `"${nameEn}" in ${cityEn}`;
          const { photoUrl } = await ApiService.findPlacePhoto(searchQuery);
          if (photoUrl && isMounted) {
            setImageUri(photoUrl);
          }
        }
      } catch (error) {
        console.error("Failed to load Google Places image for", nameKey);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [item.id, language]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity 
        style={[styles.card, { backgroundColor: theme.colors.cardBackground }]}
        onPress={() => navigation.navigate('AttractionDetail', { 
          attraction: item,
          translatedName,
          translatedDescription
        })}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <View style={styles.imageContainer}>
          <Image 
            source={imageUri || (item.image ? mapImage(item.image) : null)} 
            placeholder={item.image ? mapImage(item.image) : null}
            contentFit="cover"
            transition={500}
            style={styles.image}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.6)']}
            style={styles.imageGradient}
          />
        </View>
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={2}>
            {translatedName}
          </Text>
          <View style={styles.bottomRow}>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={14} color={theme.colors.textSecondary} />
              <Text style={[styles.location, { color: theme.colors.textSecondary }]} numberOfLines={1}>
                {item.location}
              </Text>
            </View>
            {item.rating && (
              <View style={[styles.ratingBadge, { backgroundColor: theme.colors.primary + '20' }]}>
                <Ionicons name="star" size={12} color={theme.colors.primary} />
                <Text style={[styles.ratingText, { color: theme.colors.primary }]}>{item.rating}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    overflow: 'hidden',
    height: 110,
  },
  imageContainer: {
    width: 110,
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  content: {
    flex: 1,
    padding: 14,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  location: {
    fontSize: 12,
    flex: 1,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    gap: 3,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
  },
}); 