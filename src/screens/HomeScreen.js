import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  View, 
  TextInput, 
  FlatList, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity,
  Platform,
  StatusBar,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
  Keyboard,
  Alert,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { AttractionCard } from '../components/AttractionCard';
import { InterestSelector } from '../components/InterestSelector';
import { RouteSelector } from '../components/RouteSelector';
import { Header } from '../components/Header';
import { VoiceAssistant } from '../components/VoiceAssistant';
import { ATTRACTIONS, INTERESTS, REGIONS } from '../constants/data';
import { getSmartFilteredAttractions, findNearestRegion, getUserLocation, filterAttractionsByRegion } from '../utils/geoUtils';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import TranslationService from '../services/TranslationService';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;
const { width, height } = Dimensions.get('window');

export const HomeScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const t = (key, params) => TranslationService.translate(key, params);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [attractions, setAttractions] = useState([]);
  const [filteredAttractions, setFilteredAttractions] = useState([]);
  const [selectedInterest, setSelectedInterest] = useState(null);
  const [selectedRegionId, setSelectedRegionId] = useState('pavlodar'); // Default region
  const [translatedAttractionsCache, setTranslatedAttractionsCache] = useState({});
  const [currentLanguage, setCurrentLanguage] = useState(language);
  const [menuAnim] = useState(new Animated.Value(-width));
  const [aiGeneratedRoute, setAiGeneratedRoute] = useState(null);
  const searchInputRef = useRef(null);
  const [currentRegion, setCurrentRegion] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [regionLoading, setRegionLoading] = useState(false);
  const [searchPlaceholder, setSearchPlaceholder] = useState('');
  const [routesButtonText, setRoutesButtonText] = useState('');
  const [regionLoadingText, setRegionLoadingText] = useState('');
  const [noResultsText, setNoResultsText] = useState('');
  const [showAllText, setShowAllText] = useState('');
  const [menuItems, setMenuItems] = useState({});

  const handleAIRouteGenerated = useCallback((routeData) => {
    console.log('AI Generated Route:', routeData);
    setAiGeneratedRoute(routeData);
    navigation.navigate('Map', {
      aiRoute: routeData,
      destination: routeData.destination
    });
  }, [navigation]);

  const toggleMenu = useCallback((show) => {
    Animated.timing(menuAnim, {
      toValue: show ? 0 : -width,
      duration: 300,
      useNativeDriver: true
    }).start();
  }, [menuAnim]);

  const handleSearch = useCallback((text) => {
    setSearchQuery(text);
    
    let filtered = attractions;
    
    if (text) {
      filtered = filtered.filter(attraction => 
        attraction.name.toLowerCase().includes(text.toLowerCase()) ||
        attraction.location.toLowerCase().includes(text.toLowerCase()) ||
        attraction.description.toLowerCase().includes(text.toLowerCase())
      );
    }
    
    if (selectedInterest) {
      filtered = filtered.filter(attraction => 
        attraction.categories.includes(selectedInterest.id)
      );
    }
    
    setFilteredAttractions(filtered);
  }, [selectedInterest, attractions]);

  const handleInterestSelect = useCallback((interest) => {
    if (selectedInterest && selectedInterest.id === interest.id) {
      setSelectedInterest(null);
    } else {
      setSelectedInterest(interest);
    }
  }, [selectedInterest]);

  const handleRegionSelect = useCallback((regionId) => {
    setRegionLoading(true);
    setSelectedRegionId(regionId);
    setSearchQuery('');
    setSelectedInterest(null);
    // Небольшая задержка для синхронизации отображения
    setTimeout(() => {
      setRegionLoading(false);
    }, 100);
  }, []);
  React.useEffect(() => {
    let baseAttractions = attractions;
    
    let filtered = baseAttractions;
    
    if (searchQuery) {
      filtered = filtered.filter(attraction => 
        attraction.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attraction.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attraction.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedInterest) {
      filtered = filtered.filter(attraction => 
        attraction.categories.includes(selectedInterest.id)
      );
    }
    
    setFilteredAttractions(filtered);
  }, [selectedInterest, searchQuery, attractions]);

  useEffect(() => {
    const initializeApp = async () => {
      setLocationLoading(true);
      const locationData = await getUserLocation();
      
      if (locationData) {
        setUserLocation(locationData.userLocation);
        if (locationData.nearestRegion) {
          setCurrentRegion(locationData.nearestRegion);
          const regionAttractions = filterAttractionsByRegion(attractions, locationData.nearestRegion.id);
          setFilteredAttractions(regionAttractions);
        }
      }
      setLocationLoading(false);
    };
    
    if (attractions.length > 0) {
      initializeApp();
    }
  }, [attractions]);

  // Переводы только при смене языка
  useEffect(() => {
    if (language !== currentLanguage || !translatedAttractionsCache[language]) {
      const translated = ATTRACTIONS.map(attraction => ({
        ...attraction,
        name: t(attraction.name),
        description: t(attraction.description)
      }));
      setTranslatedAttractionsCache(prev => ({ ...prev, [language]: translated }));
      setCurrentLanguage(language);
    }
  }, [language]);

  // Фильтрация по региону - без перевода
  useEffect(() => {
    const cachedTranslated = translatedAttractionsCache[language];
    if (cachedTranslated) {
      const regionAttractions = cachedTranslated.filter(a => a.regionId === selectedRegionId);
      setAttractions(regionAttractions);
      setFilteredAttractions(regionAttractions);
    }
  }, [selectedRegionId, translatedAttractionsCache, language]);
  useEffect(() => {
    const loadTranslations = async () => {
      const translations = {
        searchPlaceholder: await t('screens.home.searchPlaceholder'),
        noResultsText: await t('screens.home.noAttractionsFound'),
        showAllText: await t('screens.home.showAllInRegion'),
        menu: await t('common.menu'),
        historicalFacts: await t('screens.historicalFacts.menuItem'),
        regionInfo: await t('screens.regionInfo.menuItem'),
        settings: await t('screens.settings.title'),
        routes: await t('screens.routes.title') 
      };
      setSearchPlaceholder(translations.searchPlaceholder);
      setNoResultsText(translations.noResultsText);
      setShowAllText(translations.showAllText);
      setMenuItems(translations);
    };
    loadTranslations();
  }, [language]);

  const handleMenuItemPress = (screenName, params = {}) => {
    toggleMenu(false);
    navigation.navigate(screenName, params);
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} />
      
      <Header 
        title="TourGid Казахстан" 
        onMenuPress={() => toggleMenu(true)}
        onMapPress={() => navigation.navigate('Map')}
      />
      
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.content}>
          <View style={[styles.searchContainer, { backgroundColor: theme.colors.cardBackground }]}>
            <Ionicons name="search" size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
            <TextInput
              ref={searchInputRef}
              style={[styles.searchInput, { color: theme.colors.text }]}
              placeholder={searchPlaceholder || t('screens.home.searchPlaceholder')}
              placeholderTextColor={theme.colors.textSecondary}
              value={searchQuery}
              onChangeText={handleSearch}
            />
            {searchQuery ? (
              <TouchableOpacity 
                style={styles.clearButton}
                onPress={() => {
                  setSearchQuery('');
                  handleSearch('');
                }}
              >
                <Ionicons name="close-circle" size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            ) : null}
          </View>
          {aiGeneratedRoute && (
            <TouchableOpacity 
              style={[styles.aiRouteNotification, { backgroundColor: theme.colors.primary }]}
              onPress={() => navigation.navigate('Map', { aiRoute: aiGeneratedRoute })}
            >
              <Ionicons name="navigate" size={20} color="white" />
              <Text style={styles.aiRouteText}>
               {aiGeneratedRoute.destination.name}
              </Text>
              <Ionicons name="arrow-forward" size={16} color="white" />
            </TouchableOpacity>
          )}
          
          {/* Селектор регионов */}
          <View style={styles.regionSelectorContainer}>
            <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>Регионы:</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.regionScroll}
            >
              {REGIONS.map((region) => (
                <TouchableOpacity
                  key={region.id}
                  style={[
                    styles.regionButton,
                    { 
                      backgroundColor: selectedRegionId === region.id 
                        ? theme.colors.primary 
                        : theme.colors.cardBackground,
                      borderColor: theme.colors.border
                    }
                  ]}
                  onPress={() => handleRegionSelect(region.id)}
                >
                  <Text 
                    style={[
                      styles.regionButtonText,
                      { 
                        color: selectedRegionId === region.id 
                          ? '#FFFFFF' 
                          : theme.colors.text 
                      }
                    ]}
                  >
                    {region.mainCity}
                  </Text>
                  <Text 
                    style={[
                      styles.regionButtonCount,
                      { 
                        color: selectedRegionId === region.id 
                          ? '#FFFFFF' 
                          : theme.colors.textSecondary 
                      }
                    ]}
                  >
                    {region.attractions_count} мест
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          
          <InterestSelector 
            interests={INTERESTS} 
            onSelect={handleInterestSelect}
            selectedInterest={selectedInterest}
          />
          
          {regionLoading ? (
            <View style={styles.locationLoading}>
              <Text style={[styles.locationLoadingText, { color: theme.colors.textSecondary }]}>
                Загрузка...
              </Text>
            </View>
          ) : (
            <>
              <RouteSelector navigation={navigation} regionId={selectedRegionId} />
              
              {locationLoading && (
                <View style={styles.locationLoading}>
                  <Text style={[styles.locationLoadingText, { color: theme.colors.textSecondary }]}>
                    {t('screens.home.determiningLocation')}
                  </Text>
                </View>
              )}
              
              {filteredAttractions.length > 0 ? (
                <FlatList
                  data={filteredAttractions}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <AttractionCard item={item} interests={INTERESTS} />
                  )}
                  contentContainerStyle={styles.listContent}
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                <View style={styles.noResultsContainer}>
                  <Text style={[styles.noResultsText, { color: theme.colors.textSecondary }]}>
                    {noResultsText || (searchQuery ? `Ничего не найдено по запросу "${searchQuery}"` : t('screens.home.noAttractionsFound'))}
                  </Text>
                  {currentRegion && (
                    <TouchableOpacity 
                      style={styles.showAllButton}
                      onPress={() => {
                        setSearchQuery('');
                        setSelectedInterest(null);
                        setFilteredAttractions(ATTRACTIONS.filter(a => a.regionId === currentRegion.id));
                      }}
                    >
                      <Text style={[styles.showAllButtonText, { color: theme.colors.primary }]}>
                        {showAllText || t('screens.home.showAllInRegion', { regionName: currentRegion.name })}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </>
          )}
        </View>
      </TouchableWithoutFeedback>
      <VoiceAssistant
        currentLocation={userLocation}
        attractionsData={attractions}
        onRouteGenerated={handleAIRouteGenerated}
        navigation={navigation}
      />
      
      <Animated.View 
        style={[
          styles.sideMenu,
          { 
            transform: [{ translateX: menuAnim }],
            backgroundColor: theme.colors.cardBackground
          }
        ]}
      >
        <View style={styles.menuHeader}>
          <Text style={[styles.menuTitle, { color: theme.colors.text }]}>{menuItems.menu || '...'}</Text>
          <TouchableOpacity onPress={() => toggleMenu(false)}>
            <Ionicons name="close" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => handleMenuItemPress('Routes', { regionId: selectedRegionId })}
        >
          <Ionicons name="map" size={24} color={theme.colors.primary} style={styles.menuIcon} />
          <Text style={[styles.menuText, { color: theme.colors.text }]}>
            {menuItems.routes || '...'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => handleMenuItemPress('HistoricalFacts', { regionId: selectedRegionId })}
        >
          <Ionicons name="book" size={24} color={theme.colors.primary} style={styles.menuIcon} />
          <Text style={[styles.menuText, { color: theme.colors.text }]}>
            {menuItems.historicalFacts || '...'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => handleMenuItemPress('RegionInfo', { regionId: selectedRegionId })}
        >
          <Ionicons name="information-circle" size={24} color={theme.colors.primary} style={styles.menuIcon} />
          <Text style={[styles.menuText, { color: theme.colors.text }]}>
            {menuItems.regionInfo || '...'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => handleMenuItemPress('Settings')}
        >
          <Ionicons name="settings" size={24} color={theme.colors.primary} style={styles.menuIcon} />
          <Text style={[styles.menuText, { color: theme.colors.text }]}>
            {menuItems.settings || '...'}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? STATUSBAR_HEIGHT : 0,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
      },
    }),
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  clearButton: {
    padding: 5,
  },
  aiRouteNotification: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  aiRouteText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    marginHorizontal: 10,
  },
  noResultsContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  noResultsText: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 15,
  },
  showAllButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  showAllButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 100, // Extra space for floating button
  },
  regionSelectorContainer: {
    marginBottom: 15,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  regionScroll: {
    marginHorizontal: -5,
  },
  regionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 5,
    borderWidth: 1,
    minWidth: 100,
    alignItems: 'center',
  },
  regionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  regionButtonCount: {
    fontSize: 11,
  },
  sideMenu: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width * 0.75,
    height: height,
    zIndex: 2000,
    paddingTop: Platform.OS === 'ios' ? 50 : STATUSBAR_HEIGHT + 10,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: 20,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  menuIcon: {
    marginRight: 15,
  },
  menuText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  routesButton: {
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  routesButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  routesButtonSubtext: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.9,
    marginTop: 2,
  },
  regionIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  regionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
    flex: 1,
  },
  locationLoading: {
    padding: 10,
    alignItems: 'center',
  },
  locationLoadingText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
}); 