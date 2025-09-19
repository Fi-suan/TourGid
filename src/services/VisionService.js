// Vision Service для анализа изображений
import GoogleAPIService from './GoogleAPIService';

class VisionService {
  constructor() {
    this.cache = new Map();
  }

  // Анализ изображения на предмет достопримечательностей
  async analyzeLandmark(imageBase64) {
    try {
      const result = await GoogleAPIService.analyzeImage(imageBase64);
      
      if (result.landmarkAnnotations && result.landmarkAnnotations.length > 0) {
        const landmark = result.landmarkAnnotations[0];
        return {
          success: true,
          landmark: {
            name: landmark.description,
            confidence: landmark.score,
            coordinates: landmark.locations?.[0]?.latLng ? {
              latitude: landmark.locations[0].latLng.latitude,
              longitude: landmark.locations[0].latLng.longitude
            } : null
          },
          labels: result.labelAnnotations?.map(label => ({
            description: label.description,
            confidence: label.score
          })) || []
        };
      }

      // Если не найдена достопримечательность, возвращаем общие метки
      return {
        success: false,
        labels: result.labelAnnotations?.map(label => ({
          description: label.description,
          confidence: label.score
        })) || [],
        text: result.textAnnotations?.map(text => text.description).join(' ') || ''
      };
    } catch (error) {
      console.error('Vision analysis error:', error);
      return { success: false, error: error.message };
    }
  }

  // Распознавание текста на изображении
  async extractText(imageBase64) {
    try {
      const result = await GoogleAPIService.analyzeImage(imageBase64);
      
      if (result.textAnnotations && result.textAnnotations.length > 0) {
        return {
          success: true,
          text: result.textAnnotations[0].description,
          words: result.textAnnotations.slice(1).map(annotation => ({
            text: annotation.description,
            boundingBox: annotation.boundingPoly
          }))
        };
      }

      return { success: false, text: '' };
    } catch (error) {
      console.error('Text extraction error:', error);
      return { success: false, error: error.message };
    }
  }

  // Определение типа места по изображению
  async classifyPlace(imageBase64) {
    try {
      const result = await GoogleAPIService.analyzeImage(imageBase64);
      
      if (result.labelAnnotations) {
        const labels = result.labelAnnotations.map(label => ({
          description: label.description,
          confidence: label.score
        }));

        // Определяем тип места по меткам
        const placeType = this.determinePlaceType(labels);
        
        return {
          success: true,
          placeType,
          confidence: Math.max(...labels.map(l => l.confidence)),
          labels
        };
      }

      return { success: false, placeType: 'unknown' };
    } catch (error) {
      console.error('Place classification error:', error);
      return { success: false, error: error.message };
    }
  }

  // Определение типа места по меткам
  determinePlaceType(labels) {
    const labelTexts = labels.map(l => l.description.toLowerCase()).join(' ');
    
    if (labelTexts.includes('mosque') || labelTexts.includes('church') || labelTexts.includes('temple')) {
      return 'religious';
    }
    if (labelTexts.includes('museum') || labelTexts.includes('gallery')) {
      return 'cultural';
    }
    if (labelTexts.includes('restaurant') || labelTexts.includes('cafe') || labelTexts.includes('food')) {
      return 'restaurant';
    }
    if (labelTexts.includes('hotel') || labelTexts.includes('accommodation')) {
      return 'hotel';
    }
    if (labelTexts.includes('park') || labelTexts.includes('garden') || labelTexts.includes('nature')) {
      return 'nature';
    }
    if (labelTexts.includes('monument') || labelTexts.includes('statue') || labelTexts.includes('memorial')) {
      return 'monument';
    }
    if (labelTexts.includes('building') || labelTexts.includes('architecture')) {
      return 'architecture';
    }
    
    return 'general';
  }

  // Поиск похожих мест по изображению
  async findSimilarPlaces(imageBase64, location = null) {
    try {
      const analysis = await this.analyzeLandmark(imageBase64);
      
      if (analysis.success && analysis.landmark) {
        // Если найдена достопримечательность, ищем похожие места
        const landmarkName = analysis.landmark.name;
        
        if (location) {
          // Ищем рядом с текущим местоположением
          const nearbyPlaces = await GoogleAPIService.searchNearbyPlaces(
            location,
            10000,
            'tourist_attraction'
          );
          
          return nearbyPlaces
            .filter(place => 
              place.name.toLowerCase().includes(landmarkName.toLowerCase()) ||
              landmarkName.toLowerCase().includes(place.name.toLowerCase())
            )
            .map(place => ({
              id: place.place_id,
              name: place.name,
              coordinates: {
                latitude: place.geometry.location.lat,
                longitude: place.geometry.location.lng
              },
              rating: place.rating || 0,
              similarity: this.calculateSimilarity(landmarkName, place.name)
            }))
            .sort((a, b) => b.similarity - a.similarity);
        }
      }

      return [];
    } catch (error) {
      console.error('Similar places search error:', error);
      return [];
    }
  }

  // Расчет схожести названий
  calculateSimilarity(str1, str2) {
    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();
    
    if (s1 === s2) return 1;
    if (s1.includes(s2) || s2.includes(s1)) return 0.8;
    
    // Простой алгоритм схожести
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;
    
    if (longer.length === 0) return 1;
    
    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  // Алгоритм Левенштейна для расчета расстояния
  levenshteinDistance(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  // Очистка кеша
  clearCache() {
    this.cache.clear();
  }
}

export default new VisionService();
