import { StyleSheet } from 'react-native';

export const REGIONS = [
  {
    id: 'pavlodar',
    name: 'Павлодарская область',
    nameEn: 'Pavlodar Region',
    nameKz: 'Павлодар облысы',
    region: 'north',
    coordinates: { latitude: 52.3000, longitude: 76.9500 },
    description: 'Промышленный и культурный центр Северного Казахстана на берегу Иртыша',
    population: '750,000',
    founded: '1720 (как форпост Коряковский)',
    climate: 'Резко континентальный',
    mainCity: 'Павлодар',
    attractions_count: 13
  },
  {
    id: 'ust-kamenogorsk',
    name: 'Восточно-Казахстанская область',
    nameEn: 'East Kazakhstan Region',
    nameKz: 'Шығыс Қазақстан облысы',
    region: 'east',
    coordinates: { latitude: 49.9481, longitude: 82.6283 },
    description: 'Горный регион на границе с Алтаем, богатый природными красотами и культурным наследием',
    population: '330,000',
    founded: '1720 (Усть-Каменная крепость)',
    climate: 'Резко континентальный',
    mainCity: 'Усть-Каменогорск',
    attractions_count: 12
  },
  {
    id: 'shymkent',
    name: 'Шымкент',
    nameEn: 'Shymkent',
    nameKz: 'Шымкент',
    region: 'south',
    coordinates: { latitude: 42.3417, longitude: 69.5901 },
    description: 'Третий по величине город Казахстана на древнем Великом Шелковом пути',
    population: '1,000,000',
    founded: 'XII век (крепость Чимкент)',
    climate: 'Умеренно континентальный',
    mainCity: 'Шымкент',
    attractions_count: 11
  },
  {
    id: 'astana',
    name: 'Астана (Нур-Султан)',
    nameEn: 'Astana (Nur-Sultan)',
    nameKz: 'Астана (Нұр-Сұлтан)',
    region: 'central',
    coordinates: { latitude: 51.1694, longitude: 71.4491 },
    description: 'Столица Казахстана с ультрасовременной архитектурой и динамичным развитием',
    population: '1,200,000',
    founded: '1830 (Акмолинск), столица с 1997',
    climate: 'Резко континентальный',
    mainCity: 'Астана',
    attractions_count: 13
  },
  {
    id: 'aktau',
    name: 'Мангистауская область',
    nameEn: 'Mangystau Region',
    nameKz: 'Маңғыстау облысы',
    region: 'west',
    coordinates: { latitude: 43.6502, longitude: 51.1601 },
    description: 'Уникальный регион на побережье Каспийского моря с марсианскими пейзажами',
    population: '200,000',
    founded: '1963 (атомный город Шевченко)',
    climate: 'Пустынный',
    mainCity: 'Актау',
    attractions_count: 10
  }
];

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
    categories: ['nature', 'architecture', 'culture'],
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
    categories: ['culture', 'history', 'architecture'],
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
    categories: ['history', 'culture', 'architecture'],
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
    categories: ['culture', 'history', 'architecture'],
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
    categories: ['culture', 'history', 'architecture'],
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
    categories: ['nature', 'culture', 'history'],
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
    categories: ['nature', 'history', 'culture'],
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
    categories: ['nature', 'history', 'architecture'],
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
    categories: ['nature', 'culture', 'history'],
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
    categories: ['history', 'culture', 'architecture'],
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
  },

  // ========== УСТЬ-КАМЕНОГОРСК (Восточный Казахстан) ==========
  {
    id: 'usk001',
    name: 'attractions.abdullinMuseum.name',
    description: 'attractions.abdullinMuseum.description',
    location: 'ул. Кабанбай батыра, 98',
    regionId: 'ust-kamenogorsk',
    image: require('../assets/pavlodar/pavlodar-museum.jpg'), // TODO: заменить на реальное фото
    categories: ['culture', 'architecture', 'history'],
    workingHours: { 
      weekdays: '10:00 - 18:00', 
      weekend: '10:00 - 17:00', 
      dayOff: 'Понедельник' 
    },
    contacts: { 
      phone: '+7 (7232) 26-26-74', 
      address: 'ул. Кабанбай батыра, 98'
    },
    coordinates: { latitude: 49.9545, longitude: 82.6057 },
    historicalInfo: 'Основан в 1985 году. Назван в честь братьев Абдуллиных - известных художников Казахстана.',
    tips: [
      'Богатая коллекция казахстанского искусства',
      'Регулярные временные выставки',
      'Доступна экскурсия с гидом'
    ],
    rating: 4.5,
    visitDuration: '1-2 часа',
    bestTimeToVisit: 'В выходные дни',
    accessibility: 'Доступен для людей с ограниченными возможностями'
  },
  {
    id: 'usk002',
    name: 'attractions.jasytarPark.name',
    description: 'attractions.jasytarPark.description',
    location: 'пр. Абая',
    regionId: 'ust-kamenogorsk',
    image: require('../assets/pavlodar/pavlodar-museum.jpg'),
    categories: ['nature', 'architecture', 'culture'],
    workingHours: { 
      weekdays: '09:00 - 23:00', 
      weekend: '09:00 - 23:00', 
      dayOff: null 
    },
    contacts: { 
      phone: '+7 (7232) 50-55-55', 
      address: 'пр. Абая'
    },
    coordinates: { latitude: 49.9580, longitude: 82.6200 },
    historicalInfo: 'Центральный парк города, место отдыха и развлечений для всей семьи.',
    tips: [
      'Аттракционы для детей и взрослых',
      'Красивые аллеи для прогулок',
      'Летом работает фонтан'
    ],
    rating: 4.3,
    visitDuration: '2-3 часа',
    bestTimeToVisit: 'Летом и осенью',
    accessibility: 'Полностью доступен'
  },
  {
    id: 'usk003',
    name: 'attractions.svyatoTroitskyMonastery.name',
    description: 'attractions.svyatoTroitskyMonastery.description',
    location: 'ул. Казахстан, 65',
    regionId: 'ust-kamenogorsk',
    image: require('../assets/pavlodar/pavlodar-museum.jpg'),
    categories: ['religion', 'architecture', 'history'],
    workingHours: { 
      weekdays: '07:00 - 19:00', 
      weekend: '07:00 - 19:00', 
      dayOff: null 
    },
    contacts: { 
      phone: '+7 (7232) 56-78-90', 
      address: 'ул. Казахстан, 65'
    },
    coordinates: { latitude: 49.9380, longitude: 82.6150 },
    historicalInfo: 'Основан в XIX веке. Один из старейших православных монастырей Восточного Казахстана.',
    tips: [
      'Красивая архитектура',
      'Соблюдайте тишину при посещении',
      'Можно посетить службу'
    ],
    rating: 4.6,
    visitDuration: '1 час',
    bestTimeToVisit: 'Утром',
    accessibility: 'Частично доступен'
  },
  {
    id: 'usk004',
    name: 'attractions.bukhtarmaReservoir.name',
    description: 'attractions.bukhtarmaReservoir.description',
    location: '40 км от Усть-Каменогорска',
    regionId: 'ust-kamenogorsk',
    image: require('../assets/pavlodar/pavlodar-museum.jpg'),
    categories: ['nature', 'history', 'architecture'],
    workingHours: { 
      weekdays: '24/7', 
      weekend: '24/7', 
      dayOff: null 
    },
    contacts: { 
      phone: null, 
      address: 'Бухтарминское водохранилище'
    },
    coordinates: { latitude: 49.7500, longitude: 83.3000 },
    historicalInfo: 'Создано в 1960 году при строительстве Бухтарминской ГЭС. Одно из крупнейших водохранилищ Казахстана.',
    tips: [
      'Отличное место для рыбалки',
      'Можно арендовать лодку',
      'Живописные виды на горы'
    ],
    rating: 4.7,
    visitDuration: '4-8 часов',
    bestTimeToVisit: 'Летом',
    accessibility: 'Требуется транспорт'
  },
  {
    id: 'usk005',
    name: 'attractions.irtyshEmbankmentUsk.name',
    description: 'attractions.irtyshEmbankmentUsk.description',
    location: 'Набережная Иртыша',
    regionId: 'ust-kamenogorsk',
    image: require('../assets/pavlodar/pavlodar-museum.jpg'),
    categories: ['nature', 'culture', 'architecture'],
    workingHours: { 
      weekdays: '24/7', 
      weekend: '24/7', 
      dayOff: null 
    },
    contacts: { 
      phone: null, 
      address: 'Набережная Иртыша'
    },
    coordinates: { latitude: 49.9500, longitude: 82.6150 },
    historicalInfo: 'Благоустроенная набережная вдоль реки Иртыш - популярное место для прогулок.',
    tips: [
      'Красивые закаты',
      'Велосипедные дорожки',
      'Кафе и зоны отдыха'
    ],
    rating: 4.4,
    visitDuration: '1-2 часа',
    bestTimeToVisit: 'Вечером',
    accessibility: 'Полностью доступна'
  },

  // ========== ШЫМКЕНТ (Южный Казахстан) ==========
  {
    id: 'shm001',
    name: 'attractions.abayParkShymkent.name',
    description: 'attractions.abayParkShymkent.description',
    location: 'ул. Тауке хана',
    regionId: 'shymkent',
    image: require('../assets/pavlodar/pavlodar-museum.jpg'),
    categories: ['nature', 'architecture', 'culture'],
    workingHours: { 
      weekdays: '08:00 - 23:00', 
      weekend: '08:00 - 23:00', 
      dayOff: null 
    },
    contacts: { 
      phone: '+7 (7252) 39-40-50', 
      address: 'ул. Тауке хана'
    },
    coordinates: { latitude: 42.3150, longitude: 69.5950 },
    historicalInfo: 'Крупнейший парк Шымкента, основан в середине XX века. Включает зоопарк и ботанический сад.',
    tips: [
      'Большой зоопарк с разнообразием животных',
      'Аттракционы для детей',
      'Красивое озеро с лебедями'
    ],
    rating: 4.6,
    visitDuration: '3-4 часа',
    bestTimeToVisit: 'Весной и летом',
    accessibility: 'Полностью доступен'
  },
  {
    id: 'shm002',
    name: 'attractions.karavanSaraiMuseum.name',
    description: 'attractions.karavanSaraiMuseum.description',
    location: 'ул. Байтурсынова, 2',
    regionId: 'shymkent',
    image: require('../assets/pavlodar/pavlodar-museum.jpg'),
    categories: ['history', 'culture', 'architecture'],
    workingHours: { 
      weekdays: '09:00 - 18:00', 
      weekend: '10:00 - 17:00', 
      dayOff: 'Понедельник' 
    },
    contacts: { 
      phone: '+7 (7252) 53-54-55', 
      address: 'ул. Байтурсынова, 2'
    },
    coordinates: { latitude: 42.3180, longitude: 69.5870 },
    historicalInfo: 'Музей-комплекс, посвященный истории Великого Шелкового пути и роли Шымкента как торгового центра.',
    tips: [
      'Уникальная коллекция артефактов',
      'Экскурсии на трех языках',
      'Сувенирная лавка с традиционными изделиями'
    ],
    rating: 4.5,
    visitDuration: '1-2 часа',
    bestTimeToVisit: 'В будние дни',
    accessibility: 'Доступен для людей с ограниченными возможностями'
  },
  {
    id: 'shm003',
    name: 'attractions.nurAstanaMosqueShymkent.name',
    description: 'attractions.nurAstanaMosqueShymkent.description',
    location: 'ул. Тулебаева, 12',
    regionId: 'shymkent',
    image: require('../assets/pavlodar/pavlodar-museum.jpg'),
    categories: ['religion', 'architecture', 'culture'],
    workingHours: { 
      weekdays: '05:00 - 22:00', 
      weekend: '05:00 - 22:00', 
      dayOff: null 
    },
    contacts: { 
      phone: '+7 (7252) 40-41-42', 
      address: 'ул. Тулебаева, 12'
    },
    coordinates: { latitude: 42.3280, longitude: 69.6100 },
    historicalInfo: 'Современная мечеть, построенная в начале XXI века. Один из крупнейших духовных центров Южного Казахстана.',
    tips: [
      'Великолепная современная архитектура',
      'Соблюдайте дресс-код',
      'Вход свободный'
    ],
    rating: 4.7,
    visitDuration: '30-45 минут',
    bestTimeToVisit: 'После полуденной молитвы',
    accessibility: 'Полностью доступна'
  },
  {
    id: 'shm004',
    name: 'attractions.karatauMountain.name',
    description: 'attractions.karatauMountain.description',
    location: '20 км от Шымкента',
    regionId: 'shymkent',
    image: require('../assets/pavlodar/pavlodar-museum.jpg'),
    categories: ['nature', 'history', 'culture'],
    workingHours: { 
      weekdays: '24/7', 
      weekend: '24/7', 
      dayOff: null 
    },
    contacts: { 
      phone: null, 
      address: 'хребет Каратау'
    },
    coordinates: { latitude: 42.5000, longitude: 69.7000 },
    historicalInfo: 'Горный хребет длиной около 420 км. Название означает "Черные горы" на казахском языке.',
    tips: [
      'Отличные треккинг-маршруты',
      'Захватите воду и снаряжение',
      'Лучше ехать с группой'
    ],
    rating: 4.8,
    visitDuration: '4-6 часов',
    bestTimeToVisit: 'Весной и осенью',
    accessibility: 'Требуется хорошая физическая подготовка'
  },
  {
    id: 'shm005',
    name: 'attractions.kentauCanyons.name',
    description: 'attractions.kentauCanyons.description',
    location: '40 км от Шымкента, Толебийский район',
    regionId: 'shymkent',
    image: require('../assets/pavlodar/pavlodar-museum.jpg'),
    categories: ['nature', 'architecture', 'history'],
    workingHours: { 
      weekdays: '24/7', 
      weekend: '24/7', 
      dayOff: null 
    },
    contacts: { 
      phone: null, 
      address: 'Толебийский район'
    },
    coordinates: { latitude: 42.2000, longitude: 69.4000 },
    historicalInfo: 'Живописные каньоны с красными скалами, популярное место для пеших походов и фотосессий.',
    tips: [
      'Берите удобную обувь',
      'Лучше приезжать на рассвете или закате',
      'Захватите еду и воду'
    ],
    rating: 4.6,
    visitDuration: '3-5 часов',
    bestTimeToVisit: 'Весной и осенью',
    accessibility: 'Требуется транспорт и физическая подготовка'
  },

  // ========== АСТАНА (Центральный Казахстан) ==========
  {
    id: 'ast001',
    name: 'attractions.baiterek.name',
    description: 'attractions.baiterek.description',
    location: 'проспект Нұрлы жол, 11',
    regionId: 'astana',
    image: require('../assets/pavlodar/pavlodar-museum.jpg'),
    categories: ['architecture', 'culture', 'nature'],
    workingHours: { 
      weekdays: '10:00 - 21:00', 
      weekend: '10:00 - 21:00', 
      dayOff: null 
    },
    contacts: { 
      phone: '+7 (7172) 44-46-93', 
      address: 'проспект Нұрлы жол, 11'
    },
    coordinates: { latitude: 51.1282, longitude: 71.4306 },
    historicalInfo: 'Открыт в 2002 году. Высота 105 метров. Символизирует древо жизни из казахских легенд.',
    tips: [
      'Панорамный вид на весь город',
      'Отпечаток руки Президента на смотровой площадке',
      'Лучшие фото на закате'
    ],
    rating: 4.9,
    visitDuration: '1 час',
    bestTimeToVisit: 'Вечером',
    accessibility: 'Полностью доступен'
  },
  {
    id: 'ast002',
    name: 'attractions.hazretSultanMosque.name',
    description: 'attractions.hazretSultanMosque.description',
    location: 'проспект Тәуелсіздік, 54',
    regionId: 'astana',
    image: require('../assets/pavlodar/pavlodar-museum.jpg'),
    categories: ['religion', 'architecture', 'culture'],
    workingHours: { 
      weekdays: '05:00 - 22:00', 
      weekend: '05:00 - 22:00', 
      dayOff: null 
    },
    contacts: { 
      phone: '+7 (7172) 24-41-77', 
      address: 'проспект Тәуелсіздік, 54'
    },
    coordinates: { latitude: 51.1330, longitude: 71.4650 },
    historicalInfo: 'Открыта в 2012 году. Одна из крупнейших мечетей в Центральной Азии, вмещает до 10,000 человек.',
    tips: [
      'Грандиозная архитектура',
      'Бесплатный вход',
      'Экскурсии на нескольких языках'
    ],
    rating: 4.9,
    visitDuration: '45 минут',
    bestTimeToVisit: 'После полудня',
    accessibility: 'Полностью доступна'
  },
  {
    id: 'ast003',
    name: 'attractions.palaceOfPeace.name',
    description: 'attractions.palaceOfPeace.description',
    location: 'проспект Тәуелсіздік, 57',
    regionId: 'astana',
    image: require('../assets/pavlodar/pavlodar-museum.jpg'),
    categories: ['architecture', 'culture', 'history'],
    workingHours: { 
      weekdays: '10:00 - 19:00', 
      weekend: '10:00 - 19:00', 
      dayOff: 'Понедельник' 
    },
    contacts: { 
      phone: '+7 (7172) 74-44-44', 
      address: 'проспект Тәуелсіздік, 57'
    },
    coordinates: { latitude: 51.1270, longitude: 71.4690 },
    historicalInfo: 'Построен в 2006 году по проекту британского архитектора Нормана Фостера. Высота 62 метра.',
    tips: [
      'Уникальная пирамидальная конструкция',
      'Концертный зал внутри',
      'Витражи работы Брайана Кларка'
    ],
    rating: 4.8,
    visitDuration: '1-1.5 часа',
    bestTimeToVisit: 'Днем',
    accessibility: 'Полностью доступен'
  },
  {
    id: 'ast004',
    name: 'attractions.khanShatyr.name',
    description: 'attractions.khanShatyr.description',
    location: 'проспект Түркістан, 37',
    regionId: 'astana',
    image: require('../assets/pavlodar/pavlodar-museum.jpg'),
    categories: ['culture', 'history', 'architecture'],
    workingHours: { 
      weekdays: '10:00 - 22:00', 
      weekend: '10:00 - 22:00', 
      dayOff: null 
    },
    contacts: { 
      phone: '+7 (7172) 55-88-88', 
      address: 'проспект Түркістан, 37'
    },
    coordinates: { latitude: 51.1328, longitude: 71.4045 },
    historicalInfo: 'Открыт в 2010 году. Крупнейший шатер в мире, проект Нормана Фостера. Высота 150 метров.',
    tips: [
      'Торговый центр внутри',
      'Пляж и аквапарк Sky Beach',
      'Рестораны и кинотеатры'
    ],
    rating: 4.7,
    visitDuration: '2-4 часа',
    bestTimeToVisit: 'В любое время',
    accessibility: 'Полностью доступен'
  },
  {
    id: 'ast005',
    name: 'attractions.nationalMuseumKz.name',
    description: 'attractions.nationalMuseumKz.description',
    location: 'площадь Независимости, 54',
    regionId: 'astana',
    image: require('../assets/pavlodar/pavlodar-museum.jpg'),
    categories: ['history', 'culture', 'architecture'],
    workingHours: { 
      weekdays: '10:00 - 19:00', 
      weekend: '10:00 - 19:00', 
      dayOff: 'Понедельник' 
    },
    contacts: { 
      phone: '+7 (7172) 91-98-88', 
      address: 'площадь Независимости, 54',
      website: 'nationalmuseum.kz'
    },
    coordinates: { latitude: 51.1310, longitude: 71.4690 },
    historicalInfo: 'Открыт в 2014 году. Крупнейший музей Казахстана и Центральной Азии.',
    tips: [
      'Богатейшая коллекция артефактов',
      'Интерактивные экспозиции',
      'Аудиогид на нескольких языках'
    ],
    rating: 4.8,
    visitDuration: '2-3 часа',
    bestTimeToVisit: 'В будние дни',
    accessibility: 'Полностью доступен'
  },

  // ========== АКТАУ (Западный Казахстан) ==========
  {
    id: 'akt001',
    name: 'attractions.beketAtaMosque.name',
    description: 'attractions.beketAtaMosque.description',
    location: '80 км от Актау, урочище Огланды',
    regionId: 'aktau',
    image: require('../assets/pavlodar/pavlodar-museum.jpg'),
    categories: ['religion', 'history', 'culture'],
    workingHours: { 
      weekdays: '24/7', 
      weekend: '24/7', 
      dayOff: null 
    },
    contacts: { 
      phone: null, 
      address: 'урочище Огланды'
    },
    coordinates: { latitude: 43.3500, longitude: 51.5500 },
    historicalInfo: 'Подземная мечеть XVIII-XIX веков. Место паломничества, посвященное Бекет-Ате - суфийскому святому.',
    tips: [
      'Священное место для мусульман',
      'Нужен полноприводный автомобиль',
      'Захватите фонарик для спуска'
    ],
    rating: 4.9,
    visitDuration: '2-3 часа',
    bestTimeToVisit: 'Весной и осенью',
    accessibility: 'Требуется транспорт и физическая подготовка'
  },
  {
    id: 'akt002',
    name: 'attractions.boszhiraCanyon.name',
    description: 'attractions.boszhiraCanyon.description',
    location: '300 км от Актау, плато Устюрт',
    regionId: 'aktau',
    image: require('../assets/pavlodar/pavlodar-museum.jpg'),
    categories: ['nature', 'history', 'culture'],
    workingHours: { 
      weekdays: '24/7', 
      weekend: '24/7', 
      dayOff: null 
    },
    contacts: { 
      phone: null, 
      address: 'плато Устюрт'
    },
    coordinates: { latitude: 43.7000, longitude: 53.0500 },
    historicalInfo: 'Марсианский пейзаж с белыми скалами-останцами. Древнее дно моря Тетис.',
    tips: [
      'Берите гида - легко заблудиться',
      'Незабываемые закаты',
      'Лучше ехать на 2-3 дня с палатками'
    ],
    rating: 5.0,
    visitDuration: '1-2 дня',
    bestTimeToVisit: 'Весной и осенью',
    accessibility: 'Требуется внедорожник и опытный водитель'
  },
  {
    id: 'akt003',
    name: 'attractions.sherkalaМountain.name',
    description: 'attractions.sherkalaМountain.description',
    location: '170 км от Актау',
    regionId: 'aktau',
    image: require('../assets/pavlodar/pavlodar-museum.jpg'),
    categories: ['nature', 'architecture', 'history'],
    workingHours: { 
      weekdays: '24/7', 
      weekend: '24/7', 
      dayOff: null 
    },
    contacts: { 
      phone: null, 
      address: 'гора Шеркала'
    },
    coordinates: { latitude: 43.9500, longitude: 52.5000 },
    historicalInfo: 'Гора высотой 332 метра, напоминающая юрту. Название означает "Львиная гора".',
    tips: [
      'Можно подняться на вершину',
      'Великолепные виды для фото',
      'Удобная обувь обязательна'
    ],
    rating: 4.9,
    visitDuration: '2-3 часа',
    bestTimeToVisit: 'Весной и осенью',
    accessibility: 'Требуется транспорт'
  },
  {
    id: 'akt004',
    name: 'attractions.aktauBeach.name',
    description: 'attractions.aktauBeach.description',
    location: 'Набережная Актау',
    regionId: 'aktau',
    image: require('../assets/pavlodar/pavlodar-museum.jpg'),
    categories: ['nature', 'culture', 'architecture'],
    workingHours: { 
      weekdays: '24/7', 
      weekend: '24/7', 
      dayOff: null 
    },
    contacts: { 
      phone: null, 
      address: 'Набережная Актау'
    },
    coordinates: { latitude: 43.6380, longitude: 51.1920 },
    historicalInfo: 'Пляжи вдоль побережья Каспийского моря - главная летняя достопримечательность города.',
    tips: [
      'Теплая вода летом',
      'Прокат водных видов спорта',
      'Кафе и рестораны на набережной'
    ],
    rating: 4.3,
    visitDuration: '3-6 часов',
    bestTimeToVisit: 'Летом (июнь-август)',
    accessibility: 'Полностью доступен'
  },
  {
    id: 'akt005',
    name: 'attractions.mangystauMuseum.name',
    description: 'attractions.mangystauMuseum.description',
    location: 'мкр. 15, дом 27',
    regionId: 'aktau',
    image: require('../assets/pavlodar/pavlodar-museum.jpg'),
    categories: ['history', 'culture', 'architecture'],
    workingHours: { 
      weekdays: '09:00 - 18:00', 
      weekend: '10:00 - 17:00', 
      dayOff: 'Понедельник' 
    },
    contacts: { 
      phone: '+7 (7292) 43-37-93', 
      address: 'мкр. 15, дом 27'
    },
    coordinates: { latitude: 43.6550, longitude: 51.1590 },
    historicalInfo: 'Основан в 1985 году. Содержит коллекцию по истории Мангистауской области.',
    tips: [
      'Экспозиция о древней истории региона',
      'Артефакты из некрополей',
      'Этнографическая коллекция'
    ],
    rating: 4.2,
    visitDuration: '1-1.5 часа',
    bestTimeToVisit: 'В будние дни',
    accessibility: 'Доступен для людей с ограниченными возможностями'
  }
];

