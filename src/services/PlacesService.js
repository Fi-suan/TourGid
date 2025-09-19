// Places Service для работы с Google Places API
import GoogleAPIService from './GoogleAPIService';

class PlacesService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 минут
  }

  // Поиск достопримечательностей рядом
  async searchNearbyAttractions(location, radius = 5000) {
    try {
      const places = await GoogleAPIService.searchNearbyPlaces(
        location, 
        radius, 
        'tourist_attraction'
      );

      return places.map(place => this.formatPlace(place));
    } catch (error) {
      console.error('Places search error:', error);
      return [];
    }
  }

  // Поиск ресторанов рядом
  async searchNearbyRestaurants(location, radius = 3000) {
    try {
      const places = await GoogleAPIService.searchNearbyPlaces(
        location, 
        radius, 
        'restaurant'
      );

      return places.map(place => this.formatPlace(place));
    } catch (error) {
      console.error('Restaurants search error:', error);
      return [];
    }
  }

  // Поиск отелей рядом
  async searchNearbyHotels(location, radius = 10000) {
    try {
      const places = await GoogleAPIService.searchNearbyPlaces(
        location, 
        radius, 
        'lodging'
      );

      return places.map(place => this.formatPlace(place));
    } catch (error) {
      console.error('Hotels search error:', error);
      return [];
    }
  }

  // Поиск заправок рядом
  async searchNearbyGasStations(location, radius = 5000) {
    try {
      const places = await GoogleAPIService.searchNearbyPlaces(
        location, 
        radius, 
        'gas_station'
      );

      return places.map(place => this.formatPlace(place));
    } catch (error) {
      console.error('Gas stations search error:', error);
      return [];
    }
  }

  // Поиск банкоматов рядом
  async searchNearbyATMs(location, radius = 2000) {
    try {
      const places = await GoogleAPIService.searchNearbyPlaces(
        location, 
        radius, 
        'atm'
      );

      return places.map(place => this.formatPlace(place));
    } catch (error) {
      console.error('ATMs search error:', error);
      return [];
    }
  }

  // Получение детальной информации о месте
  async getPlaceDetails(placeId) {
    // Проверяем кеш
    const cacheKey = `place_${placeId}`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const details = await GoogleAPIService.getPlaceDetails(placeId);
      if (details) {
        // Кешируем результат
        this.cache.set(cacheKey, {
          data: details,
          timestamp: Date.now()
        });
      }
      return details;
    } catch (error) {
      console.error('Place details error:', error);
      return null;
    }
  }

  // Поиск по тексту
  async searchPlaces(query, location = null, radius = 5000) {
    try {
      // Сначала пробуем найти через геокодирование
      const geocoded = await GoogleAPIService.geocodeAddress(query);
      if (geocoded) {
        return [{
          id: 'geocoded',
          name: query,
          address: geocoded.address,
          coordinates: {
            latitude: geocoded.latitude,
            longitude: geocoded.longitude
          },
          rating: 0,
          isGeocoded: true
        }];
      }

      // Если есть локация, ищем рядом
      if (location) {
        const nearby = await this.searchNearbyAttractions(location, radius);
        return nearby.filter(place => 
          place.name.toLowerCase().includes(query.toLowerCase())
        );
      }

      return [];
    } catch (error) {
      console.error('Place search error:', error);
      return [];
    }
  }

  // Форматирование места в стандартный формат
  formatPlace(place) {
    return {
      id: place.place_id,
      name: place.name,
      address: place.vicinity || place.formatted_address,
      coordinates: {
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng
      },
      rating: place.rating || 0,
      priceLevel: place.price_level || 0,
      types: place.types || [],
      photos: place.photos || [],
      isOpen: place.opening_hours?.open_now || false,
      isGooglePlace: true
    };
  }

  // Получение фото места
  getPlacePhoto(photoReference, maxWidth = 400) {
    if (!photoReference) return null;
    
    return `https://maps.googleapis.com/maps/api/place/photo?` +
      `maxwidth=${maxWidth}&photoreference=${photoReference}&key=${GoogleAPIService.apiKey}`;
  }

  // Поиск популярных мест в городе
  async getPopularPlaces(cityName, type = 'tourist_attraction') {
    try {
      // Геокодируем город
      const cityLocation = await GoogleAPIService.geocodeAddress(cityName);
      if (!cityLocation) return [];

      // Ищем популярные места
      const places = await GoogleAPIService.searchNearbyPlaces(
        cityLocation,
        20000, // 20км радиус для города
        type
      );

      // Сортируем по рейтингу
      return places
        .map(place => this.formatPlace(place))
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 20); // Топ 20
    } catch (error) {
      console.error('Popular places search error:', error);
      return [];
    }
  }

  // Очистка кеша
  clearCache() {
    this.cache.clear();
  }

  // Получение статистики кеша
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

export default new PlacesService();
