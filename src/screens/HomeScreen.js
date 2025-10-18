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
  ScrollView,
  Vibration,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { AttractionCard } from '../components/AttractionCard';
import { InterestSelector } from '../components/InterestSelector';
import { RouteSelector } from '../components/RouteSelector';
import { Header } from '../components/Header';
import { VoiceAssistant } from '../components/VoiceAssistant';
import { getSmartFilteredAttractions, findNearestRegion, getUserLocation } from '../utils/geoUtils';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useRegion } from '../context/RegionContext';
import TranslationService from '../services/TranslationService';
import * as ApiService from '../services/ApiService'; // Import the new service

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;
const { width, height } = Dimensions.get('window');

export const HomeScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { selectedRegionId, setSelectedRegionId } = useRegion();
  const t = (key, params) => TranslationService.translate(key, params);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInterest, setSelectedInterest] = useState(null);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const menuAnim = useRef(new Animated.Value(-width)).current;
  const searchInputRef = useRef(null);
  const [currentRegion, setCurrentRegion] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [showLocationNotification, setShowLocationNotification] = useState(false);
  const [regionLoading, setRegionLoading] = useState(false);
  const [searchPlaceholder, setSearchPlaceholder] = useState('');
  const [routesButtonText, setRoutesButtonText] = useState('');
  const [regionLoadingText, setRegionLoadingText] = useState('');
  const [noResultsText, setNoResultsText] = useState('');
  const [showAllText, setShowAllText] = useState('');
  const [menuItems, setMenuItems] = useState({});
  
  // New states for data fetching
  const [regions, setRegions] = useState([]);
  const [attractions, setAttractions] = useState([]);
  const [interests, setInterests] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleAIRouteGenerated = useCallback((routeData) => {
    console.log('AI Generated Route:', routeData);
    navigation.navigate('Map', {
      aiRoute: routeData,
      destination: routeData.destination
    });
  }, [navigation]);

  const initialize = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const location = await getUserLocation();
      const fetchedRegions = await ApiService.getRegions();
      setRegions(fetchedRegions);
      
      const initialRegionId = selectedRegionId || (location ? findNearestRegion(location, fetchedRegions)?.id : fetchedRegions[0]?.id) || 'pavlodar';
      if (initialRegionId !== selectedRegionId) {
        setSelectedRegionId(initialRegionId);
      }
      
      await fetchDataForRegion(initialRegionId);
      
      const fetchedInterests = await ApiService.getInterests();
      setInterests(fetchedInterests);

    } catch (e) {
      console.error("Initialization failed:", e);
      setError(t('errors.initializationFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    // Refetch data when region changes
    if (selectedRegionId) {
      fetchDataForRegion(selectedRegionId);
    }
  }, [selectedRegionId]);
  
  const fetchDataForRegion = async (regionId) => {
    try {
      setIsLoading(true);
      setError(null);
      const attractionsPromise = ApiService.getAttractions(regionId);
      const routesPromise = ApiService.getRoutes(regionId);
      const [fetchedAttractions, fetchedRoutes] = await Promise.all([attractionsPromise, routesPromise]);
      setAttractions(fetchedAttractions);
      setRoutes(fetchedRoutes);
    } catch (e) {
      console.error(`Failed to fetch data for region ${regionId}:`, e);
      setError(t('errors.fetchDataFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAttractions = attractions.filter(attraction => {
    const name = t(attraction.name).toLowerCase();
    const description = t(attraction.description).toLowerCase();
    const query = searchQuery.toLowerCase();
    const interestMatch = selectedInterest ? attraction.categories?.includes(selectedInterest.id) : true;

    return (name.includes(query) || description.includes(query)) && interestMatch;
  });

  // Simplified renderAttractionItem to use AttractionCard directly
  const renderAttractionItem = ({ item }) => (
    <AttractionCard item={item} />
  );

  // Simplified open/close menu functions
  const openMenu = () => {
    Animated.timing(menuAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
    setMenuOpen(true);
  };
  const closeMenu = () => {
    Animated.timing(menuAnim, { toValue: -width, duration: 300, useNativeDriver: true }).start();
    setMenuOpen(false);
  };
  
  const renderError = () => (
    <View style={styles.errorContainer}>
      <Ionicons name="alert-circle-outline" size={64} color={theme.colors.error || '#E53935'} />
      <Text style={[styles.errorTitle, { color: theme.colors.text }]}>
        {t('errors.errorTitle')}
      </Text>
      <Text style={[styles.errorMessage, { color: theme.colors.textSecondary }]}>
        {error}
      </Text>
      <TouchableOpacity 
        style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
        onPress={initialize}
      >
        <Ionicons name="refresh" size={20} color="#FFFFFF" />
        <Text style={styles.retryButtonText}>{t('common.retry')}</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading && !attractions.length) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }
  
  if (error) {
     return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Header 
          title={t('screens.home.title')}
          onMenuPress={openMenu}
          onMapPress={() => {}}
        />
        {renderError()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} />
      
      <Header 
        title={t('screens.home.title')}
        onMenuPress={openMenu}
        onMapPress={() => navigation.navigate('Map', { selectedAttractions: filteredAttractions.map(a => a.id) })}
      />
      
      {showLocationNotification && (
        <View style={[styles.notification, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.notificationText}>
            {t('screens.home.determiningLocation')}
          </Text>
        </View>
      )}

      {/* Глобальная ошибка загрузки начальных данных */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
            Загрузка данных...
          </Text>
        </View>
      )}
      
      {error && !isLoading && renderError()}

      {!isLoading && !error && (
        <FlatList
          data={filteredAttractions}
          renderItem={renderAttractionItem}
          keyExtractor={item => item.id}
          ListHeaderComponent={
            <>
              <View style={styles.searchSection}>
            <View style={[styles.searchContainer, { backgroundColor: theme.colors.cardBackground }]}>
                  <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
              <TextInput
                style={[styles.searchInput, { color: theme.colors.text }]}
                    placeholder={t('common.searchPlaceholder')}
                placeholderTextColor={theme.colors.textSecondary}
                value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>
            </View>
            
            {/* Селектор регионов */}
            <View style={styles.regionSelectorContainer}>
              <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>{t('screens.home.selectRegion')}</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.regionScroll}
                contentContainerStyle={styles.regionScrollContent}
              >
                  {regions.map((region) => (
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
                      onPress={() => setSelectedRegionId(region.id)}
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
            
              {/* Селектор интересов с заголовком */}
              <View style={styles.interestSelectorContainer}>
                <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>{t('screens.home.interests')}</Text>
            <InterestSelector 
                  interests={interests} 
                  onSelect={setSelectedInterest}
              selectedInterest={selectedInterest}
            />
              </View>
            
              {/* Готовые маршруты с заголовком */}
              <View style={styles.routeSelectorContainer}>
                <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>{t('screens.home.routes')}</Text>
                <RouteSelector 
                  routes={routes}
                  navigation={navigation}
                />
              </View>

              <View style={styles.attractionsTitleContainer}>
                <Ionicons name="location" size={24} color={theme.colors.primary} />
                <Text style={[styles.listHeader, { color: theme.colors.text }]}>
                  {t('screens.home.attractionsTitle')}
                </Text>
              </View>
            </>
          }
          ListEmptyComponent={
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
                        }}
                      >
                        <Text style={[styles.showAllButtonText, { color: theme.colors.primary }]}>
                          {showAllText || t('screens.home.showAllInRegion', { regionName: currentRegion.name })}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
          }
        />
            )}
      <VoiceAssistant
          onRouteGenerated={handleAIRouteGenerated}
          navigation={navigation}
        />
      
      {/* Menu Overlay */}
      {isMenuOpen && (
        <TouchableWithoutFeedback onPress={closeMenu}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      {/* Animated Menu */}
      <Animated.View style={[styles.menuContainer, { transform: [{ translateX: menuAnim }], backgroundColor: theme.colors.background }]}>
        {/* Menu content goes here */}
        <DrawerContent navigation={navigation} />
      </Animated.View>
      
    </SafeAreaView>
  );
};

const DrawerContent = ({ navigation }) => {
  const { theme } = useTheme();
  const t = (key) => TranslationService.translate(key);
  const { selectedRegionId } = useRegion();

  const menuItems = [
    { 
      key: 'routes', 
      title: t('drawer.routes'), 
      icon: 'map-outline', 
      screen: 'Routes', 
      params: { regionId: selectedRegionId } 
    },
    { 
      key: 'history', 
      title: t('drawer.history'), 
      icon: 'book-outline', 
      screen: 'HistoricalFacts', 
      params: { regionId: selectedRegionId } 
    },
    { 
      key: 'regionInfo', 
      title: t('drawer.regionInfo'), 
      icon: 'information-circle-outline', 
      screen: 'RegionInfo', 
      params: { regionId: selectedRegionId } 
    },
    { 
      key: 'settings', 
      title: t('menuItems.settings'), 
      icon: 'settings-outline', 
      screen: 'Settings', 
      params: {} 
    },
  ];

  return (
    <View style={[styles.drawerContent, { backgroundColor: theme.colors.cardBackground }]}>
      <View style={styles.drawerHeader}>
        <Ionicons name="compass-outline" size={32} color={theme.colors.primary} />
        <Text style={[styles.drawerTitle, { color: theme.colors.text }]}>TourGid</Text>
      </View>
      {menuItems.map(item => (
        <TouchableOpacity 
          key={item.key}
          style={styles.drawerItem} 
          onPress={() => navigation.navigate(item.screen, item.params)}
        >
          <Ionicons name={item.icon} size={24} color={theme.colors.textSecondary} />
          <Text style={[styles.drawerItemText, { color: theme.colors.text }]}>{item.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? STATUSBAR_HEIGHT : 0,
  },
  scrollView: {
    flex: 1,
  },
  notification: {
    position: 'absolute',
    top: Platform.OS === 'android' ? STATUSBAR_HEIGHT + 10 : 50,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 10,
    zIndex: 2000,
    elevation: 5,
  },
  notificationText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  content: {
    padding: 15,
    paddingBottom: 100,
  },
  attractionsContainer: {
    marginTop: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 24,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
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
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  interestSelectorContainer: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  routeSelectorContainer: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  attractionsTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
    marginTop: 8,
    gap: 8,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  regionScroll: {
    marginHorizontal: -5,
  },
  regionScrollContent: {
    paddingHorizontal: 5,
  },
  regionButton: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 20,
    marginHorizontal: 6,
    borderWidth: 2,
    minWidth: 120,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  regionButtonText: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 3,
  },
  regionButtonCount: {
    fontSize: 12,
    opacity: 0.8,
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
  menuItemText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 100,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  errorBannerText: {
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
  },
  searchSection: {
    padding: 16,
  },
  listHeader: {
    fontSize: 22,
    fontWeight: '700',
    marginLeft: 0,
    letterSpacing: 0.3,
  },
  emptyContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1,
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: width * 0.75,
    zIndex: 2,
    paddingTop: 60, // Adjust as needed for status bar
    paddingHorizontal: 20,
  },
  drawerContent: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
  },
  drawerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  drawerItemText: {
    fontSize: 18,
    marginLeft: 15,
    fontWeight: '500',
  },
  safeArea: {
    flex: 1,
  },
}); 