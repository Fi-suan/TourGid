// Places Service для работы с Google Places API
import GoogleAPIService from './GoogleAPIService';
import { getCache, setCache } from '../utils/cache';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY; // This will be undefined on the client, which is what we want.

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
      return [];
    }
  }

  // Поиск музеев рядом
  async searchNearbyMuseums(location, radius = 5000) {
    try {
      const places = await GoogleAPIService.searchNearbyPlaces(
        location, 
        radius, 
        'museum'
      );

      return places.map(place => this.formatPlace(place));
    } catch (error) {
      return [];
    }
  }

  // Поиск исторических мест рядом (комбинированный)
  async searchNearbyHistoricalPlaces(location, radius = 10000) {
    // Проверяем кэш
    const cacheKey = `historical_${location.latitude}_${location.longitude}_${radius}`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const types = ['tourist_attraction', 'museum', 'church', 'mosque', 'synagogue', 'hindu_temple'];
      const allPlaces = [];

      for (const type of types) {
        try {
          const places = await GoogleAPIService.searchNearbyPlaces(location, radius, type);
          allPlaces.push(...places);
        } catch (error) {
        }
      }

      // Убираем дубликаты по place_id
      const uniquePlaces = allPlaces.filter((place, index, self) =>
        index === self.findIndex((p) => p.place_id === place.place_id)
      );

      const formattedPlaces = uniquePlaces.map(place => this.formatPlace(place));

      // Кешируем результат
      this.cache.set(cacheKey, {
        data: formattedPlaces,
        timestamp: Date.now()
      });

      return formattedPlaces;
    } catch (error) {
      return [];
    }
  }

  // Поиск природных достопримечательностей
  async searchNearbyNaturalAttractions(location, radius = 15000) {
    try {
      const types = ['park', 'natural_feature', 'point_of_interest'];
      const allPlaces = [];

      for (const type of types) {
        try {
          const places = await GoogleAPIService.searchNearbyPlaces(location, radius, type);
          allPlaces.push(...places);
        } catch (error) {
        }
      }

      const uniquePlaces = allPlaces.filter((place, index, self) =>
        index === self.findIndex((p) => p.place_id === place.place_id)
      );

      return uniquePlaces.map(place => this.formatPlace(place));
    } catch (error) {
      return [];
    }
  }

  // Поиск достопримечательностей по категории
  async searchByCategory(location, category, radius = 10000) {
    // Проверяем кэш
    const cacheKey = `category_${category}_${location.latitude}_${location.longitude}_${radius}`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    const categoryMap = {
      'history': ['tourist_attraction', 'museum'],
      'culture': ['tourist_attraction', 'museum', 'art_gallery', 'library'],
      'religious': ['church', 'mosque', 'synagogue', 'hindu_temple'],
      'nature': ['park', 'natural_feature'],
      'architecture': ['tourist_attraction', 'point_of_interest'],
      'education': ['museum', 'library', 'university']
    };

    const types = categoryMap[category] || ['tourist_attraction'];
    const allPlaces = [];

    for (const type of types) {
      try {
        const places = await GoogleAPIService.searchNearbyPlaces(location, radius, type);
        allPlaces.push(...places);
      } catch (error) {
      }
    }

    const uniquePlaces = allPlaces.filter((place, index, self) =>
      index === self.findIndex((p) => p.place_id === place.place_id)
    );

    const formattedPlaces = uniquePlaces.map(place => this.formatPlace(place));

    // Кешируем результат
    this.cache.set(cacheKey, {
      data: formattedPlaces,
      timestamp: Date.now()
    });

    return formattedPlaces;
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
      return null;
    }
  }

  async searchPlaces(query, location, radius = 50000) {
    // Caching logic remains the same
    const cacheKey = `places:${query}:${location?.latitude}:${location?.longitude}`;
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // The actual API call is now expected to be done on the backend.
    // This client-side function may need to be refactored or removed
    // depending on how the app architecture evolves. For now, it will fail gracefully.
    if (!GOOGLE_API_KEY) {
      console.warn("GOOGLE_API_KEY is not defined on the client. Place search must be done on the backend.");
      return [];
    }

    // Keeping the original logic here but it shouldn't be executed.
    let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}`;
    if (location) {
      url += `&location=${location.latitude},${location.longitude}&radius=${radius}`;
    }
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.results) {
        await setCache(cacheKey, data.results);
      }
      return data.results || [];
    } catch (error) {
      console.error('PlacesService.searchPlaces error:', error);
      throw error;
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
