import { StyleSheet } from 'react-native';

// Регионы - только Павлодар
export const REGIONS = [
  {
    id: 'pavlodar',
    name: 'Павлодарская область',
    nameEn: 'Pavlodar Region',
    nameKz: 'Павлодар облысы',
    coordinates: { latitude: 52.3000, longitude: 76.9500 },
    description: 'Промышленный и культурный центр Северного Казахстана на берегу Иртыша',
    population: '750,000',
    founded: '1720 (как форпост Коряковский)',
    climate: 'Резко континентальный',
    mainCity: 'Павлодар',
    attractions_count: 12
  }
];

// Достопримечательности Павлодара
export const ATTRACTIONS = [
  {
    id: 'pvl001',
    name: 'attractions.mashkhurZhusupMosque.name',
    description: 'attractions.mashkhurZhusupMosque.description',
    location: 'ул. Академика Сатпаева, 30',
    regionId: 'pavlodar', 
    image: require('../assets/pavlodar/mashkhur-zhusup-mosque.jpg'),
    categories: ['religion', 'architecture', 'culture'],
    workingHours: { 
      weekdays: '05:00 - 23:00', 
      weekend: '05:00 - 23:00', 
      dayOff: null 
    },
    contacts: { 
      phone: '+7 (7182) 61-15-55', 
      address: 'ул. Академика Сатпаева, 30'
    },
    coordinates: { latitude: 52.2970, longitude: 76.9470 },
    historicalInfo: 'Построена в 2001 году в честь Машхур Жусупа Копеева - выдающегося казахского ученого, просветителя и религиозного деятеля XIX века.',
    tips: [
      'Вход свободный для всех посетителей',
      'Соблюдайте дресс-код при посещении',
      'Фотографирование внутри требует разрешения'
    ],
    rating: 4.6,
    visitDuration: '30-45 минут',
    bestTimeToVisit: 'Утром или после вечерней молитвы',
    accessibility: 'Доступен для людей с ограниченными возможностями'
  },
  {
    id: 'pvl002',
    name: 'attractions.blagoveshchenskyCathedral.name',
    description: 'attractions.blagoveshchenskyCathedral.description',
    location: 'ул. Кутузова, 4',
    regionId: 'pavlodar',
    image: require('../assets/pavlodar/blagoveshchensky-cathedral.jpg'),
    categories: ['religion', 'architecture', 'history'],
    workingHours: { 
      weekdays: '07:00 - 19:00', 
      weekend: '07:00 - 20:00', 
      dayOff: null 
    },
    contacts: { 
      phone: '+7 (7182) 32-14-85', 
      address: 'ул. Кутузова, 4',
      email: 'sobor.pavlodar@mail.ru'
    },
    coordinates: { latitude: 52.2850, longitude: 76.9650 },
    historicalInfo: 'Построен в 1864 году как первый каменный храм Павлодара. Является памятником архитектуры XIX века.',
    tips: [
      'Красивые иконостасы и фрески внутри',
      'Можно приобрести церковную литературу',
      'По воскресеньям проходят торжественные службы'
    ],
    rating: 4.7,
    visitDuration: '30-60 минут',
    bestTimeToVisit: 'Утром в будний день',
    accessibility: 'Частично доступен'
  },
  {
    id: 'pvl003',
    name: 'attractions.irtyshEmbankment.name',
    description: 'attractions.irtyshEmbankment.description',
    location: 'Набережная им. Габита Мусрепова',
    regionId: 'pavlodar',
    image: require('../assets/pavlodar/irtysh-embankment.jpg'),
    categories: ['nature', 'recreation', 'scenic'],
    workingHours: { 
      weekdays: '24/7', 
      weekend: '24/7', 
      dayOff: null 
    },
    contacts: { 
      phone: '+7 (7182) 55-12-00', 
      address: 'Набережная им. Габита Мусрепова'
    },
    coordinates: { latitude: 52.3025, longitude: 76.9630 },
    historicalInfo: 'Набережная благоустроена в 2000-х годах. Иртыш - одна из крупнейших рек Азии.',
    tips: [
      'Лучшие фото на закате',
      'Есть прокат велосипедов и лодок',
      'Множество кафе и ресторанов рядом'
    ],
    rating: 4.5,
    visitDuration: '1-3 часа',
    bestTimeToVisit: 'Вечером на закате',
    accessibility: 'Полностью доступна'
  },
  {
    id: 'pvl004',
    name: 'attractions.pavelVasilievHouseMuseum.name',
    description: 'attractions.pavelVasilievHouseMuseum.description',
    location: 'ул. Павла Васильева, 78',
    regionId: 'pavlodar',
    image: require('../assets/pavlodar/vasiliev-house-museum.jpg'),
    categories: ['culture', 'history', 'education'],
    workingHours: { 
      weekdays: '09:00 - 18:00', 
      weekend: '10:00 - 17:00', 
      dayOff: 'Понедельник' 
    },
    contacts: { 
      phone: '+7 (7182) 61-28-47', 
      address: 'ул. Павла Васильева, 78',
      email: 'vasiliev.museum@mail.ru'
    },
    coordinates: { latitude: 52.2820, longitude: 76.9580 },
    historicalInfo: 'Павел Васильев (1910-1937) - выдающийся русский поэт, родился в Зайсане, но детство провел в Павлодаре.',
    tips: [
      'Экскурсии проводятся каждый час',
      'Есть библиотека с произведениями поэта',
      'Регулярно проходят литературные вечера'
    ],
    rating: 4.4,
    visitDuration: '45-90 минут',
    bestTimeToVisit: 'В будний день утром',
    accessibility: 'Частично доступен'
  },
  {
    id: 'pvl005',
    name: 'attractions.regionalMuseumOfLocalLore.name',
    description: 'attractions.regionalMuseumOfLocalLore.description',
    location: 'ул. Академика Сатпаева, 40',
    regionId: 'pavlodar',
    image: require('../assets/pavlodar/pavlodar-museum.jpg'),
    categories: ['history', 'culture', 'education'],
    workingHours: { 
      weekdays: '09:00 - 18:00', 
      weekend: '10:00 - 17:00', 
      dayOff: 'Понедельник' 
    },
    contacts: { 
      phone: '+7 (7182) 67-36-64', 
      address: 'ул. Академика Сатпаева, 40',
      website: 'museum.pavlodar.gov.kz'
    },
    coordinates: { latitude: 52.2890, longitude: 76.9420 },
    historicalInfo: 'Основан в 1942 году. Хранит более 80 000 экспонатов.',
    tips: [
      'Особенно интересна археологическая коллекция',
      'Есть диорама "Освоение целины"',
      'Проводятся мастер-классы для детей'
    ],
    rating: 4.3,
    visitDuration: '1-2 часа',
    bestTimeToVisit: 'В выходные дни',
    accessibility: 'Доступен для людей с ограниченными возможностями'
  },
  {
    id: 'pvl006',
    name: 'attractions.chekhovTheater.name',
    description: 'attractions.chekhovTheater.description',
    location: 'ул. Ленина, 44',
    regionId: 'pavlodar',
    image: require('../assets/pavlodar/chekhov-theater.jpg'),
    categories: ['culture', 'entertainment', 'architecture'],
    workingHours: { 
      weekdays: '10:00 - 19:00', 
      weekend: '10:00 - 19:00', 
      dayOff: 'Понедельник' 
    },
    contacts: { 
      phone: '+7 (7182) 32-33-44', 
      address: 'ул. Ленина, 44',
      website: 'chekhov-theater.kz'
    },
    coordinates: { latitude: 52.2880, longitude: 76.9520 },
    historicalInfo: 'Основан в 1964 году. Носит имя великого русского драматурга А.П. Чехова.',
    tips: [
      'Билеты можно купить онлайн',
      'Есть спектакли на казахском и русском языках',
      'Действует система скидок для студентов'
    ],
    rating: 4.5,
    visitDuration: '2-3 часа',
    bestTimeToVisit: 'Вечером на спектакль',
    accessibility: 'Доступен для людей с ограниченными возможностями'
  },
  {
    id: 'pvl007',
    name: 'attractions.musicCollege.name',
    description: 'attractions.musicCollege.description',
    location: 'ул. Толстого, 46',
    regionId: 'pavlodar',
    image: require('../assets/pavlodar/music-college.jpg'),
    categories: ['culture', 'education', 'architecture'],
    workingHours: { 
      weekdays: '08:00 - 18:00', 
      weekend: '10:00 - 16:00', 
      dayOff: null 
    },
    contacts: { 
      phone: '+7 (7182) 61-45-67', 
      address: 'ул. Толстого, 46'
    },
    coordinates: { latitude: 52.2840, longitude: 76.9480 },
    historicalInfo: 'Основан в 1967 году для подготовки музыкальных кадров региона.',
    tips: [
      'Регулярно проходят концерты студентов',
      'Можно посетить мастер-классы',
      'Красивая архитектура советского периода'
    ],
    rating: 4.2,
    visitDuration: '1-2 часа',
    bestTimeToVisit: 'Во время концертов',
    accessibility: 'Частично доступен'
  },
  {
    id: 'pvl008',
    name: 'attractions.jasybaiResort.name',
    description: 'attractions.jasybaiResort.description',
    location: 'п. Жасыбай, 70 км от Павлодара',
    regionId: 'pavlodar',
    image: require('../assets/pavlodar/jasybai-resort.jpg'),
    categories: ['nature', 'recreation', 'health'],
    workingHours: { 
      weekdays: '24/7', 
      weekend: '24/7', 
      dayOff: null 
    },
    contacts: { 
      phone: '+7 (7182) 45-67-89', 
      address: 'п. Жасыбай'
    },
    coordinates: { latitude: 52.1500, longitude: 76.8000 },
    historicalInfo: 'Популярное место отдыха с минеральными источниками.',
    tips: [
      'Можно остановиться в санатории',
      'Лечебные грязи и минеральная вода',
      'Лучше приезжать на 2-3 дня'
    ],
    rating: 4.3,
    visitDuration: '1-3 дня',
    bestTimeToVisit: 'Летом',
    accessibility: 'Доступен для людей с ограниченными возможностями'
  },
  {
    id: 'pvl009',
    name: 'attractions.bayanaulNationalPark.name',
    description: 'attractions.bayanaulNationalPark.description',
    location: 'Баянаульский район, 100 км от Павлодара',
    regionId: 'pavlodar',
    image: require('../assets/pavlodar/bayanaul-park.jpg'),
    categories: ['nature', 'adventure', 'scenic'],
    workingHours: { 
      weekdays: '08:00 - 20:00', 
      weekend: '08:00 - 20:00', 
      dayOff: null 
    },
    contacts: { 
      phone: '+7 (71836) 2-13-58', 
      address: 'с. Баянаул',
      website: 'bayanaul.kz'
    },
    coordinates: { latitude: 52.5000, longitude: 75.7000 },
    historicalInfo: 'Создан в 1985 году как первый национальный парк Казахстана.',
    tips: [
      'Планируйте поездку на 2-3 дня',
      'Можно остановиться в гостевых домах',
      'Множество пешеходных маршрутов'
    ],
    rating: 4.9,
    visitDuration: '1-3 дня',
    bestTimeToVisit: 'Май-сентябь',
    accessibility: 'Требуется хорошая физическая подготовка'
  },
  {
    id: 'pvl010',
    name: 'attractions.kyzyltauReserve.name',
    description: 'attractions.kyzyltauReserve.description',
    location: 'Кызылтауский заказник, 80 км от Павлодара',
    regionId: 'pavlodar',
    image: require('../assets/pavlodar/kyzyltau-reserve.jpg'),
    categories: ['nature', 'adventure', 'scenic'],
    workingHours: { 
      weekdays: '08:00 - 20:00', 
      weekend: '08:00 - 20:00', 
      dayOff: null 
    },
    contacts: { 
      phone: '+7 (7182) 55-44-33', 
      address: 'Кызылтауский заказник'
    },
    coordinates: { latitude: 52.4000, longitude: 76.2000 },
    historicalInfo: 'Государственный природный заказник, основанный для охраны степной фауны.',
    tips: [
      'Нужно разрешение для посещения',
      'Отличное место для бёрдвотчинга',
      'Захватите бинокль и фотоаппарат'
    ],
    rating: 4.1,
    visitDuration: '4-6 часов',
    bestTimeToVisit: 'Весной и осенью',
    accessibility: 'Требуется хорошая физическая подготовка'
  },
  {
    id: 'pvl011',
    name: 'attractions.sabyndykolLake.name',
    description: 'attractions.sabyndykolLake.description',
    location: '45 км к юго-востоку от Павлодара',
    regionId: 'pavlodar',
    image: require('../assets/pavlodar/sabyndykol-lake.jpg'),
    categories: ['nature', 'recreation', 'scenic'],
    workingHours: { 
      weekdays: '24/7', 
      weekend: '24/7', 
      dayOff: null 
    },
    contacts: { 
      phone: null, 
      address: 'озеро Сабындыкуль'
    },
    coordinates: { latitude: 52.1800, longitude: 77.1200 },
    historicalInfo: 'Соленое озеро с лечебными свойствами.',
    tips: [
      'Вода очень соленая - легко плавать',
      'Грязи озера имеют лечебные свойства',
      'Лучше ехать на своем транспорте'
    ],
    rating: 4.0,
    visitDuration: '2-4 часа',
    bestTimeToVisit: 'Летом',
    accessibility: 'Частично доступно'
  },
  {
    id: 'pvl012',
    name: 'attractions.toktamysMausoleum.name',
    description: 'attractions.toktamysMausoleum.description',
    location: 'село Кызылжар, 60 км от Павлодара',
    regionId: 'pavlodar',
    image: require('../assets/pavlodar/toktamys-mausoleum.jpg'),
    categories: ['history', 'architecture', 'culture'],
    workingHours: { 
      weekdays: '09:00 - 18:00', 
      weekend: '09:00 - 18:00', 
      dayOff: null 
    },
    contacts: { 
      phone: '+7 (7182) 44-55-66', 
      address: 'село Кызылжар'
    },
    coordinates: { latitude: 52.1200, longitude: 76.7800 },
    historicalInfo: 'Мавзолей XIV века, памятник золотоордынской архитектуры.',
    tips: [
      'Уникальный образец средневековой архитектуры',
      'Экскурсии проводятся по предварительной записи',
      'Интересна история хана Токтамыша'
    ],
    rating: 4.4,
    visitDuration: '1-2 часа',
    bestTimeToVisit: 'В хорошую погоду',
    accessibility: 'Частично доступен'
  },
  {
    id: 'pvl013',
    name: 'attractions.myrzashoky.name',
    description: 'attractions.myrzashoky.description',
    location: 'Аккулинский район, 90 км от Павлодара',
    regionId: 'pavlodar',
    image: require('../assets/pavlodar/myrzashoky.jpg'),
    categories: ['history', 'culture', 'unique'],
    workingHours: { 
      weekdays: '24/7', 
      weekend: '24/7', 
      dayOff: null 
    },
    contacts: { 
      phone: null, 
      address: 'Аккулинский район'
    },
    coordinates: { latitude: 51.9500, longitude: 76.5000 },
    historicalInfo: 'Древнее городище, археологический памятник X-XIV веков.',
    tips: [
      'Нужен гид для полноценной экскурсии',
      'Захватите воду и головной убор',
      'Интересно для любителей истории'
    ],
    rating: 3.8,
    visitDuration: '2-3 часа',
    bestTimeToVisit: 'Весной и осенью',
    accessibility: 'Требуется хорошая физическая подготовка'
  }
];

