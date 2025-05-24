import React, { useState, useCallback, useRef } from 'react';
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
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { AttractionCard } from '../components/AttractionCard';
import { InterestSelector } from '../components/InterestSelector';
import { Header } from '../components/Header';
import { VoiceAssistant } from '../components/VoiceAssistant';
import { ATTRACTIONS, INTERESTS } from '../constants/data';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;
const { width } = Dimensions.get('window');

export const HomeScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAttractions, setFilteredAttractions] = useState(ATTRACTIONS);
  const [selectedInterest, setSelectedInterest] = useState(null);
  const [menuAnim] = useState(new Animated.Value(-width));
  const [currentLocation, setCurrentLocation] = useState(null);
  const [aiGeneratedRoute, setAiGeneratedRoute] = useState(null);
  const searchInputRef = useRef(null);

  // Get user's current location
  React.useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const handleAIRouteGenerated = useCallback((routeData) => {
    console.log('AI Generated Route:', routeData);
    setAiGeneratedRoute(routeData);
    
    // Navigate to map with the generated route
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
    
    // Filter attractions based on search text and selected interest
    let filtered = ATTRACTIONS;
    
    if (text) {
      filtered = filtered.filter(attraction => 
        attraction.name.toLowerCase().includes(text.toLowerCase()) ||
        attraction.location.toLowerCase().includes(text.toLowerCase())
      );
    }
    
    if (selectedInterest) {
      filtered = filtered.filter(attraction => 
        attraction.categories.includes(selectedInterest.id)
      );
    }
    
    setFilteredAttractions(filtered);
  }, [selectedInterest]);

  const handleInterestSelect = useCallback((interest) => {
    if (selectedInterest && selectedInterest.id === interest.id) {
      setSelectedInterest(null);
    } else {
      setSelectedInterest(interest);
    }
    
  }, [selectedInterest]);

  React.useEffect(() => {
    let filtered = ATTRACTIONS;
    
    if (searchQuery) {
      filtered = filtered.filter(attraction => 
        attraction.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attraction.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedInterest) {
      filtered = filtered.filter(attraction => 
        attraction.categories.includes(selectedInterest.id)
      );
    }
    
    setFilteredAttractions(filtered);
  }, [selectedInterest, searchQuery]);

  const handleMenuItemPress = (screenName) => {
    toggleMenu(false);
    navigation.navigate(screenName);
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} />
      
      <Header 
        title={t('screens.home.title')} 
        onMenuPress={() => toggleMenu(true)}
        onMapPress={() => navigation.navigate('Map')}
      />
      
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.content}>
          {/* Search with AI indicator */}
          <View style={[styles.searchContainer, { backgroundColor: theme.colors.cardBackground }]}>
            <Ionicons name="search" size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
            <TextInput
              ref={searchInputRef}
              style={[styles.searchInput, { color: theme.colors.text }]}
              placeholder={t('common.search')}
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
            ) : (
              <View style={styles.aiIndicator}>
                <Ionicons name="mic-outline" size={16} color={theme.colors.primary} />
                <Text style={[styles.aiText, { color: theme.colors.primary }]}>AI</Text>
              </View>
            )}
          </View>
          
          {/* AI Route notification */}
          {aiGeneratedRoute && (
            <TouchableOpacity 
              style={[styles.aiRouteNotification, { backgroundColor: theme.colors.primary }]}
              onPress={() => navigation.navigate('Map', { aiRoute: aiGeneratedRoute })}
            >
              <Ionicons name="navigate" size={20} color="white" />
              <Text style={styles.aiRouteText}>
                AI создал маршрут к {aiGeneratedRoute.destination.name}
              </Text>
              <Ionicons name="arrow-forward" size={16} color="white" />
            </TouchableOpacity>
          )}
          
          <InterestSelector 
            interests={INTERESTS} 
            onSelect={handleInterestSelect}
            selectedInterest={selectedInterest}
          />
          
          <TouchableOpacity 
            style={[styles.routesButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => handleMenuItemPress('Routes')}
          >
            <Text style={styles.routesButtonText}>{t('menuItems.routes')}</Text>
          </TouchableOpacity>
          
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
            <Text style={[styles.noResultsText, { color: theme.colors.textSecondary }]}>
              {t('common.noResults')}
            </Text>
          )}
        </View>
      </TouchableWithoutFeedback>

      {/* Voice Assistant Floating Button */}
      <VoiceAssistant
        currentLocation={currentLocation}
        attractionsData={ATTRACTIONS}
        onRouteGenerated={handleAIRouteGenerated}
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
          <Text style={[styles.menuTitle, { color: theme.colors.text }]}>{t('common.menu')}</Text>
          <TouchableOpacity onPress={() => toggleMenu(false)}>
            <Ionicons name="close" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => handleMenuItemPress('HistoricalFacts')}
        >
          <Ionicons name="book" size={24} color={theme.colors.primary} style={styles.menuIcon} />
          <Text style={[styles.menuText, { color: theme.colors.text }]}>
            {t('menuItems.historicalFacts')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => handleMenuItemPress('RegionInfo')}
        >
          <Ionicons name="information-circle" size={24} color={theme.colors.primary} style={styles.menuIcon} />
          <Text style={[styles.menuText, { color: theme.colors.text }]}>
            {t('menuItems.regionInfo')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => handleMenuItemPress('Settings')}
        >
          <Ionicons name="settings" size={24} color={theme.colors.primary} style={styles.menuIcon} />
          <Text style={[styles.menuText, { color: theme.colors.text }]}>
            {t('menuItems.settings')}
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
        elevation: 2,
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
  aiIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  aiText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
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
  noResultsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 100, // Extra space for floating button
  },
  sideMenu: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width * 0.8,
    height: '100%',
    zIndex: 2,
    paddingTop: STATUSBAR_HEIGHT,
    paddingHorizontal: 20,
    paddingBottom: 20,
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
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
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
    marginTop: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  routesButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  routesButtonImage: {
    width: 24,
    height: 24,
  },
}); 