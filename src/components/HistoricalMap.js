import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Dimensions, ActivityIndicator, View, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import TranslationService from '../services/TranslationService';
import { 
  getDirectionsFromGoogle, 
  getRouteToAttraction, 
  getMultiPointRoute,
  analyzeRoute,
  getBoundingBox,
  calculateDistance 
} from '../utils/geoUtils';

const { width, height } = Dimensions.get('window');

export const HistoricalMap = ({ 
  attractions = [], 
  onMarkerPress, 
  showRoute = false,
  aiRoute = null,
  isAIRoute = false,
  showMarkers = false
}) => {
  const { theme } = useTheme();
  const mapRef = useRef(null);
  const t = (key, params) => TranslationService.translate(key, params);

  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [routeInfo, setRouteInfo] = useState(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [travelMode, setTravelMode] = useState('WALKING');
  const [routeAnalysis, setRouteAnalysis] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (isAIRoute && aiRoute?.route?.coordinates) {
      console.log('Displaying pre-generated AI route...');
      setRouteCoordinates(aiRoute.route.coordinates);
      setRouteInfo({
        distance: aiRoute.route.distance,
        duration: aiRoute.route.duration,
        isAI: true,
        destination: aiRoute.destination.name
      });
      setIsLoadingRoute(false);
    } else if (showRoute && attractions && attractions.length > 1) {
      generateRoute();
    } else if (isAIRoute && aiRoute) {
      generateAIRoute();
    } else {
      clearRoute();
    }
  }, [showRoute, attractions, aiRoute, isAIRoute, travelMode]);

  // 🆕 Генерация маршрута через Google Directions API с использованием местоположения пользователя
  const generateRoute = async () => {
    if (!attractions || attractions.length < 1) return;

    setIsLoadingRoute(true);
    try {
      let startPoint = userLocation;
      if (!startPoint && attractions.length > 0) {
        startPoint = attractions[0].coordinates;
      }
      
      let endPoint, waypoints;
      
      if (attractions.length === 1) {
        endPoint = attractions[0].coordinates;
        waypoints = [];
      } else {
        if (userLocation) {
          endPoint = attractions[attractions.length - 1].coordinates;
          waypoints = attractions.slice(0, -1).map(attr => attr.coordinates);
        } else {
          startPoint = attractions[0].coordinates;
          endPoint = attractions[attractions.length - 1].coordinates;
          waypoints = attractions.slice(1, -1).map(attr => attr.coordinates);
        }
      }

      console.log('🗺️ Generating route with Google Directions API...');
      console.log('📍 Start:', startPoint);
      console.log('📍 End:', endPoint);
      console.log('📍 Waypoints:', waypoints.length);
      
      const totalDistance = calculateDistance(
        startPoint.latitude, startPoint.longitude,
        endPoint.latitude, endPoint.longitude
      );
      
      const adjustedTravelMode = totalDistance > 50 ? 'DRIVING' : travelMode;
      console.log(`📏 Distance: ${totalDistance.toFixed(1)}km, Mode: ${adjustedTravelMode}`);
      
      const routeResult = await getDirectionsFromGoogle(
        startPoint,
        endPoint,
        waypoints,
        adjustedTravelMode
      );

      if (routeResult && routeResult.success) {
        setRouteCoordinates(routeResult.route.coordinates);
        setRouteInfo({
          distance: routeResult.route.distance,
          duration: routeResult.route.duration,
          instructions: routeResult.route.instructions,
          isFallback: routeResult.isFallback
        });

        const analysis = analyzeRoute(routeResult);
        setRouteAnalysis(analysis);

        if (routeResult.route.coordinates && routeResult.route.coordinates.length > 1 && mapRef.current) {
          mapRef.current.fitToCoordinates(routeResult.route.coordinates, {
            edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
            animated: true,
          });
        }

        console.log(`✅ Route generated: ${routeResult.route.distance.toFixed(1)}km, ${Math.round(routeResult.route.duration)}min`);
      } else {
        console.log('❌ Failed to generate route, using fallback');
        generateFallbackRoute();
      }
    } catch (error) {
      console.error('Error generating route:', error);
      console.log('❌ Route generation failed, using fallback');
      generateFallbackRoute();
    } finally {
      setIsLoadingRoute(false);
    }
  };

  const generateAIRoute = async () => {
    if (!aiRoute || !aiRoute.destination) return;

    setIsLoadingRoute(true);
    try {
      let startLocation = userLocation;
      if (!startLocation) {
        startLocation = attractions?.[0]?.coordinates || {
          latitude: 52.3000,
          longitude: 76.9500
        };
      }

      const routeResult = await getRouteToAttraction(
        startLocation,
        aiRoute.destination,
        travelMode
      );

      if (routeResult && routeResult.success) {
        setRouteCoordinates(routeResult.route.coordinates);
        setRouteInfo({
          distance: routeResult.route.distance,
          duration: routeResult.route.duration,
          instructions: routeResult.route.instructions,
          isAI: true,
          destination: aiRoute.destination.name
        });

        const analysis = analyzeRoute(routeResult);
        setRouteAnalysis(analysis);

        if (routeResult.route.coordinates.length > 0 && mapRef.current) {
          const allPoints = [startLocation, ...routeResult.route.coordinates];
          mapRef.current.fitToCoordinates(allPoints, {
            edgePadding: { top: 100, right: 50, bottom: 200, left: 50 },
            animated: true,
          });
        }

        console.log(`🤖 AI route generated to ${aiRoute.destination.name}`);
      }
    } catch (error) {
      console.error('Error generating AI route:', error);
    } finally {
      setIsLoadingRoute(false);
    }
  };

  const generateFallbackRoute = () => {
    if (!attractions || attractions.length < 2) return;

    const coordinates = [];
    for (let i = 0; i < attractions.length - 1; i++) {
      const start = attractions[i].coordinates;
      const end = attractions[i + 1].coordinates;
      
      for (let j = 0; j <= 20; j++) {
        const ratio = j / 20;
        const lat = start.latitude + (end.latitude - start.latitude) * ratio;
        const lng = start.longitude + (end.longitude - start.longitude) * ratio;
        coordinates.push({ latitude: lat, longitude: lng });
      }
    }

    setRouteCoordinates(coordinates);
    
    let totalDistance = 0;
    for (let i = 0; i < attractions.length - 1; i++) {
      totalDistance += calculateDistance(
        attractions[i].coordinates.latitude,
        attractions[i].coordinates.longitude,
        attractions[i + 1].coordinates.latitude,
        attractions[i + 1].coordinates.longitude
      );
    }

    setRouteInfo({
      distance: totalDistance,
      duration: (totalDistance / 4.5) * 60, 
      isFallback: true
    });
  };

  const clearRoute = () => {
    setRouteCoordinates([]);
    setRouteInfo(null);
    setRouteAnalysis(null);
  };

  const switchTravelMode = () => {
    const modes = [
      { key: 'WALKING', name: 'Пешком', icon: 'walk' },
      { key: 'DRIVING', name: 'На машине', icon: 'car' },
      { key: 'TRANSIT', name: 'Транспорт', icon: 'bus' }
    ];

    const currentIndex = modes.findIndex(mode => mode.key === travelMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setTravelMode(modes[nextIndex].key);
  };

  const getTravelModeIcon = () => {
    switch (travelMode) {
      case 'DRIVING': return 'car';
      case 'TRANSIT': return 'bus';
      default: return 'walk';
    }
  };

  const showRouteDetails = () => {
    if (!routeInfo) return;

    const details = [
      `📏 Расстояние: ${routeInfo.distance.toFixed(1)} км`,
      `⏱️ Время: ${Math.round(routeInfo.duration)} мин`,
    ];

    if (routeInfo.isAI) {
      details.unshift(`🤖 AI маршрут к ${routeInfo.destination}`);
    }

    if (routeInfo.isFallback) {
      details.push('⚠️ Приблизительный маршрут (прямые линии)');
    }

    if (routeAnalysis) {
      if (routeAnalysis.recommendations.length > 0) {
        details.push('', '💡 Рекомендации:');
        details.push(...routeAnalysis.recommendations);
      }
      
      if (routeAnalysis.warnings.length > 0) {
        details.push('', '⚠️ Предупреждения:');
        details.push(...routeAnalysis.warnings);
      }
    }

    console.log('📋 Route details:', details.join('\n'));
  };

  const getMapCenter = () => {
    if (attractions && attractions.length > 0) {
      return attractions[0].coordinates;
    }
    
    return {
      latitude: 52.3000,
      longitude: 76.9500,
    };
  };

  if (isLoadingRoute) {
    return (
      <View style={[styles.loadingOverlay, { backgroundColor: 'rgba(0,0,0,0.3)' }]}>
        <View style={[styles.loadingContainer, { backgroundColor: theme.colors.cardBackground }]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            {isAIRoute ? 'Строим AI маршрут...' : 'Построение маршрута...'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          ...getMapCenter(),
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
        onUserLocationChange={(event) => {
          if (event.nativeEvent.coordinate) {
            setUserLocation(event.nativeEvent.coordinate);
          }
        }}
      >
        {showMarkers && attractions.map((attraction, index) => (
          <Marker
            key={attraction.id}
            coordinate={attraction.coordinates}
            title={attraction.name}
            description={attraction.description}
            onPress={() => onMarkerPress && onMarkerPress(attraction)}
          >
            <View style={[
              styles.markerContainer,
              { backgroundColor: isAIRoute && aiRoute?.destination?.id === attraction.id ? '#FF6B35' : theme.colors.primary }
            ]}>
              <Text style={styles.markerText}>{index + 1}</Text>
            </View>
          </Marker>
        ))}

        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={userLocation ? [userLocation, ...routeCoordinates] : routeCoordinates}
            strokeColor={isAIRoute ? '#FF6B35' : theme.colors.primary}
            strokeWidth={4}
            lineDashPattern={routeInfo?.isFallback ? [10, 5] : null}
          />
        )}
      </MapView>
      
      {(showRoute || isAIRoute) && (
        <View style={[styles.routeControls, { backgroundColor: theme.colors.cardBackground }]}>
          <TouchableOpacity 
            style={[styles.controlButton, { backgroundColor: theme.colors.primary }]}
            onPress={switchTravelMode}
          >
            <Ionicons name={getTravelModeIcon()} size={20} color="white" />
          </TouchableOpacity>

          {routeInfo && (
            <TouchableOpacity 
              style={styles.routeInfoContainer}
              onPress={showRouteDetails}
            >
              <Text style={[styles.routeInfoText, { color: theme.colors.text }]}>
                {routeInfo.distance.toFixed(1)} км • {Math.round(routeInfo.duration)} мин
              </Text>
              {isAIRoute && (
                <Text style={[styles.aiLabel, { color: theme.colors.primary }]}>
                  🤖 AI маршрут
                </Text>
              )}
              {routeInfo.isFallback && (
                <Text style={styles.fallbackLabel}>
                  📍 Приблизительно
                </Text>
              )}
            </TouchableOpacity>
          )}

          {isLoadingRoute && (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          )}
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
  markerContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  markerText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  routeControls: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  routeInfoContainer: {
    flex: 1,
  },
  routeInfoText: {
    fontSize: 16,
    fontWeight: '600',
  },
  aiLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  fallbackLabel: {
    fontSize: 12,
    color: '#FF9500',
    marginTop: 2,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
  },
});

const aiMapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#c9d6ff"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#a5b076"
      }
    ]
  }
];

const historicalMapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ebe3cd"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#523735"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f1e6"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#c9b2a6"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#dcd2be"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#ae9e90"
      }
    ]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#93817c"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#a5b076"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#447530"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#b9d3c2"
      }
    ]
  }
]; 