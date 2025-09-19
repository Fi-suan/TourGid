import React, { useState, useEffect } from 'react';
import { 
  ScrollView, 
  View, 
  Text, 
  Image, 
  StyleSheet,
  TouchableOpacity,
  Linking,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import TranslationService from '../services/TranslationService';
import GoogleAPIService from '../services/GoogleAPIService';
import { useLanguage } from '../context/LanguageContext';
import { getUserLocation, getRouteToAttraction } from '../utils/geoUtils';

const { width } = Dimensions.get('window');

// Компонент для отображения текста, который может загружаться асинхронно
const TranslatedText = ({ textKey, style, params = {} }) => {
  const { language } = useLanguage();
  const [text, setText] = useState(textKey);

  useEffect(() => {
    let isMounted = true;
    const translate = async () => {
      const translationResult = TranslationService.translate(textKey, params);
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
  }, [textKey, language, params]);

  return <Text style={style}>{text}</Text>;
};

export const AttractionDetailScreen = ({ route, navigation }) => {
  const { attraction } = route.params;
  const { theme } = useTheme();
  const t = (key, params) => TranslationService.translate(key, params);

  const [placeDetails, setPlaceDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const init = async () => {
      const location = await getUserLocation();
      if (location) {
        setUserLocation(location.userLocation);
      }
    };
    init();
  }, []);

  useEffect(() => {
    const updateTitle = async () => {
      const translatedTitle = await TranslationService.translate(attraction.name);
      navigation.setOptions({ title: translatedTitle });
    };
    updateTitle();

    const fetchPlaceDetails = async () => {
      if (!attraction.coordinates) return;
      
      setLoadingDetails(true);
      try {
        const places = await GoogleAPIService.findPlaceFromText(`${t(attraction.name)}, ${attraction.location}`);
        
        if (places && places.length > 0) {
          const details = await GoogleAPIService.getPlaceDetails(places[0].place_id);
          setPlaceDetails(details);
        }
      } catch (error) {
        console.error("Failed to fetch place details:", error);
      }
      setLoadingDetails(false);
    };

    fetchPlaceDetails();
  }, [attraction, navigation]);
  
  const handleGetDirections = async () => {
    if (!userLocation) {
      alert('Не удалось получить ваше местоположение.');
      return;
    }

    const routeData = await getRouteToAttraction(userLocation, attraction);
    if (routeData && routeData.success) {
      navigation.navigate('Map', { aiRoute: routeData, destination: attraction });
    } else {
      alert('Не удалось построить маршрут.');
    }
  };

  const callPhone = (phone) => {
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    }
  };

  const openWebsite = (website) => {
    if (website) {
      Linking.openURL(`https://${website}`);
    }
  };

  const openEmail = (email) => {
    if (email) {
      Linking.openURL(`mailto:${email}`);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={i} name="star" size={16} color="#FFD700" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={16} color="#FFD700" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons key={`empty-${i}`} name="star-outline" size={16} color="#FFD700" />
      );
    }

    return stars;
  };

  const renderInfoRow = (icon, labelKey, value) => (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={16} color={theme.colors.primary} />
      <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
        {t(labelKey)}: {value}
      </Text>
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Image source={attraction.image} style={styles.headerImage} />
      
      <View style={styles.content}>
        <TranslatedText textKey={attraction.name} style={[styles.title, { color: theme.colors.text }]} />

        <TouchableOpacity 
          style={styles.locationRow}
          onPress={() => navigation.navigate('Map', { selectedAttractions: [attraction.id] })}
        >
          <Ionicons name="location" size={16} color={theme.colors.primary} />
          <Text style={[styles.location, { color: theme.colors.textSecondary }]}>
            {attraction.location}
          </Text>
        </TouchableOpacity>

        {/* --- СЕКЦИЯ С ОПИСАНИЕМ --- */}
        <View style={[styles.descriptionCard, { backgroundColor: theme.colors.cardBackground }]}>
          <TranslatedText textKey={attraction.description} style={[styles.description, { color: theme.colors.text }]} />
        </View>

        {/* --- ОБЪЕДИНЕННАЯ СЕКЦИЯ РЕЙТИНГА И ИНФОРМАЦИИ --- */}
        <View style={[styles.infoCard, { backgroundColor: theme.colors.cardBackground }]}>
          {/* Рейтинг из Google Places API, если есть, иначе локальный */}
          {placeDetails?.rating ? (
            <View style={styles.ratingRow}>
              <View style={styles.ratingContainer}>
                <Text style={[styles.ratingText, { color: theme.colors.text, fontSize: 18, marginRight: 8 }]}>{placeDetails.rating.toFixed(1)}</Text>
                <View style={styles.starsContainer}>
                  {renderStars(placeDetails.rating)}
                </View>
              </View>
              {placeDetails.user_ratings_total && (
                <Text style={{ color: theme.colors.textSecondary }}>
                  ({placeDetails.user_ratings_total} {t('common.reviews')})
                </Text>
              )}
            </View>
          ) : attraction.rating ? (
            <View style={styles.ratingRow}>
               <View style={styles.ratingContainer}>
                <Text style={[styles.ratingText, { color: theme.colors.text, marginRight: 8 }]}>{attraction.rating}/5</Text>
                <View style={styles.starsContainer}>
                  {renderStars(attraction.rating)}
                </View>
              </View>
            </View>
          ) : null}
          
          {attraction.visitDuration && (
            <View style={[styles.durationContainer, { marginTop: placeDetails?.rating || attraction.rating ? 10 : 0 }]}>
              <Ionicons name="time-outline" size={20} color={theme.colors.primary} />
              <Text style={[styles.durationText, { color: theme.colors.textSecondary }]}>
                {attraction.visitDuration}
              </Text>
            </View>
          )}
        </View>

        {/* --- Секция Google Places API (Фото и Отзывы) --- */}
        {loadingDetails && <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginVertical: 20 }} />}
        
        {placeDetails && (
          <View>
            {/* Фотографии */}
            {placeDetails.photos && placeDetails.photos.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                  {t('common.photos')}
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosContainer}>
                  {placeDetails.photos.slice(0, 5).map((photo, index) => (
                    <Image
                      key={index}
                      source={{ uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${GoogleAPIService.apiKey}` }}
                      style={styles.placeImage}
                    />
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Отзывы */}
            {placeDetails.reviews && placeDetails.reviews.length > 0 && (
              <View style={styles.section}>
                 <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                  {t('common.reviewsTitle')}
                </Text>
                <View style={styles.reviewsContainer}>
                  {placeDetails.reviews.slice(0, 2).map((review, index) => (
                    <View key={index} style={[styles.reviewItem, { backgroundColor: theme.colors.cardBackground, borderLeftColor: theme.colors.primary }]}>
                      <View style={styles.reviewHeader}>
                        <Image source={{ uri: review.profile_photo_url }} style={styles.authorImage} />
                        <View>
                          <Text style={[styles.reviewAuthor, { color: theme.colors.text }]}>{review.author_name}</Text>
                          <Text style={{ color: theme.colors.textSecondary }}>{review.relative_time_description}</Text>
                        </View>
                      </View>
                      <Text style={[styles.reviewText, { color: theme.colors.textSecondary }]}>{review.text}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}

        {/* Историческая справка */}
        {attraction.historicalInfo && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              {t('screens.attractionDetail.historicalInfo')}
            </Text>
            <Text style={[styles.sectionText, { color: theme.colors.textSecondary }]}>
              {attraction.historicalInfo}
            </Text>
          </View>
        )}

        {/* Время работы */}
        {attraction.workingHours && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              {t('screens.attractionDetail.workingHours')}
            </Text>
            <View style={[styles.workingHoursCard, { backgroundColor: theme.colors.cardBackground }]}>
              <View style={styles.workingHoursRow}>
                <Text style={[styles.workingHoursLabel, { color: theme.colors.text }]}>
                  {t('screens.attractionDetail.weekdays')}:
                </Text>
                <Text style={[styles.workingHoursValue, { color: theme.colors.textSecondary }]}>
                  {attraction.workingHours.weekdays}
                </Text>
              </View>
              <View style={styles.workingHoursRow}>
                <Text style={[styles.workingHoursLabel, { color: theme.colors.text }]}>
                  {t('screens.attractionDetail.weekend')}:
                </Text>
                <Text style={[styles.workingHoursValue, { color: theme.colors.textSecondary }]}>
                  {attraction.workingHours.weekend}
                </Text>
              </View>
              {attraction.workingHours.dayOff && (
                <View style={styles.workingHoursRow}>
                  <Text style={[styles.workingHoursLabel, { color: theme.colors.text }]}>
                    {t('screens.attractionDetail.dayOff')}:
                  </Text>
                  <Text style={[styles.workingHoursValue, { color: theme.colors.textSecondary }]}>
                    {attraction.workingHours.dayOff}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Дополнительная информация */}
        {(attraction.bestTimeToVisit || attraction.accessibility) && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              {t('screens.attractionDetail.usefulInfoTitle')}
            </Text>
            <View style={[styles.infoGrid, { backgroundColor: theme.colors.cardBackground }]}>
              {attraction.bestTimeToVisit && (
                <View style={styles.infoItem}>
                  <Ionicons name="sunny" size={20} color={theme.colors.primary} />
                  <View style={styles.infoTextContainer}>
                    <Text style={[styles.infoLabel, { color: theme.colors.text }]}>
                      {t('screens.attractionDetail.bestTimeToVisit')}
                    </Text>
                    <Text style={[styles.infoValue, { color: theme.colors.textSecondary }]}>
                      {attraction.bestTimeToVisit}
                    </Text>
                  </View>
                </View>
              )}
              {attraction.accessibility && (
                <View style={styles.infoItem}>
                  <Ionicons name="accessibility" size={20} color={theme.colors.primary} />
                  <View style={styles.infoTextContainer}>
                    <Text style={[styles.infoLabel, { color: theme.colors.text }]}>
                      {t('screens.attractionDetail.accessibility')}
                    </Text>
                    <Text style={[styles.infoValue, { color: theme.colors.textSecondary }]}>
                      {attraction.accessibility}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Советы */}
        {attraction.tips && attraction.tips.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              {t('screens.attractionDetail.tips')}
            </Text>
            <View style={[styles.tipsContainer, { backgroundColor: theme.colors.cardBackground }]}>
              {attraction.tips.map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <Ionicons name="bulb" size={16} color={theme.colors.primary} />
                  <Text style={[styles.tipText, { color: theme.colors.textSecondary }]}>
                    {tip}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Контакты */}
        {attraction.contacts && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              {t('screens.attractionDetail.contacts')}
            </Text>
            <View style={[styles.contactsCard, { backgroundColor: theme.colors.cardBackground }]}>
              {attraction.contacts.address && (
                <View style={styles.contactItem}>
                  <Ionicons name="location" size={20} color={theme.colors.primary} />
                  <Text style={[styles.contactText, { color: theme.colors.textSecondary }]}>
                    {attraction.contacts.address}
                  </Text>
                </View>
              )}
              {attraction.contacts.phone && (
                <TouchableOpacity 
                  style={styles.contactItem}
                  onPress={() => callPhone(attraction.contacts.phone)}
                >
                  <Ionicons name="call" size={20} color={theme.colors.primary} />
                  <Text style={[styles.contactText, styles.contactLink, { color: theme.colors.primary }]}>
                    {attraction.contacts.phone}
                  </Text>
                </TouchableOpacity>
              )}
              {attraction.contacts.email && (
                <TouchableOpacity 
                  style={styles.contactItem}
                  onPress={() => openEmail(attraction.contacts.email)}
                >
                  <Ionicons name="mail" size={20} color={theme.colors.primary} />
                  <Text style={[styles.contactText, styles.contactLink, { color: theme.colors.primary }]}>
                    {attraction.contacts.email}
                  </Text>
                </TouchableOpacity>
              )}
              {attraction.contacts.website && (
                <TouchableOpacity 
                  style={styles.contactItem}
                  onPress={() => openWebsite(attraction.contacts.website)}
                >
                  <Ionicons name="globe" size={20} color={theme.colors.primary} />
                  <Text style={[styles.contactText, styles.contactLink, { color: theme.colors.primary }]}>
                    {attraction.contacts.website}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Кнопка показать на карте */}
        <TouchableOpacity 
          style={[styles.mapButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.navigate('Map', { selectedAttractions: [attraction.id] })}
        >
          <Ionicons name="map" size={20} color="#FFFFFF" />
          <Text style={styles.mapButtonText}>{t('common.showOnMap')}</Text>
        </TouchableOpacity>

        {/* Кнопка "Маршрут" */}
        <TouchableOpacity 
          style={[styles.mapButton, { backgroundColor: theme.colors.secondary, marginTop: 10 }]}
          onPress={handleGetDirections}
        >
          <Ionicons name="navigate" size={20} color="#FFFFFF" />
          <Text style={styles.mapButtonText}>{t('screens.attractionDetail.getDirections')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerImage: {
    width: width,
    height: 250,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 30,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  location: {
    marginLeft: 6,
    fontSize: 14,
    fontStyle: 'italic',
    textDecorationLine: 'underline',
  },
  descriptionCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    marginLeft: 6,
    fontSize: 14,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 22,
  },
  workingHoursCard: {
    borderRadius: 12,
    padding: 16,
  },
  workingHoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  workingHoursLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  workingHoursValue: {
    fontSize: 14,
  },
  infoGrid: {
    borderRadius: 12,
    padding: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  infoTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    lineHeight: 20,
  },
  tipsContainer: {
    borderRadius: 12,
    padding: 16,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tipText: {
    marginLeft: 12,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  contactsCard: {
    borderRadius: 12,
    padding: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    marginLeft: 12,
    fontSize: 14,
    flex: 1,
  },
  contactLink: {
    textDecorationLine: 'underline',
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  mapButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 12,
    fontSize: 14,
  },
  placesSection: {
    marginTop: 0,
  },
  photosContainer: {
    marginTop: 0,
  },
  placeImage: {
    width: 150,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
  },
  reviewsContainer: {
    marginTop: 0,
  },
  reviewItem: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  authorImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  reviewAuthor: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  reviewText: {
    fontStyle: 'italic',
    fontSize: 14,
    lineHeight: 20,
  }
}); 