// Интересы для фильтрации
export const INTERESTS = [
  { id: 'religion', name: 'interests.religion', icon: 'moon' },
  { id: 'history', name: 'interests.history', icon: 'book' },
  { id: 'culture', name: 'interests.culture', icon: 'color-palette' },
  { id: 'nature', name: 'interests.nature', icon: 'leaf' },
  { id: 'architecture', name: 'interests.architecture', icon: 'business' },
  { id: 'recreation', name: 'interests.recreation', icon: 'happy' },
  { id: 'entertainment', name: 'interests.entertainment', icon: 'game-controller' },
  { id: 'scenic', name: 'interests.scenic', icon: 'camera' },
  { id: 'unique', name: 'interests.unique', icon: 'star' },
  { id: 'adventure', name: 'interests.adventure', icon: 'trail-sign' },
  { id: 'shopping', name: 'interests.shopping', icon: 'bag' },
  { id: 'education', name: 'interests.education', icon: 'school' }
];

// Маршруты для Павлодара
export const ROUTES = [
  {
    id: 'pvl_route_1',
    name: 'routes.culturalHeritageOfPavlodar.name',
    description: 'routes.culturalHeritageOfPavlodar.description',
    duration: '5-6 часов',
    difficulty: 'Средний',
    regionId: 'pavlodar',
    attractions: ['pvl004', 'pvl005', 'pvl002'], // Музеи и собор
    recommendedTransport: 'Пешком/Автобус',
    distance: '8 км',
    estimatedCost: '800-1500 тенге',
    tips: [
      'Музеи закрыты по понедельникам',
      'Экскурсии в музеях проводятся каждый час',
      'В соборе можно купить литературу'
    ],
    highlights: [
      'Литературное наследие Павла Васильева',
      'Археологические находки в музее',
      'Архитектура XIX века'
    ]
  },
  {
    id: 'pvl_route_2',
    name: 'routes.natureOfIrtyshRegion.name',
    description: 'routes.natureOfIrtyshRegion.description',
    duration: '1-2 дня',
    difficulty: 'Средний',
    regionId: 'pavlodar',
    attractions: ['pvl003', 'pvl009'], // Набережная и парк
    recommendedTransport: 'Автомобиль',
    distance: '100 км',
    estimatedCost: '3000-8000 тенге',
    tips: [
      'Лучше планировать на выходные',
      'В парке можно остановиться на ночь',
      'Захватите теплую одежду'
    ],
    highlights: [
      'Великая сибирская река Иртыш',
      'Первый национальный парк Казахстана',
      'Уникальные природные ландшафты'
    ]
  }
];

// Стили остаются прежними
const typography = {
  headings: {
    fontFamily: 'Playfair Display',
    fontSize: { h1: 32, h2: 24, h3: 20 }
  },
  body: {
    fontFamily: 'Lora',
    fontSize: 16,
    lineHeight: 24
  }
}; 