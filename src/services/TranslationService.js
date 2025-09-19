// Translation Service с Google Translate API
import GoogleAPIService from './GoogleAPIService';

class TranslationService {
  constructor() {
    this.currentLanguage = 'ru';
    this.fallbackTranslations = {
      ru: {
        'screens.home.title': 'Главная',
        'screens.map.title': 'Карта',
        'screens.routes.title': 'Маршруты',
        'screens.settings.title': 'Настройки',
        'menuItems.attractions': 'Достопримечательности',
        'menuItems.routes': 'Маршруты',
        'menuItems.map': 'Карта',
        'menuItems.settings': 'Настройки',
        'buttons.voiceAssistant': 'Голосовой помощник',
        'buttons.search': 'Поиск',
        'buttons.showRoute': 'Показать маршрут',
        'common.loading': 'Загрузка...',
        'common.error': 'Ошибка',
        'common.ok': 'ОК',
        'common.cancel': 'Отмена',
        'common.readMore': 'Подробнее',
        'interests.religion': 'Религия',
        'interests.history': 'История',
        'interests.nature': 'Природа',
        'interests.culture': 'Культура',
        'interests.architecture': 'Архитектура',
        'historicalFacts.pavlodarFoundation.title': 'Основание Павлодара',
        'historicalFacts.pavlodarFoundation.description': 'В 1720 году был основан Коряковский форпост, ставший впоследствии городом Павлодаром.',
        'historicalFacts.pavlodarFoundation.fullDescription': 'В начале XVIII века, в рамках расширения Российской империи на восток, вдоль реки Иртыш были основаны военные укрепления. Одним из таких стал Коряковский форпост, заложенный в 1720 году. Он служил важным стратегическим пунктом для защиты границ и контроля над соледобычей на Коряковских озерах. Постепенно вокруг форпоста развивалось поселение, превратившееся в торговый и административный центр региона.',
        'historicalFacts.cityStatus.title': 'Получение статуса города',
        'historicalFacts.cityStatus.description': 'В 1861 году Коряковский форпост был переименован в город Павлодар в честь новорожденного сына императора Александра II - Павла Александровича.',
        'historicalFacts.cityStatus.fullDescription': 'В середине XIX века, с ростом численности населения и развитием экономики, поселение у Коряковского форпоста получило официальный статус города. 4 апреля 1861 года оно было переименовано в Павлодар. Это событие стало важной вехой в истории города, стимулировав его дальнейшее развитие как торгового и культурного центра Прииртышья. В городе стали появляться новые здания, школы, церкви, развивалась инфраструктура.',
        'historicalFacts.virginLands.title': 'Освоение целины',
        'historicalFacts.virginLands.description': 'В середине 1950-х годов Павлодарская область стала одним из ключевых регионов освоения целинных земель, что привело к значительному развитию сельского хозяйства.',
        'historicalFacts.virginLands.fullDescription': 'В 1954-1955 годах, в рамках масштабной кампании по освоению целинных и залежных земель, в Павлодарскую область прибыли тысячи добровольцев со всего СССР. Это привело к резкому увеличению посевных площадей, строительству новых совхозов и развитию инфраструктуры. Освоение целины изменило экономический и демографический ландшафт региона, превратив его в крупного производителя зерна. Несмотря на все трудности, этот период оставил значительный след в истории области.',
        'historicalFacts.industrialDevelopment.title': 'Индустриальное развитие',
        'historicalFacts.industrialDevelopment.description': 'В 1960-1980-е годы в Павлодарской области активно развивалась промышленность, были построены крупные предприятия, такие как Павлодарский тракторный завод и алюминиевый завод.',
        'historicalFacts.industrialDevelopment.fullDescription': 'Период с 1960-х по 1980-е годы ознаменовался бурным индустриальным развитием Павлодарской области. Были введены в строй мощные промышленные гиганты: Павлодарский тракторный завод, Павлодарский алюминиевый завод, Ермаковская ГРЭС (ныне Аксуская ГРЭС), нефтеперерабатывающий завод. Эти предприятия стали основой экономики региона и обеспечили тысячи рабочих мест. Города Павлодар, Экибастуз, Аксу превратились в крупные индустриальные центры.',
        'historicalFacts.independence.title': 'Независимость Казахстана',
        'historicalFacts.independence.description': 'В 1991 году Казахстан провозгласил независимость, что открыло новую страницу в истории Павлодарской области и всей страны.',
        'historicalFacts.independence.fullDescription': 'В 1991 году, после распада Советского Союза, Казахстан обрел суверенитет. Это событие стало отправной точкой для формирования новой экономической и политической системы. Павлодарская область, как и весь Казахстан, прошла через период трансформации, адаптации к рыночной экономике и укрепления своей государственности. Несмотря на сложности переходного периода, регион сохранил свой индустриальный потенциал и продолжает развиваться.',
        'screens.attractionDetail.workingHours': 'Время работы',
        'screens.attractionDetail.weekdays': 'Будни',
        'screens.attractionDetail.weekend': 'Выходные',
        'screens.attractionDetail.dayOff': 'Выходной',
        'screens.attractionDetail.tips': 'Советы',
        'screens.attractionDetail.contacts': 'Контакты',
        'screens.attractionDetail.historicalInfo': 'Историческая справка',
        'screens.attractionDetail.bestTimeToVisit': 'Лучшее время для посещения',
        'screens.attractionDetail.accessibility': 'Доступность',
        'screens.attractionDetail.usefulInfoTitle': 'Полезная информация',
        'screens.settings.languageSection': 'Язык приложения',
        'screens.settings.themeSection': 'Тема оформления',
        'screens.settings.darkMode': 'Темная тема',
        'screens.home.searchPlaceholder': 'Поиск достопримечательностей...',
        'screens.home.readyRoutes': 'Готовые маршруты',
        'screens.home.bestRoutes': 'Лучшие маршруты по Павлодарской области',
        'screens.home.determiningLocation': '🗺️ Определяем ваше местоположение...',
        'screens.home.noAttractionsFound': 'Достопримечательности не найдены',
        'screens.home.showAllInRegion': 'Показать все места в {{regionName}}',
        'screens.historicalFacts.title': 'Исторические факты',
        'screens.historicalFacts.menuItem': 'История Павлодара',
        'screens.regionInfo.title': 'О Павлодарской области',
        'screens.regionInfo.menuItem': 'О Павлодарской области',
        'screens.regionInfo.geographyTitle': 'География',
        'regionInfo.historyTitle': 'История',
        'regionInfo.historyDescription': 'Основан в 1720 году как Коряковский форпост. В 1861 переименован в Павлодар. Активное развитие началось в 1950-х с освоением целины и строительством промышленных предприятий. В советское время стал крупным индустриальным центром Казахстана.',
        'regionInfo.cultureTitle': 'Культура',
        'regionInfo.natureTitle': 'Природа',
        'regionInfo.mainAttractionsTitle': 'Главные достопримечательности',
        'regionInfo.attraction1': '• Мечеть Машхур Жусупа - духовный центр региона',
        'regionInfo.attraction2': '• Благовещенский собор - памятник архитектуры XIX века',
        'regionInfo.attraction3': '• Набережная Иртыша - главная прогулочная зона',
        'regionInfo.attraction4': '• Баянаульский национальный парк - первый в Казахстане',
        'regionInfo.attraction5': '• Соленое озеро Маралды - природная лечебница',
        'regionInfo.attraction6': '• Дом-музей Павла Васильева - литературное наследие',
        'screens.attractionDetail.title': 'Детали достопримечательности',
        'screens.attractionDetail.getDirections': 'Проложить маршрут',
        'voiceAssistant.stopRecording': 'Остановить запись',
        'attractions.mashkhurZhusupMosque.name': 'Мечеть Машхур Жусупа',
        'attractions.mashkhurZhusupMosque.description': 'Главная соборная мечеть Павлодара, построенная в честь великого казахского просветителя',
        'attractions.blagoveshchenskyCathedral.name': 'Благовещенский собор',
        'attractions.blagoveshchenskyCathedral.description': 'Православный кафедральный собор - архитектурная жемчужина Павлодара',
        'attractions.irtyshEmbankment.name': 'Набережная реки Иртыш',
        'attractions.irtyshEmbankment.description': 'Главная прогулочная зона города с красивыми видами на реку',
        'attractions.pavelVasilievHouseMuseum.name': 'Дом-музей Павла Васильева',
        'attractions.pavelVasilievHouseMuseum.description': 'Мемориальный музей знаменитого поэта, уроженца Павлодара',
        'attractions.regionalMuseumOfLocalLore.name': 'Областной краеведческий музей',
        'attractions.regionalMuseumOfLocalLore.description': 'Главный музей региона с богатой коллекцией по истории и природе Прииртышья',
        'attractions.bayanaulNationalPark.name': 'Баянаульский национальный парк',
        'attractions.bayanaulNationalPark.description': 'Первый национальный парк Казахстана с уникальной природой',
        'attractions.chekhovTheater.name': 'Театр им. А.П. Чехова',
        'attractions.chekhovTheater.description': 'Областной русский драматический театр имени А.П. Чехова',
        'attractions.musicCollege.name': 'Музыкальный колледж',
        'attractions.musicCollege.description': 'Областной музыкальный колледж им. Курмангазы',
        'attractions.jasybaiResort.name': 'Курорт "Жасыбай"',
        'attractions.jasybaiResort.description': 'Бальнеологический курорт с минеральными источниками',
        'attractions.kyzyltauReserve.name': 'Кызылтауский заказник',
        'attractions.kyzyltauReserve.description': 'Государственный природный заказник для охраны степной фауны',
        'attractions.sabyndykolLake.name': 'Озеро Сабындыкуль',
        'attractions.sabyndykolLake.description': 'Соленое озеро с лечебными грязями и водой',
        'attractions.toktamysMausoleum.name': 'Мавзолей Токтамыша',
        'attractions.toktamysMausoleum.description': 'Исторический мавзолей XIV века, памятник золотоордынской архитектуры',
        'attractions.myrzashoky.name': 'Мырзашокы',
        'attractions.myrzashoky.description': 'Древнее городище, археологический памятник X-XIV веков',
        'screens.routes.title': 'Маршруты',
        'routes.culturalHeritageOfPavlodar.name': 'Культурное наследие Павлодара',
        'routes.culturalHeritageOfPavlodar.description': 'Музеи и исторические места Павлодара',
        'routes.natureOfIrtyshRegion.name': 'Природа Прииртышья',
        'routes.natureOfIrtyshRegion.description': 'Набережная Иртыша и Баянаульский парк',
        'screens.routeDetail.title': 'Детали маршрута',
        'routes.attractionsTitle': 'Достопримечательности на маршруте',
        'routes.tipsTitle': 'Советы по прохождению',
        'routes.startRouteButton': 'Начать маршрут',
        'difficulty.легкий': 'Легкий',
        'difficulty.средний': 'Средний',
        'difficulty.сложный': 'Сложный',
        'transport.пешком_автобус': 'Пешком/Автобус',
        'transport.автомобиль': 'Автомобиль',
        'common.menu': 'Меню',
        'common.showOnMap': 'Показать на карте',
        'common.details': 'Детали',
        'common.reviews': 'отзывов',
        'common.reviewsTitle': 'Отзывы из Google',
        'common.photos': 'Фото из Google',
        'regionInfo.description': 'Павлодарская область расположена на северо-востоке Казахстана, на реке Иртыш. Это один из крупнейших индустриальных и сельскохозяйственных регионов страны.',
        'regionInfo.population': 'Население: ~750 000 человек',
        'regionInfo.climate': 'Климат: резко континентальный, с жарким летом и суровой зимой',
        'regionInfo.economy': 'Экономика: развитая промышленность (энергетика, машиностроение, нефтехимия), сельское хозяйство (зерновые, животноводство)',
        'regionInfo.geography': 'Область характеризуется степными ландшафтами, крупной рекой Иртыш, многочисленными озерами (например, Баянаульские озера, Маралды) и сосновыми борами. Рельеф преимущественно равнинный.',
        'regionInfo.culture': 'Богатое культурное наследие, связанное с историей казахского народа и освоением целины. Множество музеев, театров и памятников. Ежегодно проводятся национальные праздники и фестивали.',
        'regionInfo.nature': 'На территории области расположен Баянаульский национальный парк - уникальный уголок природы с живописными скалами, озерами и лесами, привлекающий туристов своей красотой и возможностями для активного отдыха.',
        'regionInfo.links': 'Полезные ссылки',
        'regionInfo.officialSite': 'Официальный сайт акимата Павлодарской области',
        'regionInfo.touristPortal': 'Туристический портал Казахстана',
        'regionInfo.map': 'Карта Павлодара (2GIS)',
        'interests.recreation': 'Отдых',
        'interests.entertainment': 'Развлечения',
        'interests.scenic': 'Живописные места',
        'interests.unique': 'Уникальные места',
        'interests.adventure': 'Приключения',
        'interests.shopping': 'Шопинг',
        'interests.education': 'Образование',
        'interests.health': 'Здоровье'
      },
      en: {
        'screens.home.title': 'Home',
        'screens.map.title': 'Map',
        'screens.routes.title': 'Routes',
        'screens.settings.title': 'Settings',
        'menuItems.attractions': 'Attractions',
        'menuItems.routes': 'Routes',
        'menuItems.map': 'Map',
        'menuItems.settings': 'Settings',
        'buttons.voiceAssistant': 'Voice Assistant',
        'buttons.search': 'Search',
        'buttons.showRoute': 'Show Route',
        'common.loading': 'Loading...',
        'common.error': 'Error',
        'common.ok': 'OK',
        'common.cancel': 'Cancel',
        'common.readMore': 'Read More',
        'interests.religion': 'Religion',
        'interests.history': 'History',
        'interests.nature': 'Nature',
        'interests.culture': 'Culture',
        'interests.architecture': 'Architecture',
        'historicalFacts.pavlodarFoundation.title': 'Foundation of Pavlodar',
        'historicalFacts.pavlodarFoundation.description': 'In 1720, Koryakovsky outpost was founded, which later became the city of Pavlodar.',
        'historicalFacts.pavlodarFoundation.fullDescription': 'In the early 18th century, as part of the expansion of the Russian Empire to the east, military fortifications were established along the Irtysh River. One of these was the Koryakovsky outpost, founded in 1720. It served as an important strategic point for border defense and control over salt mining in the Koryakovsky lakes. Gradually, a settlement developed around the outpost, turning into a trade and administrative center of the region.',
        'historicalFacts.cityStatus.title': 'Receiving city status',
        'historicalFacts.cityStatus.description': 'In 1861, Koryakovsky outpost was renamed Pavlodar in honor of the newborn son of Emperor Alexander II - Pavel Alexandrovich.',
        'historicalFacts.cityStatus.fullDescription': 'In the mid-19th century, with the growth of the population and economic development, the settlement near the Koryakovsky outpost received official city status. On April 4, 1861, it was renamed Pavlodar. This event became an important milestone in the history of the city, stimulating its further development as a trade and cultural center of the Irtysh region. New buildings, schools, churches appeared in the city, and infrastructure developed.',
        'historicalFacts.virginLands.title': 'Development of Virgin Lands',
        'historicalFacts.virginLands.description': 'In the mid-1950s, Pavlodar region became one of the key regions for the development of virgin lands, which led to a significant development of agriculture.',
        'historicalFacts.virginLands.fullDescription': 'In 1954-1955, as part of a large-scale campaign to develop virgin and fallow lands, thousands of volunteers from all over the USSR arrived in Pavlodar region. This led to a sharp increase in cultivated areas, the construction of new state farms and the development of infrastructure. The development of virgin lands changed the economic and demographic landscape of the region, turning it into a major grain producer. Despite all the difficulties, this period left a significant mark on the history of the region.',
        'historicalFacts.industrialDevelopment.title': 'Industrial Development',
        'historicalFacts.industrialDevelopment.description': 'In the 1960s-1980s, industry actively developed in Pavlodar region, large enterprises were built, such as the Pavlodar Tractor Plant and the Aluminum Plant.',
        'historicalFacts.industrialDevelopment.fullDescription': 'The period from the 1960s to the 1980s was marked by rapid industrial development of the Pavlodar region. Powerful industrial giants were commissioned: the Pavlodar Tractor Plant, the Pavlodar Aluminum Plant, the Yermakovskaya GRES (now Aksu GRES), an oil refinery. These enterprises became the basis of the region\'s economy and provided thousands of jobs. The cities of Pavlodar, Ekibastuz, Aksu became large industrial centers.',
        'historicalFacts.independence.title': 'Independence of Kazakhstan',
        'historicalFacts.independence.description': 'In 1991, Kazakhstan declared independence, which opened a new page in the history of Pavlodar region and the entire country.',
        'historicalFacts.independence.fullDescription': 'In 1991, after the collapse of the Soviet Union, Kazakhstan gained sovereignty. This event became the starting point for the formation of a new economic and political system. Pavlodar region, like the whole of Kazakhstan, went through a period of transformation, adaptation to a market economy and strengthening its statehood. Despite the difficulties of the transition period, the region maintained its industrial potential and continues to develop.',
        'screens.attractionDetail.workingHours': 'Working Hours',
        'screens.attractionDetail.weekdays': 'Weekdays',
        'screens.attractionDetail.weekend': 'Weekend',
        'screens.attractionDetail.dayOff': 'Day Off',
        'screens.attractionDetail.tips': 'Tips',
        'screens.attractionDetail.contacts': 'Contacts',
        'screens.attractionDetail.historicalInfo': 'Historical Information',
        'screens.attractionDetail.bestTimeToVisit': 'Best Time to Visit',
        'screens.attractionDetail.accessibility': 'Accessibility',
        'screens.attractionDetail.usefulInfoTitle': 'Useful Information',
        'screens.settings.languageSection': 'App Language',
        'screens.settings.themeSection': 'Theme Settings',
        'screens.settings.darkMode': 'Dark Mode',
        'screens.home.searchPlaceholder': 'Search attractions...',
        'screens.home.readyRoutes': 'Ready Routes',
        'screens.home.bestRoutes': 'Best routes in Pavlodar region',
        'screens.home.determiningLocation': '🗺️ Determining your location...',
        'screens.home.noAttractionsFound': 'No attractions found',
        'screens.home.showAllInRegion': 'Show all places in {{regionName}}',
        'screens.historicalFacts.title': 'Historical Facts',
        'screens.historicalFacts.menuItem': 'History of Pavlodar',
        'screens.regionInfo.title': 'About Pavlodar Region',
        'screens.regionInfo.menuItem': 'About Pavlodar Region',
        'screens.regionInfo.geographyTitle': 'Geography',
        'regionInfo.historyTitle': 'History',
        'regionInfo.historyDescription': 'Founded in 1720 as Koryakovsky outpost. Renamed Pavlodar in 1861. Active development began in the 1950s with the development of virgin lands and the construction of industrial enterprises. In Soviet times, it became a major industrial center of Kazakhstan.',
        'regionInfo.cultureTitle': 'Culture',
        'regionInfo.natureTitle': 'Nature',
        'regionInfo.mainAttractionsTitle': 'Main Attractions',
        'regionInfo.attraction1': '• Meshkhur Zhusup Mosque - spiritual center of the region',
        'regionInfo.attraction2': '• Annunciation Cathedral - architectural monument of the XIX century',
        'regionInfo.attraction3': '• Irtysh embankment - main walking area',
        'regionInfo.attraction4': '• Bayanaul National Park - the first in Kazakhstan',
        'regionInfo.attraction5': '• Salt lake Maraldy - natural health resort',
        'regionInfo.attraction6': '• Pavel Vasiliev House-Museum - literary heritage',
        'screens.attractionDetail.title': 'Attraction Details',
        'screens.attractionDetail.getDirections': 'Get Directions',
        'voiceAssistant.stopRecording': 'Stop Recording',
        'attractions.mashkhurZhusupMosque.name': 'Mashkhur Zhusup Mosque',
        'attractions.mashkhurZhusupMosque.description': 'The main cathedral mosque of Pavlodar, built in honor of the great Kazakh enlightener',
        'attractions.blagoveshchenskyCathedral.name': 'Annunciation Cathedral',
        'attractions.blagoveshchenskyCathedral.description': 'Orthodox cathedral - architectural pearl of Pavlodar',
        'attractions.irtyshEmbankment.name': 'Irtysh River Embankment',
        'attractions.irtyshEmbankment.description': 'The main walking area of the city with beautiful views of the river',
        'attractions.pavelVasilievHouseMuseum.name': 'Pavel Vasiliev House-Museum',
        'attractions.pavelVasilievHouseMuseum.description': 'Memorial museum of the famous poet, a native of Pavlodar',
        'attractions.regionalMuseumOfLocalLore.name': 'Regional Museum of Local Lore',
        'attractions.regionalMuseumOfLocalLore.description': 'The main museum of the region with a rich collection on the history and nature of the Irtysh region',
        'attractions.bayanaulNationalPark.name': 'Bayanaul National Park',
        'attractions.bayanaulNationalPark.description': 'The first national park of Kazakhstan with unique nature',
        'screens.routes.title': 'Routes',
        'routes.culturalHeritageOfPavlodar.name': 'Cultural Heritage of Pavlodar',
        'routes.culturalHeritageOfPavlodar.description': 'Museums and historical sites of Pavlodar',
        'routes.natureOfIrtyshRegion.name': 'Nature of Irtysh Region',
        'routes.natureOfIrtyshRegion.description': 'Irtysh embankment and Bayanaul Park',
        'screens.routeDetail.title': 'Route Details',
        'routes.attractionsTitle': 'Attractions on the route',
        'routes.tipsTitle': 'Tips for the route',
        'routes.startRouteButton': 'Start Route',
        'difficulty.easy': 'Easy',
        'difficulty.medium': 'Medium',
        'difficulty.hard': 'Hard',
        'transport.walking_bus': 'Walking/Bus',
        'transport.car': 'Car',
        'common.menu': 'Menu',
        'common.showOnMap': 'Show on map',
        'common.details': 'Details',
        'common.reviews': 'reviews',
        'common.reviewsTitle': 'Reviews from Google',
        'common.photos': 'Photos from Google',
        'regionInfo.description': 'Pavlodar region is located in the north-east of Kazakhstan, on the Irtysh river. It is one of the largest industrial and agricultural regions of the country.',
        'regionInfo.population': 'Population: ~750,000 people',
        'regionInfo.climate': 'Climate: sharply continental, with hot summers and harsh winters',
        'regionInfo.economy': 'Economy: developed industry (energy, machine building, petrochemicals), agriculture (grain, livestock farming)',
        'regionInfo.geography': 'The region is characterized by steppe landscapes, the large Irtysh river, numerous lakes (e.g., Bayanaul lakes, Maraldy) and pine forests. The terrain is mostly flat.',
        'regionInfo.culture': 'Rich cultural heritage associated with the history of the Kazakh people and the development of virgin lands. Many museums, theaters and monuments. National holidays and festivals are held annually.',
        'regionInfo.nature': 'Bayanaul National Park is located on the territory of the region - a unique natural corner with picturesque rocks, lakes and forests, attracting tourists with its beauty and opportunities for outdoor activities.',
        'regionInfo.links': 'Useful Links',
        'regionInfo.officialSite': 'Official website of the Pavlodar region akimat',
        'regionInfo.touristPortal': 'Tourism portal of Kazakhstan',
        'regionInfo.map': 'Pavlodar Map (2GIS)',
        'interests.recreation': 'Recreation',
        'interests.entertainment': 'Entertainment',
        'interests.scenic': 'Scenic spots',
        'interests.unique': 'Unique places',
        'interests.adventure': 'Adventure',
        'interests.shopping': 'Shopping',
        'interests.education': 'Education',
        'interests.health': 'Health'
      },
      kz: {
        'screens.home.title': 'Басты бет',
        'screens.map.title': 'Карта',
        'screens.routes.title': 'Жолдар',
        'screens.settings.title': 'Баптаулар',
        'menuItems.attractions': 'Көрікті жерлер',
        'menuItems.routes': 'Жолдар',
        'menuItems.map': 'Карта',
        'menuItems.settings': 'Баптаулар',
        'buttons.voiceAssistant': 'Дауыстық көмекші',
        'buttons.search': 'Іздеу',
        'buttons.showRoute': 'Жолды көрсету',
        'common.loading': 'Жүктелуде...',
        'common.error': 'Қате',
        'common.ok': 'Жарайды',
        'common.cancel': 'Болдырмау',
        'common.readMore': 'Толығырақ',
        'interests.religion': 'Дін',
        'interests.history': 'Тарих',
        'interests.nature': 'Табиғат',
        'interests.culture': 'Мәдениет',
        'interests.architecture': 'Сәулет',
        'historicalFacts.pavlodarFoundation.title': 'Павлодар негізі',
        'historicalFacts.pavlodarFoundation.description': '1720 жылы Қоряков форпосты құрылып, кейін Павлодар қаласы болды.',
        'historicalFacts.pavlodarFoundation.fullDescription': 'XVIII ғасырдың басында, Ресей империясының шығысқа қарай кеңеюі аясында, Ертіс өзенінің бойында әскери бекіністер құрылды. Солардың бірі 1720 жылы салынған Қоряков форпосты болды. Ол шекараны қорғау және Қоряков көлдеріндегі тұз өндіруді бақылау үшін маңызды стратегиялық пункт қызметін атқарды. Бірте-бірте форпосттың айналасында елді мекен дамып, аймақтың сауда және әкімшілік орталығына айналды.',
        'historicalFacts.cityStatus.title': 'Қала мәртебесін алу',
        'historicalFacts.cityStatus.description': '1861 жылы Қоряков форпосты император II Александрдың жаңа туған ұлы Павел Александровичтің құрметіне Павлодар қаласы болып өзгертілді.',
        'historicalFacts.cityStatus.fullDescription': 'XIX ғасырдың ортасында, халық санының өсуімен және экономиканың дамуымен, Қоряков форпосты маңындағы елді мекен ресми қала мәртебесін алды. 1861 жылдың 4 сәуірінде ол Павлодар болып өзгертілді. Бұл оқиға қала тарихындағы маңызды кезең болды, оның Ертіс өңірінің сауда және мәдени орталығы ретінде одан әрі дамуына ықпал етті. Қалада жаңа ғимараттар, мектептер, шіркеулер пайда болып, инфрақұрылым дамыды.',
        'historicalFacts.virginLands.title': 'Тың жерлерді игеру',
        'historicalFacts.virginLands.description': '1950 жылдардың ортасында Павлодар облысы тың жерлерді игерудің негізгі аймақтарының біріне айналды, бұл ауыл шаруашылығының айтарлықтай дамуына әкелді.',
        'historicalFacts.virginLands.fullDescription': '1954-1955 жылдары, тың және тыңайған жерлерді игеру бойынша ауқымды науқан аясында, Павлодар облысына КСРО-ның түкпір-түкпірінен мыңдаған еріктілер келді. Бұл егіс алқаптарының күрт ұлғаюына, жаңа кеңшарлардың салынуына және инфрақұрылымның дамуына әкелді. Тың жерлерді игеру аймақтың экономикалық және демографиялық ландшафтын өзгертті, оны ірі астық өндірушіге айналдырды. Барлық қиындықтарға қарамастан, бұл кезең облыс тарихында айтарлықтай із қалдырды.',
        'historicalFacts.industrialDevelopment.title': 'Индустриалды даму',
        'historicalFacts.industrialDevelopment.description': '1960-1980 жылдары Павлодар облысында өнеркәсіп белсенді дамыды, Павлодар трактор зауыты және алюминий зауыты сияқты ірі кәсіпорындар салынды.',
        'historicalFacts.industrialDevelopment.fullDescription': '1960-шы жылдардан 1980-ші жылдарға дейінгі кезең Павлодар облысының қарқынды индустриалды дамуымен ерекшеленді. Қуатты өнеркәсіптік алыптар іске қосылды: Павлодар трактор зауыты, Павлодар алюминий зауыты, Ермак ЖЭС (қазіргі Ақсу ЖЭС), мұнай өңдеу зауыты. Бұл кәсіпорындар аймақ экономикасының негізіне айналып, мыңдаған жұмыс орындарын қамтамасыз етті. Павлодар, Екібастұз, Ақсу қалалары ірі индустриалды орталықтарға айналды.',
        'historicalFacts.independence.title': 'Қазақстан Тәуелсіздігі',
        'historicalFacts.independence.description': '1991 жылы Қазақстан Тәуелсіздігін жариялады, бұл Павлодар облысы мен бүкіл ел тарихында жаңа бет ашты.',
        'historicalFacts.independence.fullDescription': '1991 жылы, Кеңес Одағы ыдырағаннан кейін, Қазақстан егемендікке ие болды. Бұл оқиға жаңа экономикалық және саяси жүйені қалыптастырудың бастапқы нүктесі болды. Павлодар облысы, бүкіл Қазақстан сияқты, нарықтық экономикаға бейімделу және мемлекеттілігін нығайту кезеңінен өтті. Өтпелі кезеңнің қиындықтарына қарамастан, аймақ өзінің индустриалды әлеуетін сақтап қалды және дамуын жалғастыруда.',
        'screens.attractionDetail.workingHours': 'Жұмыс уақыты',
        'screens.attractionDetail.weekdays': 'Жұмыс күндері',
        'screens.attractionDetail.weekend': 'Демалыс күндері',
        'screens.attractionDetail.dayOff': 'Демалыс күні',
        'screens.attractionDetail.tips': 'Кеңестер',
        'screens.attractionDetail.contacts': 'Байланыстар',
        'screens.attractionDetail.historicalInfo': 'Тарихи ақпарат',
        'screens.attractionDetail.bestTimeToVisit': 'Келуге ең жақсы уақыт',
        'screens.attractionDetail.accessibility': 'Қол жетімділік',
        'screens.attractionDetail.usefulInfoTitle': 'Пайдалы ақпарат',
        'screens.settings.languageSection': 'Қолданба тілі',
        'screens.settings.themeSection': 'Дизайн тақырыбы',
        'screens.settings.darkMode': 'Қараңғы тақырып',
        'screens.home.searchPlaceholder': 'Көрікті жерлерді іздеу...',
        'screens.home.readyRoutes': 'Дайын маршруттар',
        'screens.home.bestRoutes': 'Павлодар облысы бойынша үздік маршруттар',
        'screens.home.determiningLocation': '🗺️ Орналасқан жеріңізді анықтау...',
        'screens.home.noAttractionsFound': 'Көрікті жерлер табылмады',
        'screens.home.showAllInRegion': '{{regionName}} қаласындағы барлық орындарды көрсету',
        'screens.historicalFacts.title': 'Тарихи фактілер',
        'screens.historicalFacts.menuItem': 'Павлодар тарихы',
        'screens.regionInfo.title': 'Павлодар облысы туралы',
        'screens.regionInfo.menuItem': 'Павлодар облысы туралы',
        'screens.regionInfo.geographyTitle': 'География',
        'regionInfo.historyTitle': 'Тарих',
        'regionInfo.historyDescription': '1720 жылы Қоряков форпосты ретінде құрылған. 1861 жылы Павлодар болып өзгертілді. Тың жерлерді игеру және өнеркәсіптік кәсіпорындар салумен 1950 жылдары қарқынды даму басталды. Кеңес уақытында Қазақстанның ірі индустриалды орталығына айналды.',
        'regionInfo.cultureTitle': 'Мәдениет',
        'regionInfo.natureTitle': 'Табиғат',
        'regionInfo.mainAttractionsTitle': 'Басты көрікті жерлер',
        'regionInfo.attraction1': '• Мәшһүр Жүсіп мешіті - аймақтың рухани орталығы',
        'regionInfo.attraction2': '• Благовещенск соборы - XIX ғасырдағы сәулет ескерткіші',
        'regionInfo.attraction3': '• Ертіс жағалауы - басты серуендеу аймағы',
        'regionInfo.attraction4': '• Баянауыл ұлттық паркі - Қазақстандағы алғашқы',
        'regionInfo.attraction5': '• Маралды тұзды көлі - табиғи емдік орын',
        'regionInfo.attraction6': '• Павел Васильевтің үй-мұражайы - әдеби мұра',
        'screens.attractionDetail.title': 'Көрікті жер туралы мәліметтер',
        'screens.attractionDetail.getDirections': 'Маршрутты құру',
        'voiceAssistant.stopRecording': 'Жазуды тоқтату',
        'attractions.mashkhurZhusupMosque.name': 'Мәшһүр Жүсіп мешіті',
        'attractions.mashkhurZhusupMosque.description': 'Павлодар қаласының басты мешіті, ұлы қазақ ағартушысының құрметіне салынған',
        'attractions.blagoveshchenskyCathedral.name': 'Благовещенск соборы',
        'attractions.blagoveshchenskyCathedral.description': 'Православ шіркеуі - Павлодардың архитектуралық інжу-маржаны',
        'attractions.irtyshEmbankment.name': 'Ертіс өзенінің жағалауы',
        'attractions.irtyshEmbankment.description': 'Өзенге әдемі көріністері бар қаланың басты серуендеу аймағы',
        'attractions.pavelVasilievHouseMuseum.name': 'Павел Васильевтің үй-мұражайы',
        'attractions.pavelVasilievHouseMuseum.description': 'Павлодар тумасы, атақты ақынның мемориалдық мұражайы',
        'attractions.regionalMuseumOfLocalLore.name': 'Облыстық өлкетану мұражайы',
        'attractions.regionalMuseumOfLocalLore.description': 'Ертіс өңірінің тарихы мен табиғаты бойынша бай коллекциясы бар аймақтың басты мұражайы',
        'attractions.bayanaulNationalPark.name': 'Баянауыл ұлттық паркі',
        'attractions.bayanaulNationalPark.description': 'Қазақстанның бірегей табиғаты бар алғашқы ұлттық паркі',
        'screens.routes.title': 'Маршруттар',
        'routes.culturalHeritageOfPavlodar.name': 'Павлодардың мәдени мұрасы',
        'routes.culturalHeritageOfPavlodar.description': 'Павлодардың мұражайлары мен тарихи орындары',
        'routes.natureOfIrtyshRegion.name': 'Ертіс өңірінің табиғаты',
        'routes.natureOfIrtyshRegion.description': 'Ертіс жағалауы және Баянауыл паркі',
        'screens.routeDetail.title': 'Маршрут мәліметтері',
        'routes.attractionsTitle': 'Маршруттағы көрікті жерлер',
        'routes.tipsTitle': 'Өту бойынша кеңестер',
        'routes.startRouteButton': 'Маршрутты бастау',
        'difficulty.жеңіл': 'Жеңіл',
        'difficulty.орташа': 'Орташа',
        'difficulty.қиын': 'Қиын',
        'transport.жаяу_автобус': 'Жаяу/Автобус',
        'transport.автокөлік': 'Автокөлік',
        'common.menu': 'Мәзір',
        'common.showOnMap': 'Картада көрсету',
        'common.details': 'Толығырақ',
        'common.reviews': 'пікір',
        'common.reviewsTitle': 'Google пікірлері',
        'common.photos': 'Google фотолары',
        'regionInfo.description': 'Павлодар облысы Қазақстанның солтүстік-шығысында, Ертіс өзенінің бойында орналасқан. Бұл елдің ең ірі өнеркәсіптік және ауылшаруашылық аймақтарының бірі.',
        'regionInfo.population': 'Халқы: ~750 000 адам',
        'regionInfo.climate': 'Климаты: қатаң континенттік, жазы ыстық, қысы қатал',
        'regionInfo.economy': 'Экономикасы: дамыған өнеркәсіп (энергетика, машина жасау, мұнай-химия), ауыл шаруашылығы (астық, мал шаруашылығы)',
        'regionInfo.geography': 'Облыс дала ландшафттарымен, ірі Ертіс өзенімен, көптеген көлдермен (мысалы, Баянауыл көлдері, Маралды) және қарағайлы ормандармен сипатталады. Жер бедері негізінен жазық.',
        'regionInfo.culture': 'Қазақ халқының тарихымен және тың игерумен байланысты бай мәдени мұра. Көптеген мұражайлар, театрлар мен ескерткіштер бар. Жыл сайын ұлттық мерекелер мен фестивальдер өткізіледі.',
        'regionInfo.nature': 'Облыс аумағында Баянауыл ұлттық паркі орналасқан - бұл табиғаттың бірегей бұрышы, әсем жартастары, көлдері мен ормандары бар, туристерді сұлулығымен және белсенді демалыс мүмкіндіктерімен тартады.',
        'regionInfo.links': 'Пайдалы сілтемелер',
        'regionInfo.officialSite': 'Павлодар облысы әкімдігінің ресми сайты',
        'regionInfo.touristPortal': 'Қазақстанның туристік порталы',
        'regionInfo.map': 'Павлодар картасы (2GIS)',
        'interests.recreation': 'Демалыс',
        'interests.entertainment': 'Ойын-сауық',
        'interests.scenic': 'Көрікті жерлер',
        'interests.unique': 'Бірегей орындар',
        'interests.adventure': 'Шытырман оқиғалар',
        'interests.shopping': 'Сауда',
        'interests.education': 'Білім',
        'interests.health': 'Денсаулық'
      }
    };
  }

