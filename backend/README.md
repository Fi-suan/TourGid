# TourGid Backend

Простой backend-сервер для приложения TourGid Kazakhstan.

## Быстрый старт

### 1. Установка зависимостей
```bash
cd backend
npm install
```

### 2. Настройка переменных окружения
Создайте файл `.env` на основе `env.example`:
```bash
cp env.example .env
```

Отредактируйте `.env` и добавьте свои API ключи.

### 3. Запуск сервера

**Development (с auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Сервер запустится на `http://localhost:3000`

## Endpoints

### Health Check
- `GET /health` - проверка состояния сервера

### API
- `GET /api/regions` - список регионов
- `GET /api/attractions?regionId=xxx&category=xxx` - достопримечательности
- `GET /api/routes?regionId=xxx` - маршруты
- `POST /api/ai/process` - обработка AI запросов
- `POST /api/analytics` - аналитика

## Деплой

### На Render.com (бесплатно)
1. Создайте аккаунт на [render.com](https://render.com)
2. Подключите GitHub репозиторий
3. Выберите "New Web Service"
4. Укажите:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
5. Добавьте переменные окружения из `.env`

### На Railway.app (бесплатно)
1. Создайте аккаунт на [railway.app](https://railway.app)
2. "New Project" → "Deploy from GitHub repo"
3. Выберите репозиторий
4. Railway автоматически определит Node.js проект
5. Добавьте переменные окружения

### На Vercel (для serverless)
1. Установите Vercel CLI: `npm i -g vercel`
2. В папке backend выполните: `vercel`
3. Следуйте инструкциям

## Структура

```
backend/
├── server.js       # Основной файл сервера
├── package.json    # Зависимости
├── env.example     # Пример переменных окружения
└── README.md       # Эта документация
```

## TODO
- [ ] Добавить базу данных (MongoDB/PostgreSQL)
- [ ] Реализовать аутентификацию пользователей
- [ ] Добавить кэширование (Redis)
- [ ] Расширить API endpoints
- [ ] Добавить rate limiting
- [ ] Настроить логирование (Winston)