export const INTERESTS = [
  { id: 'religion', name: 'interests.religion', icon: 'moon' },
  { id: 'history', name: 'interests.history', icon: 'book' },
  { id: 'culture', name: 'interests.culture', icon: 'color-palette' },
  { id: 'nature', name: 'interests.nature', icon: 'leaf' },
  { id: 'architecture', name: 'interests.architecture', icon: 'business' }
];

export const ROUTES = [
  {
    id: 'pvl_route_1',
    name: 'routes.culturalHeritageOfPavlodar.name',
    description: 'routes.culturalHeritageOfPavlodar.description',
    duration: '5-6 часов',
    difficulty: 'Средний',
    regionId: 'pavlodar',
    attractions: ['pvl004', 'pvl005', 'pvl002'], 
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
  },

  // ========== УСТЬ-КАМЕНОГОРСК ==========
  {
    id: 'usk_route_1',
    name: 'routes.culturalUstKamenogorsk.name',
    description: 'routes.culturalUstKamenogorsk.description',
    duration: '4-5 часов',
    difficulty: 'Легкий',
    regionId: 'ust-kamenogorsk',
    attractions: ['usk001', 'usk003', 'usk002'],
    recommendedTransport: 'Пешком/Общественный транспорт',
    distance: '5 км',
    estimatedCost: '500-1000 тенге',
    tips: [
      'Музей закрыт по понедельникам',
      'В монастыре соблюдайте тишину',
      'В парке можно пообедать'
    ],
    highlights: [
      'Коллекция казахстанского искусства',
      'Православное наследие региона',
      'Отдых в центральном парке'
    ]
  },
  {
    id: 'usk_route_2',
    name: 'routes.natureEastKazakhstan.name',
    description: 'routes.natureEastKazakhstan.description',
    duration: 'Полный день',
    difficulty: 'Средний',
    regionId: 'ust-kamenogorsk',
    attractions: ['usk004', 'usk005'],
    recommendedTransport: 'Автомобиль',
    distance: '80 км',
    estimatedCost: '2000-4000 тенге',
    tips: [
      'Лучше ехать летом',
      'Возьмите снасти для рыбалки',
      'Захватите еду и воду'
    ],
    highlights: [
      'Крупнейшее водохранилище региона',
      'Виды на Алтайские горы',
      'Отличная рыбалка'
    ]
  },

  // ========== ШЫМКЕНТ ==========
  {
    id: 'shm_route_1',
    name: 'routes.historicalShymkent.name',
    description: 'routes.historicalShymkent.description',
    duration: '5-6 часов',
    difficulty: 'Легкий',
    regionId: 'shymkent',
    attractions: ['shm002', 'shm001', 'shm003'],
    recommendedTransport: 'Пешком/Такси',
    distance: '7 км',
    estimatedCost: '1000-2000 тенге',
    tips: [
      'Музей закрыт по понедельникам',
      'В парке есть зоопарк',
      'Мечеть лучше посещать после обеда'
    ],
    highlights: [
      'История Великого Шелкового пути',
      'Крупнейший парк города',
      'Современная исламская архитектура'
    ]
  },
  {
    id: 'shm_route_2',
    name: 'routes.mountainsOfShymkent.name',
    description: 'routes.mountainsOfShymkent.description',
    duration: 'Полный день',
    difficulty: 'Сложный',
    regionId: 'shymkent',
    attractions: ['shm004', 'shm005'],
    recommendedTransport: 'Внедорожник',
    distance: '60 км',
    estimatedCost: '3000-6000 тенге',
    tips: [
      'Нужна физическая подготовка',
      'Берите удобную обувь и воду',
      'Лучше ехать группой'
    ],
    highlights: [
      'Горные панорамы хребта Каратау',
      'Живописные каньоны',
      'Треккинг и фотографии'
    ]
  },

  // ========== АСТАНА ==========
  {
    id: 'ast_route_1',
    name: 'routes.modernAstana.name',
    description: 'routes.modernAstana.description',
    duration: '6-7 часов',
    difficulty: 'Легкий',
    regionId: 'astana',
    attractions: ['ast001', 'ast003', 'ast004'],
    recommendedTransport: 'Пешком/Метро/Такси',
    distance: '10 км',
    estimatedCost: '2000-4000 тенге',
    tips: [
      'Байтерек лучше посещать вечером',
      'В Хан Шатыре есть аквапарк',
      'Экскурсия в Дворце Мира по записи'
    ],
    highlights: [
      'Панорамный вид с Байтерека',
      'Пирамида Нормана Фостера',
      'Крупнейший шатер в мире'
    ]
  },
  {
    id: 'ast_route_2',
    name: 'routes.spiritualAstana.name',
    description: 'routes.spiritualAstana.description',
    duration: '4-5 часов',
    difficulty: 'Легкий',
    regionId: 'astana',
    attractions: ['ast002', 'ast005'],
    recommendedTransport: 'Пешком/Такси',
    distance: '5 км',
    estimatedCost: '1000-2000 тенге',
    tips: [
      'Мечеть лучше посещать после обеда',
      'Музей закрыт по понедельникам',
      'Аудиогид в музее на разных языках'
    ],
    highlights: [
      'Крупнейшая мечеть Центральной Азии',
      'История независимого Казахстана',
      'Уникальные экспозиции'
    ]
  },
  {
    id: 'ast_route_3',
    name: 'routes.astanaInOneDay.name',
    description: 'routes.astanaInOneDay.description',
    duration: 'Полный день',
    difficulty: 'Средний',
    regionId: 'astana',
    attractions: ['ast001', 'ast002', 'ast003', 'ast004', 'ast005'],
    recommendedTransport: 'Такси/Автомобиль',
    distance: '20 км',
    estimatedCost: '5000-10000 тенге',
    tips: [
      'Начните с Байтерека утром',
      'Обед в Хан Шатыре',
      'Закончите в Национальном музее'
    ],
    highlights: [
      'Все главные символы столицы',
      'Современная и духовная архитектура',
      'История и культура Казахстана'
    ]
  },

  // ========== АКТАУ ==========
  {
    id: 'akt_route_1',
    name: 'routes.coastalAktau.name',
    description: 'routes.coastalAktau.description',
    duration: '4-5 часов',
    difficulty: 'Легкий',
    regionId: 'aktau',
    attractions: ['akt004', 'akt005'],
    recommendedTransport: 'Пешком/Такси',
    distance: '8 км',
    estimatedCost: '500-1500 тенге',
    tips: [
      'Пляж лучше посещать летом',
      'Музей закрыт по понедельникам',
      'На набережной много кафе'
    ],
    highlights: [
      'Каспийское море',
      'История Мангистау',
      'Отдых на пляже'
    ]
  },
  {
    id: 'akt_route_2',
    name: 'routes.mangystauWonders.name',
    description: 'routes.mangystauWonders.description',
    duration: '2-3 дня',
    difficulty: 'Сложный',
    regionId: 'aktau',
    attractions: ['akt001', 'akt003', 'akt002'],
    recommendedTransport: 'Внедорожник с гидом',
    distance: '600 км',
    estimatedCost: '50000-100000 тенге (с гидом и ночевками)',
    tips: [
      'Обязателен опытный гид',
      'Нужен мощный внедорожник',
      'Палатки и запас воды/еды',
      'Лучший сезон: апрель-май, сентябрь-октябрь'
    ],
    highlights: [
      'Подземная мечеть Бекет-Ата',
      'Гора Шеркала - "Львиная гора"',
      'Марсианские пейзажи Босжиры',
      'Незабываемые закаты в пустыне'
    ]
  }
];

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