  changeLanguage(language) {
    this.currentLanguage = language;
  }

  getCurrentLanguage() {
    return this.currentLanguage;
  }

  // Синхронное получение перевода из fallback. Если нет, пытаемся получить через Google Translate (асинхронно).
  translate(key, params = {}) {
    let translation = key; // По умолчанию возвращаем ключ
    let foundInFallback = false;

    // 1. Пытаемся получить перевод из текущего языка
    if (this.fallbackTranslations[this.currentLanguage] && this.fallbackTranslations[this.currentLanguage][key]) {
      translation = this.fallbackTranslations[this.currentLanguage][key];
      foundInFallback = true;
    // 2. Если нет, пытаемся получить из английского (как основной текст для перевода)
    } else if (this.fallbackTranslations.en && this.fallbackTranslations.en[key]) {
      translation = this.fallbackTranslations.en[key];
      foundInFallback = true;
    }

    // Заменяем параметры, если они есть
    if (foundInFallback) {
      Object.keys(params).forEach(param => {
        translation = translation.replace(`{{${param}}}`, params[param]);
      });
    }

    // Если перевод не найден в fallback и не является ключом по умолчанию, пробуем Google Translate
    if (!foundInFallback && key !== translation) { // Если key === translation, значит, мы не нашли его даже в EN fallback
      console.warn(`Translation for key '${key}' not found in fallback, attempting Google Translate.`);
      // Возвращаем Promise, чтобы асинхронный перевод мог разрешиться
      return new Promise(async (resolve) => {
        try {
          const translatedText = await GoogleAPIService.translateText(key, this.currentLanguage, 'auto');
          resolve(translatedText);
        } catch (error) {
          console.error('Google Translate API error:', error.message);
          resolve(key); // Возвращаем ключ при ошибке API
        }
      });
    }

    // Если перевод найден в fallback или мы просто возвращаем ключ, возвращаем его синхронно
    return translation;
  }

  // Прямой перевод текста
  async translateText(text, targetLanguage = null) {
    const language = targetLanguage || this.currentLanguage;
    
    try {
      return await GoogleAPIService.translateText(text, language);
    } catch (error) {
      console.error('Text translation error:', error.message);
      return text;
    }
  }

  // Получение списка поддерживаемых языков
  getSupportedLanguages() {
    return [
      { code: 'ru', name: 'Русский', nativeName: 'Русский' },
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'kz', name: 'Қазақша', nativeName: 'Қазақша' }
    ];
  }

  // Инициализация с API ключом
  initialize(googleApiKey) {
    GoogleAPIService.setApiKey(googleApiKey);
  }

  // Проверка доступности переводов
  async checkTranslationAvailability() {
    return await GoogleAPIService.checkAPIStatus();
  }
}

export default new TranslationService();
