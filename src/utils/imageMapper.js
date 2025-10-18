/**
 * Маппер для преобразования путей к изображениям из API в require() объекты
 */

// Импортируем все изображения
const IMAGES = {
  // Pavlodar
  'assets/pavlodar/mashkhur-zhusup-mosque.jpg': require('../assets/pavlodar/mashkhur-zhusup-mosque.jpg'),
  'assets/pavlodar/blagoveshchensky-cathedral.jpg': require('../assets/pavlodar/blagoveshchensky-cathedral.jpg'),
  'assets/pavlodar/irtysh-embankment.jpg': require('../assets/pavlodar/irtysh-embankment.jpg'),
  'assets/pavlodar/vasiliev-house-museum.jpg': require('../assets/pavlodar/vasiliev-house-museum.jpg'),
  'assets/pavlodar/pavlodar-museum.jpg': require('../assets/pavlodar/pavlodar-museum.jpg'),
  'assets/pavlodar/chekhov-theater.jpg': require('../assets/pavlodar/chekhov-theater.jpg'),
  'assets/pavlodar/music-college.jpg': require('../assets/pavlodar/music-college.jpg'),
  'assets/pavlodar/jasybai-resort.jpg': require('../assets/pavlodar/jasybai-resort.jpg'),
  'assets/pavlodar/bayanaul-park.jpg': require('../assets/pavlodar/bayanaul-park.jpg'),
  'assets/pavlodar/kyzyltau-reserve.jpg': require('../assets/pavlodar/kyzyltau-reserve.jpg'),
  'assets/pavlodar/sabyndykol-lake.jpg': require('../assets/pavlodar/sabyndykol-lake.jpg'),
  'assets/pavlodar/toktamys-mausoleum.jpg': require('../assets/pavlodar/toktamys-mausoleum.jpg'),
  'assets/pavlodar/myrzashoky.jpg': require('../assets/pavlodar/myrzashoky.jpg'),
  
  // Historical
  'assets/historical/pavlodar-foundation.jpg': require('../assets/historical/pavlodar-foundation.jpg'),
  'assets/historical/pavlodar-city.jpeg': require('../assets/historical/pavlodar-city.jpeg'),
  
  // Region maps
  'assets/regions/pavlodar-map.png': require('../assets/regions/pavlodar-map.png'),
  'assets/regions/oskemen-map.png': require('../assets/regions/oskemen-map.png'),
  'assets/regions/shymkent-map.png': require('../assets/regions/shymkent-map.png'),
  'assets/regions/astana-map.png': require('../assets/regions/astana-map.png'),
  'assets/regions/aktau-map.png': require('../assets/regions/aktau-map.png'),
};

/**
 * Преобразует строковый путь к изображению в require() объект
 * @param {string|object} imagePath - путь к изображению или уже загруженное изображение
 * @returns {object|null} - require() объект или null
 */
export const mapImage = (imagePath) => {
  if (!imagePath) return null;
  
  // Если уже объект (не строка), возвращаем как есть
  if (typeof imagePath !== 'string') {
    return imagePath;
  }
  
  // Ищем в маппинге
  const mappedImage = IMAGES[imagePath];
  
  if (!mappedImage) {
    console.warn(`Image not found in mapper: ${imagePath}`);
    return null;
  }
  
  return mappedImage;
};

export default mapImage;

