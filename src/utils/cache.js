import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_PREFIX = '@TourGidCache:';
const CACHE_EXPIRATION_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Retrieves an item from the cache.
 * @param {string} key The key to retrieve.
 * @returns {Promise<any|null>} The cached data, or null if it doesn't exist or is expired.
 */
export const getCache = async (key) => {
  try {
    const itemStr = await AsyncStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (!itemStr) {
      return null;
    }
    const item = JSON.parse(itemStr);
    const isExpired = Date.now() - item.timestamp > CACHE_EXPIRATION_MS;
    if (isExpired) {
      await AsyncStorage.removeItem(`${CACHE_PREFIX}${key}`);
      return null;
    }
    return item.data;
  } catch (error) {
    console.error(`Failed to get cache for key "${key}"`, error);
    return null;
  }
};

/**
 * Stores an item in the cache.
 * @param {string} key The key to store the data under.
 * @param {any} data The data to be stored.
 * @returns {Promise<void>}
 */
export const setCache = async (key, data) => {
  try {
    const item = {
      data,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(item));
  } catch (error) {
    console.error(`Failed to set cache for key "${key}"`, error);
  }
};

/**
 * Clears the entire cache.
 * @returns {Promise<void>}
 */
export const clearCache = async () => {
    try {
        const keys = await AsyncStorage.getAllKeys();
        const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
        await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
        console.error("Failed to clear cache", error);
    }
};
