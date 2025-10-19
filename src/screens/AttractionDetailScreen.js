import React, { useState, useEffect } from 'react';
import { 
  ScrollView, 
  View, 
  Text, 
  StyleSheet,
  TouchableOpacity,
  Linking,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import TranslationService from '../services/TranslationService';
import * as ApiService from '../services/ApiService';
import PlacesService from '../services/PlacesService';
import { mapImage } from '../utils/imageMapper';
import ReviewCard from '../components/ReviewCard';

const { width } = Dimensions.get('window');

const API_BASE_URL = __DEV__ ? 'http://localhost:3000/api' : 'https://tourgid-backend-gu5s.onrender.com/api';

export const AttractionDetailScreen = ({ route, navigation }) => {
  const { attraction, translatedName, translatedDescription } = route.params;
  const { theme } = useTheme();
  const t = (key, params) => TranslationService.translate(key, params);

  const [placeDetails, setPlaceDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [headerImageUri, setHeaderImageUri] = useState(null);
  
  const displayName = translatedName || t(attraction.name);
  const displayDescription = translatedDescription || t(attraction.description);

  useEffect(() => {
    navigation.setOptions({ title: displayName });

    const loadHeaderImage = async () => {
      // ПРИОРИТЕТ 1: photoUrl из БД
      if (attraction.photoUrl) {
        setHeaderImageUri(attraction.photoUrl);
        setLoadingDetails(false);
        console.log('📸 Using photoUrl from database');
        return;
      }

      // ПРИОРИТЕТ 2: Локальное изображение
      if (attraction.image) {
        const localImage = mapImage(attraction.image);
        if (localImage) {
          setHeaderImageUri(localImage);
          setLoadingDetails(false);
          console.log('📸 Using local image');
          return;
        }
      }

      // ПРИОРИТЕТ 3: Google Places API
      if (!attraction.coordinates) {
        setLoadingDetails(false);
        return;
      }
      
      try {
        const searchName = t(attraction.name);
        console.log('🔍 Searching for place:', searchName);
        const places = await PlacesService.searchPlaces(searchName, attraction.coordinates, 1000);
        
        if (places && places.length > 0 && places[0].place_id) {
          console.log('✅ Found place_id:', places[0].place_id);
          const details = await ApiService.getPlaceDetails(places[0].place_id);
          console.log('✅ Got place details with reviews:', details?.reviews?.length || 0);
          setPlaceDetails(details);
          
          if (details && details.photos && details.photos.length > 0) {
            const photoUrl = `${API_BASE_URL}/place-photo?photo_reference=${details.photos[0].photo_reference}`;
            setHeaderImageUri(photoUrl);
            console.log('📸 Header photo loaded from Google Places API');
          }
        } else {
          console.log('⚠️ No places found for:', searchName);
        }
      } catch (error) {
        console.error("Failed to fetch place details:", error);
      } finally {
        setLoadingDetails(false);
      }
    };

    loadHeaderImage();
  }, [attraction, navigation, translatedName]);
  
  const callPhone = (phone) => phone && Linking.openURL(`tel:${phone}`);
  const openWebsite = (website) => website && Linking.openURL(website);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {headerImageUri && (
        <Image 
          source={headerImageUri}
          placeholder={attraction.image ? mapImage(attraction.image) : null}
          contentFit="cover"
          transition={500}
          style={styles.headerImage}
        />
      )}
      
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {displayName}
        </Text>

        <TouchableOpacity 
          style={styles.locationRow}
          onPress={() => navigation.navigate('Map', { selectedAttractions: [attraction.id] })}
        >
          <Ionicons name="location-outline" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.location, { color: theme.colors.textSecondary }]}>
            {attraction.location}
          </Text>
        </TouchableOpacity>

        <InfoSection title={t('attractionDetail.descriptionTitle')}>
          <Text style={[styles.sectionText, { color: theme.colors.textSecondary }]}>
            {displayDescription}
          </Text>
        </InfoSection>

        {attraction.historicalInfo && (
          <InfoSection title={t('attractionDetail.historicalInfo')}>
            <Text style={[styles.sectionText, { color: theme.colors.textSecondary }]}>
              {t(attraction.historicalInfo)}
            </Text>
          </InfoSection>
        )}

        {loadingDetails ? (
            <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginVertical: 20 }} />
        ) : (
          placeDetails && (
            <>
              {placeDetails.photos && placeDetails.photos.length > 0 && (
                <InfoSection title={t('common.photos')}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {placeDetails.photos.slice(0, 5).map((photo, index) => (
                      <Image
                        key={index}
                        source={`${API_BASE_URL}/place-photo?photo_reference=${photo.photo_reference}`}
                        contentFit="cover"
                        transition={300}
                        style={styles.placeImage}
                      />
                    ))}
                  </ScrollView>
                </InfoSection>
              )}

              {placeDetails.reviews && placeDetails.reviews.length > 0 && (
                <InfoSection title={t('common.reviewsTitle')}>
                  {placeDetails.reviews.slice(0, 5).map((review, index) => (
                    <ReviewCard key={review.time || index} review={review} />
                  ))}
                </InfoSection>
              )}
            </>
          )
        )}
        
        {attraction.workingHours && (
            <InfoSection title={t('attractionDetail.workingHours')}>
                <WorkingHoursRow label={t('attractionDetail.weekdays')} value={attraction.workingHours.weekdays} theme={theme} />
                <WorkingHoursRow label={t('attractionDetail.weekend')} value={attraction.workingHours.weekend} theme={theme} />
                {attraction.workingHours.dayOff && <WorkingHoursRow label={t('attractionDetail.dayOff')} value={attraction.workingHours.dayOff} theme={theme} />}
            </InfoSection>
        )}
        
        {attraction.tips && attraction.tips.length > 0 && (
          <InfoSection title={t('attractionDetail.tips')}>
            {attraction.tips.map((tip, index) => (
              <TipItem key={index} tip={t(tip)} theme={theme} />
            ))}
          </InfoSection>
        )}
        
        {attraction.contacts && (
          <InfoSection title={t('attractionDetail.contacts')}>
            {attraction.contacts.phone && <ContactItem icon="call-outline" text={attraction.contacts.phone} onPress={() => callPhone(attraction.contacts.phone)} theme={theme} />}
            {placeDetails?.website && <ContactItem icon="globe-outline" text={placeDetails.website} onPress={() => openWebsite(placeDetails.website)} theme={theme} />}
          </InfoSection>
        )}

      </View>
      <View style={[styles.footer, {backgroundColor: theme.colors.background}]}>
        <TouchableOpacity 
          style={[styles.mapButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.navigate('Map', { selectedAttractions: [attraction.id] })}
        >
          <Ionicons name="map-outline" size={20} color="#FFFFFF" />
          <Text style={styles.mapButtonText}>{t('common.showOnMap')}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.routeButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.navigate('Map', { routeFromUserTo: attraction })}
        >
          <Ionicons name="navigate-outline" size={24} color="white" />
          <Text style={styles.routeButtonText}>{t('attractionDetail.buildRoute')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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

const WorkingHoursRow = ({ label, value, theme }) => (
    <View style={styles.workingHoursRow}>
        <Text style={[styles.workingHoursLabel, { color: theme.colors.text }]}>{label}</Text>
        <Text style={[styles.workingHoursValue, { color: theme.colors.textSecondary }]}>{value}</Text>
    </View>
);

const TipItem = ({ tip, theme }) => (
    <View style={styles.tipItem}>
        <Ionicons name="bulb-outline" size={20} color={theme.colors.primary} style={styles.tipIcon} />
        <Text style={[styles.tipText, { color: theme.colors.textSecondary }]}>{tip}</Text>
    </View>
);

const ContactItem = ({ icon, text, onPress, theme }) => (
    <TouchableOpacity style={styles.contactItem} onPress={onPress} disabled={!onPress}>
        <Ionicons name={icon} size={20} color={theme.colors.primary} />
        <Text style={[styles.contactText, { color: theme.colors.primary, textDecorationLine: onPress ? 'underline' : 'none' }]}>{text}</Text>
    </TouchableOpacity>
);


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerImage: {
    width: width,
    height: 280,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  location: {
    marginLeft: 6,
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  placeImage: {
    width: 160,
    height: 120,
    borderRadius: 12,
    marginRight: 10,
  },
  workingHoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  workingHoursLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  workingHoursValue: {
    fontSize: 16,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tipIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  contactText: {
    marginLeft: 12,
    fontSize: 16,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
    gap: 12,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 15,
  },
  mapButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  routeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  routeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
}); 