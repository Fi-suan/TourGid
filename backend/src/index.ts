import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import attractionRoutes from './controllers/attractionRoutes';
import aiRoutes from './controllers/aiRoutes';
import placesRoutes from './controllers/placesRoutes';

// Явно указываем путь к .env файлу
dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('🔑 Environment variables loaded:');
console.log('  GOOGLE_API_KEY:', process.env.GOOGLE_API_KEY?.substring(0, 15) + '...');
console.log('  OPENAI_API_KEY:', process.env.OPENAI_API_KEY?.substring(0, 15) + '...');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('TourGid Backend is running!');
});

// Подключаем роуты
app.use('/api', attractionRoutes);
app.use('/api', aiRoutes);
app.use('/api', placesRoutes);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
