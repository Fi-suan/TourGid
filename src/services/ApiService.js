import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

const getApiBaseUrl = () => {
  // In a development build, we can dynamically determine the host machine's IP
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const ipAddress = hostUri.split(':')[0];
    return `http://${ipAddress}:3000/api`;
  }
  
  // Fallback for production or other environments
  return 'http://localhost:3000/api'; 
};

const API_BASE_URL = getApiBaseUrl();

const apiClient = {
    get: async (endpoint) => {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error fetching from ${endpoint}:`, error);
            throw error;
        }
    },
    post: async (endpoint, body) => {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error posting to ${endpoint}:`, error);
            throw error;
        }
    }
};

export const findPlacePhoto = (query) => {
    return apiClient.get(`/find-place-photo?query=${encodeURIComponent(query)}`);
};

export const getRegions = () => {
    return apiClient.get('/regions');
};

export const getAttractions = (regionId) => {
    const query = regionId ? `?regionId=${regionId}` : '';
    return apiClient.get(`/attractions${query}`);
};

export const getInterests = () => {
    return apiClient.get('/interests');
};

export const getRoutes = (regionId) => {
    const query = regionId ? `?regionId=${regionId}` : '';
    return apiClient.get(`/routes${query}`);
};

export const getHistoricalFacts = (regionId) => {
    const query = regionId ? `?regionId=${regionId}` : '';
    return apiClient.get(`/historical-facts${query}`);
};

export const getPlaceDetails = (placeId) => {
    return apiClient.get(`/place-details?placeId=${placeId}`);
};

/**
 * Транскрибирует аудиофайл в текст
 * @param {string} audioUri - URI аудиофайла
 * @returns {Promise<string>} - распознанный текст
 */
export const transcribeAudio = async (audioUri) => {
    try {
        console.log('📤 Отправка аудио на бэкенд для распознавания...');
        
        const audioData = await FileSystem.readAsStringAsync(audioUri, {
            encoding: FileSystem.EncodingType.Base64,
        });
        
        const result = await apiClient.post('/transcribe', { audio: audioData });
        
        if (result.text) {
            console.log('✅ Распознано:', result.text);
            return result.text;
        }
        
        return null;
    } catch (error) {
        console.error('❌ Ошибка транскрипции:', error);
        throw error;
    }
};

/**
 * Обрабатывает текстовый запрос пользователя через AI на бэкенде
 * @param {string} text - текст запроса
 * @param {Object} context - контекст (регион, достопримечательности)
 * @returns {Promise<Object>} - ответ с командой для выполнения
 */
export const processQuery = async (text, context = {}) => {
    try {
        console.log('🤖 Отправка запроса на бэкенд для обработки AI...');
        
        const result = await apiClient.post('/process-query', { 
            text,
            context 
        });
        
        console.log('✅ AI ответ:', result);
        return result;
    } catch (error) {
        console.error('❌ Ошибка обработки запроса:', error);
        throw error;
    }
};

/**
 * Получает маршрут через Google Directions API
 * @param {string} origin - начальная точка "lat,lng"
 * @param {string} destination - конечная точка "lat,lng"
 * @param {string} waypoints - промежуточные точки (опционально)
 * @param {string} mode - режим передвижения (walking, driving, transit)
 * @returns {Promise<Object>} - данные маршрута
 */
export const getDirections = async (origin, destination, waypoints = '', mode = 'walking') => {
    try {
        let url = `/directions?origin=${origin}&destination=${destination}&mode=${mode}`;
        if (waypoints) {
            url += `&waypoints=${waypoints}`;
        }
        console.log('🗺️ Запрос маршрута через бэкенд...');
        return await apiClient.get(url);
    } catch (error) {
        console.error('❌ Ошибка получения маршрута:', error);
        throw error;
    }
};

/**
 * Получает отзывы о месте
 * @param {string} placeId - Google Place ID
 * @returns {Promise<Object>} - отзывы и рейтинг
 */
export const getPlaceReviews = async (placeId) => {
    try {
        console.log('⭐ Запрос отзывов через бэкенд...');
        return await apiClient.get(`/place-reviews?placeId=${placeId}`);
    } catch (error) {
        console.error('❌ Ошибка получения отзывов:', error);
        throw error;
    }
};

/**
 * Геокодирование адреса
 * @param {string} address - адрес или координаты
 * @returns {Promise<Object>} - данные геокодирования
 */
export const geocode = async (address) => {
    try {
        return await apiClient.get(`/geocode?address=${encodeURIComponent(address)}`);
    } catch (error) {
        console.error('❌ Ошибка геокодирования:', error);
        throw error;
    }
};

export default {
    getRegions,
    getAttractions,
    getInterests,
    getRoutes,
    getHistoricalFacts,
    getPlaceDetails,
    transcribeAudio,
    processQuery,
    findPlacePhoto,
    getDirections,
    getPlaceReviews,
    geocode,
};
