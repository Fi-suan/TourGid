import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator, SafeAreaView } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import TranslationService from '../services/TranslationService';
import * as ApiService from '../services/ApiService';
import { mapImage } from '../utils/imageMapper';

const { width } = Dimensions.get('window');

export const RegionInfoScreen = ({ route }) => {
  const { theme } = useTheme();
  const t = (key, params) => TranslationService.translate(key, params);
  const { regionId } = route.params;

  const [region, setRegion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRegionData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // We fetch all regions and then find the one we need.
        // A dedicated /api/regions/:id endpoint would be an optimization.
        const regions = await ApiService.getRegions();
        const currentRegion = regions.find(r => r.id === regionId);
        if (currentRegion) {
          setRegion(currentRegion);
        } else {
          throw new Error('Region not found');
        }
      } catch (e) {
        console.error("Failed to fetch region data:", e);
        setError(t('errors.fetchDataFailed'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegionData();
  }, [regionId]);

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error || !region) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.text }}>{error || t('errors.regionNotFound')}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.background}}>
        <ScrollView style={styles.container}>
        <Image 
          source={region.photoUrl || mapImage(region.mapImage)} 
          placeholder={mapImage(region.mapImage)}
          contentFit="cover"
          transition={500}
          style={styles.mapImage} 
        />
        <View style={styles.content}>
            <Text style={[styles.title, { color: theme.colors.text }]}>{t(region.name)}</Text>
            <Text style={[styles.description, { color: theme.colors.textSecondary }]}>{t(region.description)}</Text>
            
            {/* География */}
            <View style={[styles.infoCard, { backgroundColor: theme.colors.cardBackground }]}>
              <View style={styles.cardHeader}>
                <Ionicons name="map-outline" size={24} color={theme.colors.primary} />
                <Text style={[styles.cardTitle, { color: theme.colors.text }]}>География</Text>
              </View>
              <Text style={[styles.cardText, { color: theme.colors.textSecondary }]}>{t(region.geography)}</Text>
            </View>

            {/* Культура */}
            <View style={[styles.infoCard, { backgroundColor: theme.colors.cardBackground }]}>
              <View style={styles.cardHeader}>
                <Ionicons name="color-palette-outline" size={24} color={theme.colors.primary} />
                <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Культура</Text>
              </View>
              <Text style={[styles.cardText, { color: theme.colors.textSecondary }]}>{t(region.culture)}</Text>
            </View>

            {/* Природа */}
            <View style={[styles.infoCard, { backgroundColor: theme.colors.cardBackground }]}>
              <View style={styles.cardHeader}>
                <Ionicons name="leaf-outline" size={24} color={theme.colors.primary} />
                <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Природа</Text>
              </View>
              <Text style={[styles.cardText, { color: theme.colors.textSecondary }]}>{t(region.nature)}</Text>
            </View>
        </View>
        </ScrollView>
    </SafeAreaView>
  );
};

const InfoSection = ({ title, children }) => {
    const { theme } = useTheme();
    return (
        <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{title}</Text>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  mapImage: {
    width: width,
    height: 250,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  infoCard: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  cardText: {
    fontSize: 15,
    lineHeight: 22,
  },
});