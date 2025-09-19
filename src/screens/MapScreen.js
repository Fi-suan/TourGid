import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Switch
} from 'react-native';
import { HistoricalMap } from '../components/HistoricalMap';
import { ATTRACTIONS, ROUTES } from '../constants/data';
import { useTheme } from '../context/ThemeContext';
import TranslationService from '../services/TranslationService';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';

const { width } = Dimensions.get('window');

// Компонент для отображения текста, который может загружаться асинхронно
const TranslatedText = ({ textKey, style }) => {
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
};

export const MapScreen = ({ route, navigation }) => {
  const { selectedAttractions, selectedRoute, aiRoute, destination } = route.params || {};
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [attractions, setAttractions] = useState([]);
  const [showRoute, setShowRoute] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAIRoute, setIsAIRoute] = useState(false);
  
  const { theme } = useTheme();
  const t = (key, params) => TranslationService.translate(key, params);

  // Определяем, какие достопримечательности показывать
  useEffect(() => {
    let attractionsToShow = [];
    let shouldShowRoute = false;
    
    if (aiRoute) {
      // AI-сгенерированный маршрут
      setIsAIRoute(true);
      shouldShowRoute = true;
      attractionsToShow = [aiRoute.destination];
      if (aiRoute.route?.waypoints) {
        const waypointAttractions = aiRoute.route.waypoints
          .map(wp => ATTRACTIONS.find(a => a.id === wp.attractionId))
          .filter(Boolean);
        attractionsToShow = [...attractionsToShow, ...waypointAttractions];
      }
    } else if (selectedRoute) {
      // Если выбран маршрут, получаем все его достопримечательности
      const routeData = ROUTES.find(r => r.id === selectedRoute);
      if (routeData) {
        attractionsToShow = routeData.attractions
          .map(id => ATTRACTIONS.find(a => a.id === id))
          .filter(Boolean);
        shouldShowRoute = true;
      }
    } else if (selectedAttractions && selectedAttractions.length > 0) {
      // Показ одной или нескольких выбранных достопримечательностей без маршрута
      attractionsToShow = ATTRACTIONS.filter(a => selectedAttractions.includes(a.id));
    } else {
      // По умолчанию на карте ничего не показываем (ни маркеров, ни маршрутов)
      attractionsToShow = [];
    }
    
    const translatedAttractions = attractionsToShow.map(attraction => ({
      ...attraction,
      name: t(attraction.name),
      description: t(attraction.description)
    }));
    
    setAttractions(translatedAttractions);
    setShowRoute(shouldShowRoute);
    
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // Уменьшил задержку
    
    return () => clearTimeout(timer);
  }, [selectedAttractions, selectedRoute, aiRoute]);

  const handleMarkerPress = (attraction) => {
    setSelectedMarker(attraction);
  };

  const handleDetailsPress = (attraction) => {
    navigation.navigate('AttractionDetail', { attraction });
  };

  const renderAIRouteInfo = () => {
    if (!isAIRoute || !aiRoute) return null;

    return (
      <View style={[styles.aiRouteInfo, { backgroundColor: theme.colors.primary }]}>
        <View style={styles.aiRouteHeader}>
          <Ionicons name="sparkles" size={20} color="white" />
          <Text style={styles.aiRouteTitle}>AI Маршрут</Text>
        </View>
        <Text style={styles.aiRouteDestination}>
          К {aiRoute.destination.name}
        </Text>
        {aiRoute.route.preferences && aiRoute.route.preferences.length > 0 && (
          <View style={styles.aiPreferences}>
            {aiRoute.route.preferences.map((pref, index) => (
              <View key={index} style={styles.preferenceTag}>
                <Text style={styles.preferenceText}>
                  {getPreferenceLabel(pref)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  const getPreferenceLabel = (preference) => {
    const labels = {
      'scenic': '🌅 Живописный',
      'historical': '🏛️ Исторический',
      'cultural': '🎨 Культурный',
      'short': '⚡ Быстрый',
      'avoid_crowds': '🚶 Без толп'
    };
    return labels[preference] || preference;
  };

  const renderAttractionPanel = () => {
    if (!selectedMarker) return null;

    return (
      <View style={[styles.attractionPanel, { backgroundColor: theme.colors.cardBackground }]}>
        {isAIRoute && (
          <View style={styles.aiPanelHeader}>
            <Ionicons name="sparkles" size={16} color={theme.colors.primary} />
            <Text style={[styles.aiPanelText, { color: theme.colors.primary }]}>
              Предложено AI
            </Text>
          </View>
        )}
        
        <Text style={[styles.attractionName, { color: theme.colors.text }]}>{selectedMarker.name}</Text>
        <Text style={[styles.attractionLocation, { color: theme.colors.textSecondary }]}>
          {selectedMarker.location}
        </Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.detailsButton, { backgroundColor: theme.colors.primary, flex: 1 }]}
            onPress={() => handleDetailsPress(selectedMarker)}
          >
            <Text style={styles.detailsButtonText}>{t('common.details')}</Text>
            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Кнопка "Построить маршрут" */}
          <TouchableOpacity 
            style={[styles.routeButton, { borderColor: theme.colors.primary }]}
            onPress={() => {
              navigation.navigate('Map', { 
                aiRoute: { destination: selectedMarker },
                isAIRoute: true
              });
            }}
          >
            <Ionicons name="navigate" size={16} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>
          {isAIRoute ? 'Строим AI маршрут...' : TranslationService.translate('common.loadingMap')}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {renderAIRouteInfo()}
      
      {/* Убираем переключатель "Показать маршрут", так как маршрут показывается автоматически при выборе */}
      
      <HistoricalMap 
        attractions={attractions}
        onMarkerPress={handleMarkerPress}
        showRoute={showRoute}
        aiRoute={aiRoute}
        isAIRoute={isAIRoute}
        // Маркеры показываются только если есть достопримечательности для отображения
        showMarkers={attractions.length > 0}
      />
      
      {renderAttractionPanel()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  aiRouteInfo: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    zIndex: 1,
    borderRadius: 12,
    padding: 12,
  },
  aiRouteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  aiRouteTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  aiRouteDestination: {
    color: 'white',
    fontSize: 14,
    marginBottom: 8,
  },
  aiPreferences: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  preferenceTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  preferenceText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  routeToggle: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    padding: 8,
  },
  routeToggleText: {
    marginRight: 8,
    fontSize: 14,
  },
  attractionPanel: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 10,
  },
  aiPanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiPanelText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  detailsButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 12,
  },
  routeButton: {
    paddingHorizontal: 12,
    marginLeft: 10,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  }
}); 