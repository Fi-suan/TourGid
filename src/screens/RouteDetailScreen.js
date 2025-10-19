import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, ActivityIndicator } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import TranslationService from '../services/TranslationService';
import { Ionicons } from '@expo/vector-icons';
import * as ApiService from '../services/ApiService';
import MapView, { Marker } from 'react-native-maps';
import { AttractionCard } from '../components/AttractionCard';

const { width } = Dimensions.get('window');

export const RouteDetailScreen = ({ route, navigation }) => {
  const { routeId, route: passedRoute, translatedName, translatedDescription } = route.params;
  const { theme } = useTheme();
  const t = (key, params) => TranslationService.translate(key, params);
  const mapRef = useRef(null);

  const [routeData, setRouteData] = useState(null);
  const [attractions, setAttractions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRouteDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Если маршрут передан напрямую (например, от AI)
        if (passedRoute) {
          const allAttractions = await ApiService.getAttractions();
          const routeAttractions = (passedRoute.attractions || [])
            .map(id => allAttractions.find(a => a.id === id))
            .filter(Boolean);
          
          setRouteData(passedRoute);
          setAttractions(routeAttractions);
          setIsLoading(false);
          return;
        }

        // Иначе загружаем по ID
        const [allRoutes, allAttractions] = await Promise.all([
          ApiService.getRoutes(),
          ApiService.getAttractions()
        ]);

        const currentRoute = allRoutes.find(r => r.id === routeId);

        if (!currentRoute) {
          throw new Error('Route not found');
        }

        const routeAttractions = (currentRoute.attractions || [])
          .map(id => allAttractions.find(a => a.id === id))
          .filter(Boolean);
        
        setRouteData(currentRoute);
        setAttractions(routeAttractions);

      } catch (e) {
        console.error("Failed to fetch route details:", e);
        setError(t('errors.fetchDataFailed'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchRouteDetails();
  }, [routeId, passedRoute]);

  const onMapReady = () => {
    if (mapRef.current && attractions.length > 0) {
      // Ограничиваем до первых 2 маркеров для построения маршрута
      const limitedAttractions = attractions.slice(0, 2);
      const identifiers = limitedAttractions.map(a => a.id);
      mapRef.current.fitToSuppliedMarkers(identifiers, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error || !routeData) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: theme.colors.text }}>{error || t('screens.routeDetail.notFound')}</Text>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView>
        <View style={styles.header}>
            <Image 
              source={routeData.photoUrl ? { uri: routeData.photoUrl } : require('../assets/pavlodar-region.jpg')} 
              style={styles.headerImage} 
            />
            <View style={styles.headerOverlay} />
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={28} color="white" />
            </TouchableOpacity>
            <Text style={styles.title}>{t(routeData.name)}</Text>
        </View>

        <View style={styles.content}>
            <View style={styles.infoRow}>
                <InfoChip icon="time-outline" text={routeData.duration} theme={theme} />
                <InfoChip icon="trending-up-outline" text={routeData.difficulty} theme={theme} />
                <InfoChip icon="car-sport-outline" text={routeData.recommendedTransport} theme={theme} />
            </View>
            
            <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
                {t(routeData.description)}
            </Text>

            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t('screens.routeDetail.mapTitle')}</Text>
            <View style={styles.mapContainer}>
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    onMapReady={onMapReady}
                    scrollEnabled={false}
                    zoomEnabled={false}
                    pitchEnabled={false}
                    rotateEnabled={false}
                >
                    {attractions.slice(0, 2).map((attraction, index) => (
                        <Marker
                            key={attraction.id}
                            identifier={attraction.id}
                            coordinate={attraction.coordinates}
                            title={t(attraction.name)}
                            pinColor={index === 0 ? 'green' : 'red'}
                        />
                    ))}
                </MapView>
            </View>

            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t('screens.routeDetail.attractionsTitle')}</Text>
            {attractions.map(attraction => (
              <AttractionCard 
                key={attraction.id} 
                item={attraction} 
              />
            ))}

            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t('screens.routeDetail.tipsTitle')}</Text>
            <View style={styles.tipsContainer}>
                {routeData.tips.map((tip, index) => (
                    <View key={index} style={styles.tipItem}>
                        <Ionicons name="checkmark-circle-outline" size={22} color={theme.colors.primary} style={styles.tipIcon} />
                        <Text style={[styles.tipText, { color: theme.colors.textSecondary }]}>{t(tip)}</Text>
                    </View>
                ))}
            </View>
        </View>
      </ScrollView>
      <TouchableOpacity 
        style={[styles.startButton, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate('Map', { selectedRoute: routeData.id })}
      >
        <Ionicons name="navigate-outline" size={24} color="white" />
        <Text style={styles.startButtonText}>{t('screens.routeDetail.startButton')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const InfoChip = ({ icon, text, theme }) => (
    <View style={[styles.infoChip, { backgroundColor: theme.colors.cardBackground, shadowColor: theme.colors.text }]}>
        <Ionicons name={icon} size={20} color={theme.colors.primary} />
        <Text style={[styles.infoChipText, { color: theme.colors.textSecondary }]}>{text}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        height: 250,
        justifyContent: 'flex-end',
    },
    headerImage: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
    },
    headerOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)'
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 15,
        padding: 5,
        zIndex: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        padding: 20,
    },
    content: {
        padding: 20,
        paddingBottom: 100, // Space for the start button
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
        marginTop: -45,
    },
    infoChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        elevation: 3,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    infoChipText: {
        marginLeft: 8,
        fontSize: 13,
        fontWeight: '500',
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    mapContainer: {
        height: 200,
        borderRadius: 15,
        overflow: 'hidden',
        marginBottom: 20,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    tipsContainer: {
        backgroundColor: 'transparent',
    },
    tipItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    tipIcon: {
        marginRight: 10,
        marginTop: 2,
    },
    tipText: {
        flex: 1,
        fontSize: 15,
        lineHeight: 22,
    },
    startButton: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        borderRadius: 15,
        elevation: 5,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    startButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    }
});