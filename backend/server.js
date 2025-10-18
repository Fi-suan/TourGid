const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Логирование запросов
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.get('/api/regions', (req, res) => {
  // Здесь можно вернуть данные о регионах из БД или файла
  res.json({ message: 'Regions endpoint' });
});

app.get('/api/attractions', (req, res) => {
  const { regionId, category } = req.query;
  // Фильтрация достопримечательностей
  res.json({ message: 'Attractions endpoint', filters: { regionId, category } });
});

app.get('/api/routes', (req, res) => {
  const { regionId } = req.query;
  // Маршруты для региона
  res.json({ message: 'Routes endpoint', regionId });
});

// AI Processing endpoint (если нужен дополнительный слой обработки)
app.post('/api/ai/process', async (req, res) => {
  try {
    const { query, context } = req.body;
    
    // Здесь можно добавить дополнительную логику обработки
    // Например, кэширование частых запросов, аналитику и т.д.
    
    res.json({
      success: true,
      result: { responseText: 'AI processing on server' }
    });
  } catch (error) {
    console.error('AI processing error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Analytics endpoint
app.post('/api/analytics', (req, res) => {
  const { event, data } = req.body;
  // Сохранение аналитики
  console.log('Analytics:', event, data);
  res.json({ success: true });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 TourGid Backend running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;

