import * as Speech from 'expo-speech';

// Google API Service для TTS и переводов
class GoogleAPIService {
  constructor() {
    this.apiKey = 'AIzaSyDHLPatV3_3xG1cdx0nvEhxCdn2XEgnzac';
    this.baseUrl = 'https://texttospeech.googleapis.com/v1';
    this.translateUrl = 'https://translation.googleapis.com/language/translate/v2';
    this.placesUrl = 'https://maps.googleapis.com/maps/api/place';
    this.geocodingUrl = 'https://maps.googleapis.com/maps/api/geocode';
    this.directionsUrl = 'https://maps.googleapis.com/maps/api/directions';
    this.speechToTextUrl = 'https://speech.googleapis.com/v1/speech:recognize';
  }

  setApiKey(apiKey) {
    this.apiKey = apiKey;
  }

  // Text-to-Speech через Google Cloud TTS
  async speakText(text, language = 'ru-RU', voice = 'ru-RU-Wavenet-A') {
    if (!this.apiKey) {
      console.warn('Google API key not set, falling back to expo-speech');
      return this.fallbackTTS(text);
    }

    try {
      const response = await fetch(`${this.baseUrl}/text:synthesize?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: { text: text },
          voice: {
            languageCode: language,
            name: voice,
            ssmlGender: 'NEUTRAL'
          },
          audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: 0.9,
            pitch: 0.0,
            volumeGainDb: 0.0
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Google TTS API error: ${response.status}`);
      }

      const data = await response.json();
      const audioData = data.audioContent;
      
      // Воспроизводим аудио
      return this.playAudioFromBase64(audioData);
      
    } catch (error) {
      console.error('Google TTS error:', error);
      return this.fallbackTTS(text);
    }
  }

  // Fallback на expo-speech
  async fallbackTTS(text) {
    if (!text) return; // Не озвучивать пустой текст
    try {
      const isAvailable = await Speech.isSpeakingAsync();
      if (isAvailable) {
        await Speech.stop();
      }
      await Speech.speak(text, {
        language: 'ru',
        pitch: 1.0,
        rate: 0.9,
        volume: 1.0,
      });
    } catch (error) {
      console.error('Fallback TTS error:', error);
    }
  }

  // Воспроизведение аудио из base64 (требует дополнительной настройки)
  async playAudioFromBase64(base64Audio) {
    // Для React Native нужно использовать react-native-sound или expo-av
    // Пока используем fallback
    console.log('Audio data received, using fallback TTS');
    return this.fallbackTTS('Аудио получено');
  }

  // Speech-to-Text via Google Cloud STT
  async transcribeAudio(audioBase64) {
    if (!this.apiKey) {
      console.warn('Google API key not set for Speech-to-Text');
      throw new Error('Google API key not set');
    }

    try {
      const response = await fetch(`${this.speechToTextUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          config: {
            encoding: 'LINEAR16',
            sampleRateHertz: 16000,
            languageCode: 'ru-RU',
          },
          audio: {
            content: audioBase64,
          },
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('Google STT API error response:', errorBody);
        throw new Error(`Google STT API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (data.results && data.results.length > 0 && data.results[0].alternatives && data.results[0].alternatives.length > 0) {
        return data.results[0].alternatives[0].transcript;
      } else {
        return null; // No speech detected or recognized
      }
    } catch (error) {
      console.error('Google STT error:', error);
      throw error;
    }
  }

  // Перевод текста через Google Translate
  async translateText(text, targetLanguage = 'ru', sourceLanguage = 'auto') {
    if (!this.apiKey) {
      console.warn('Google API key not set, returning original text');
      return text;
    }
    
    // --- ИСПРАВЛЕНИЕ: Не отправлять пустые строки на перевод ---
    if (!text || typeof text !== 'string' || !text.trim()) {
      return text;
    }

    try {
      const response = await fetch(`${this.translateUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          target: targetLanguage,
          source: sourceLanguage,
          format: 'text'
        })
      });

      if (!response.ok) {
        throw new Error(`Google Translate API error: ${response.status}`);
      }

      const data = await response.json();
      return data.data.translations[0].translatedText;
      
    } catch (error) {
      console.error('Google Translate error:', error);
      return text; // Возвращаем оригинальный текст при ошибке
    }
  }

  // Получение списка доступных голосов
  async getAvailableVoices(languageCode = 'ru-RU') {
    if (!this.apiKey) {
      return [];
    }

    try {
      const response = await fetch(`${this.baseUrl}/voices?key=${this.apiKey}&languageCode=${languageCode}`);
      
      if (!response.ok) {
        throw new Error(`Google Voices API error: ${response.status}`);
      }

      const data = await response.json();
      return data.voices || [];
      
    } catch (error) {
      console.error('Google Voices error:', error);
      return [];
    }
  }

  // Places API - поиск мест рядом
  async searchNearbyPlaces(location, radius = 5000, type = 'tourist_attraction') {
    try {
      const response = await fetch(
        `${this.placesUrl}/nearbysearch/json?location=${location.latitude},${location.longitude}&radius=${radius}&type=${type}&key=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`Places API error: ${response.status}`);
      }

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Places search error:', error);
      return [];
    }
  }

  // Places API - текстовый поиск
  async textSearch(query, location = null, radius = 5000) {
    try {
      let url = `${this.placesUrl}/textsearch/json?query=${encodeURIComponent(query)}&key=${this.apiKey}&language=ru`;
      
      if (location) {
        url += `&location=${location.latitude},${location.longitude}&radius=${radius}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Text Search API error: ${response.status}`);
      }

      const data = await response.json();
      console.log(`Text search for "${query}": ${data.results?.length || 0} results`);
      return data.results || [];
    } catch (error) {
      console.error('Text search error:', error);
      return [];
    }
  }

  // Places API - детали места
  async getPlaceDetails(placeId) {
    try {
      const response = await fetch(
        `${this.placesUrl}/details/json?place_id=${placeId}&fields=name,rating,formatted_phone_number,opening_hours,photos,reviews,website,user_ratings_total&key=${this.apiKey}&language=ru`
      );
      
      if (!response.ok) {
        throw new Error(`Place Details API error: ${response.status}`);
      }

      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Place details error:', error);
      return null;
    }
  }

  // Places API - поиск ID места по тексту
  async findPlaceFromText(query) {
    try {
      const response = await fetch(
        `${this.placesUrl}/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=place_id,name&key=${this.apiKey}&language=ru`
      );
      
      if (!response.ok) {
        throw new Error(`Find Place API error: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates || [];
    } catch (error) {
      console.error('Find Place error:', error);
      return [];
    }
  }

  // Geocoding API - адрес в координаты
  async geocodeAddress(address) {
    try {
      const response = await fetch(
        `${this.geocodingUrl}/json?address=${encodeURIComponent(address)}&key=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status}`);
      }

      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        return {
          latitude: location.lat,
          longitude: location.lng,
          address: data.results[0].formatted_address
        };
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  }

  // Reverse Geocoding - координаты в адрес
  async reverseGeocode(latitude, longitude) {
    try {
      const response = await fetch(
        `${this.geocodingUrl}/json?latlng=${latitude},${longitude}&key=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`Reverse Geocoding API error: ${response.status}`);
      }

      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return data.results[0].formatted_address;
      }
      return null;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return null;
    }
  }

  // Directions API - маршруты
  async getDirections(origin, destination, waypoints = [], travelMode = 'walking') {
    try {
      let url = `${this.directionsUrl}/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&mode=${travelMode}&key=${this.apiKey}`;
      
      if (waypoints.length > 0) {
        const waypointStr = waypoints.map(wp => `${wp.latitude},${wp.longitude}`).join('|');
        url += `&waypoints=${waypointStr}`;
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Directions API error: ${response.status}`);
      }

      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const leg = route.legs[0];
        
        return {
          success: true,
          route: {
            coordinates: this.decodePolyline(route.overview_polyline.points),
            distance: leg.distance.value,
            duration: leg.duration.value,
            instructions: leg.steps.map(step => step.html_instructions),
            isFallback: false
          }
        };
      }
      return { success: false, error: 'No routes found' };
    } catch (error) {
      console.error('Directions error:', error);
      return { success: false, error: error.message };
    }
  }

  // Декодирование полилинии
  decodePolyline(encoded) {
    const points = [];
    let index = 0;
    let lat = 0;
    let lng = 0;

    while (index < encoded.length) {
      let b, shift = 0, result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      points.push({
        latitude: lat / 1e5,
        longitude: lng / 1e5
      });
    }

    return points;
  }

  // Vision API - анализ изображений (для распознавания достопримечательностей)
  async analyzeImage(imageBase64) {
    try {
      const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [{
            image: { content: imageBase64 },
            features: [
              { type: 'LABEL_DETECTION', maxResults: 10 },
              { type: 'LANDMARK_DETECTION', maxResults: 5 },
              { type: 'TEXT_DETECTION', maxResults: 10 }
            ]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Vision API error: ${response.status}`);
      }

      const data = await response.json();
      return data.responses[0] || {};
    } catch (error) {
      console.error('Vision API error:', error);
      return {};
    }
  }

  // Проверка доступности API
  async checkAPIStatus() {
    if (!this.apiKey) {
      return { available: false, error: 'Google API key not set' };
    }

    try {
      const response = await fetch(`${this.baseUrl}/voices?key=${this.apiKey}`);
      return {
        available: response.ok,
        error: response.ok ? null : `HTTP ${response.status}: ${response.statusText}`
      };
    } catch (error) {
      return {
        available: false,
        error: `Fetch error: ${error.message}`
      };
    }
  }
}

export default new GoogleAPIService();
