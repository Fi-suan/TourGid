import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  TouchableOpacity,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import * as ApiService from '../services/ApiService'; // Use ApiService
import TranslationService from '../services/TranslationService';
import GoogleAPIService from '../services/GoogleAPIService';
import { Ionicons } from '@expo/vector-icons';
import { getDirectionsFromGoogle } from '../utils/geoUtils';

const { width } = Dimensions.get('window');

export const MapScreen = ({ route, navigation }) => {
  const { selectedAttractions, selectedRoute, aiRoute, routeFromUserTo } = route.params || {};
  const [markers, setMarkers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [attractions, setAttractions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const mapRef = useRef(null);
  
  const { theme } = useTheme();
  const t = (key, params) => TranslationService.translate(key, params);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);
    })();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
        try {
            console.log('🗺️ MapScreen: Fetching data from backend...');
            setIsLoading(true);
            const [fetchedAttractions, fetchedRoutes] = await Promise.all([
                ApiService.getAttractions(), // Fetch all attractions
                ApiService.getRoutes()      // Fetch all routes
            ]);
            console.log('✅ MapScreen: Got attractions:', fetchedAttractions?.length || 0);
            console.log('✅ MapScreen: Got routes:', fetchedRoutes?.length || 0);
            setAttractions(fetchedAttractions || []);
            setRoutes(fetchedRoutes || []);
        } catch (error) {
            console.error("❌ MapScreen: Failed to fetch map data:", error.message);
            setAttractions([]);
            setRoutes([]);
        } finally {
            setIsLoading(false);
        }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!attractions || attractions.length === 0) {
      console.log('⚠️ Нет данных о достопримечательностях');
      setIsLoading(false);
      return;
    }

    let attractionsToShow = [];
    let shouldShowRoute = false;
    let isRouteFromUser = false;

    console.log('🗺️ MapScreen params:', { 
      routeFromUserTo: !!routeFromUserTo, 
      aiRoute: !!aiRoute, 
      selectedRoute, 
      selectedAttractions: selectedAttractions?.length || 0 
    });

    if (routeFromUserTo) {
      attractionsToShow = [routeFromUserTo];
      shouldShowRoute = true;
      isRouteFromUser = true;
      console.log('📍 Режим: маршрут от пользователя');
    } else if (aiRoute) {
      attractionsToShow = [aiRoute.destination];
      shouldShowRoute = true;
      console.log('🤖 Режим: AI маршрут');
    } else if (selectedRoute) {
      const routeData = routes.find(r => r.id === selectedRoute);
      if (routeData) {
        attractionsToShow = routeData.attractions
          .map(id => attractions.find(a => a.id === id))
          .filter(Boolean);
        shouldShowRoute = true;
        console.log('🗺️ Режим: готовый маршрут, мест:', attractionsToShow.length);
      }
    } else if (selectedAttractions && selectedAttractions.length > 0) {
      attractionsToShow = attractions.filter(a => selectedAttractions.includes(a.id));
      console.log('📍 Режим: выбранные достопримечательности, мест:', attractionsToShow.length);
    } else {
      // Show all attractions
      console.log('🗺️ Режим: все достопримечательности, всего:', attractions.length);
      const allMarkers = attractions.map(attraction => createMarker(attraction)).filter(Boolean);
      setMarkers(allMarkers);
      setIsLoading(false);
      return;
    }
    
    // Build route if requested
    if (shouldShowRoute && attractionsToShow.length > 0) {
      // Создаем маркеры для маршрута
      const routeMarkers = attractionsToShow.map(createMarker).filter(Boolean);
      console.log('📌 Создано маркеров:', routeMarkers.length);
      setMarkers(routeMarkers);
      buildRoute(attractionsToShow, isRouteFromUser);
    } else if (attractionsToShow.length > 0) {
      setIsLoading(false);
      const newMarkers = attractionsToShow.map(createMarker).filter(Boolean);
      console.log('📌 Создано маркеров:', newMarkers.length);
      setMarkers(newMarkers);
      fitToMarkers(attractionsToShow);
    } else {
      console.log('⚠️ Нет достопримечательностей для отображения');
      setIsLoading(false);
    }
  }, [attractions, routes, route.params]); // Rerun when data or params change

  const createMarker = (attraction) => {
    if (!attraction?.coordinates) return null;
    return {
      id: attraction.id,
      name: attraction.name, // Добавляем для панели
      coordinates: attraction.coordinates,
      title: t(attraction.name),
      location: attraction.location,
    };
  };

  const buildRoute = async (routeAttractions, isRouteFromUser = false) => {
    setIsLoading(true);

    if (isRouteFromUser && !userLocation) {
      return;
    }
    
    const origin = isRouteFromUser ? userLocation : routeAttractions[0].coordinates;
    const destination = routeAttractions[routeAttractions.length - 1].coordinates;
    
    let waypoints = [];
    if (isRouteFromUser && routeAttractions.length > 1) {
      waypoints = routeAttractions.slice(0, -1).map(a => a.coordinates);
    } else if (!isRouteFromUser && routeAttractions.length > 2) {
      waypoints = routeAttractions.slice(1, -1).map(a => a.coordinates);
    }

    try {
      const routeResult = await getDirectionsFromGoogle(origin, destination, waypoints);
      if (routeResult.success) {
        setRouteCoordinates(routeResult.route.coordinates);
        
        const markersToFit = isRouteFromUser && userLocation 
          ? [...routeAttractions, { id: 'userLocation', coordinates: userLocation }] 
          : routeAttractions;
          
        fitToMarkers(markersToFit);
      }
    } catch (error) {
      console.error("Route build failed:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const fitToMarkers = (markers) => {
    if (mapRef.current) {
        const markerIdentifiers = markers.map(marker => marker.id);
        mapRef.current.fitToSuppliedMarkers(markerIdentifiers, {
            edgePadding: { top: 100, right: 100, bottom: 150, left: 100 },
            animated: true,
        });
    }
  }

  const handleMarkerPress = (attraction) => {
    setSelectedMarker(attraction);
  };

  const handleDetailsPress = (attraction) => {
    // Передаем переведенные данные
    const translatedName = t(attraction.name);
    const translatedDescription = t(attraction.description);
    navigation.navigate('AttractionDetail', { 
      attraction, 
      translatedName, 
      translatedDescription 
    });
  };
  
  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ color: theme.colors.text, marginTop: 10 }}>{t('common.loadingMap')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={attractions.length > 0 ? {
          ...attractions[0].coordinates,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        } : {
          latitude: 52.2973,
          longitude: 76.9617,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
        showsUserLocation={true}
      >
        {markers.map(marker => (
          <Marker
            key={marker.id}
            identifier={marker.id}
            coordinate={marker.coordinates}
            title={marker.title}
            onPress={() => handleMarkerPress(marker)}
          />
        ))}
        {userLocation && (
          <Marker
            identifier="userLocation"
            coordinate={userLocation}
            title="My Location"
            pinColor="blue"
          />
        )}
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor={theme.colors.primary}
            strokeWidth={4}
          />
        )}
      </MapView>

      {selectedMarker && (
        <View style={[styles.attractionPanel, { backgroundColor: theme.colors.cardBackground }]}>
          <Text style={[styles.attractionName, { color: theme.colors.text }]}>{t(selectedMarker.name)}</Text>
          <Text style={[styles.attractionLocation, { color: theme.colors.textSecondary }]}>
            {selectedMarker.location}
          </Text>
          <TouchableOpacity 
            style={[styles.detailsButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => handleDetailsPress(selectedMarker)}
          >
            <Text style={styles.detailsButtonText}>{t('common.details')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  attractionPanel: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  attractionName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  attractionLocation: {
    fontSize: 14,
    marginBottom: 12,
  },
  detailsButton: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 