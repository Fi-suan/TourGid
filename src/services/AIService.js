class AIService {
  constructor() {
    this.isRecording = false;
    this.recognition = null;
    this.onError = null;
    this.setupSpeechRecognition();
  }

  setupSpeechRecognition() {
    // Проверяем поддержку браузерного Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'ru-RU';
      
      console.log('✅ Браузерный Speech Recognition доступен');
    } else {
      console.log('❌ Speech Recognition не поддерживается, будет использоваться мок');
    }
  }

  async startListening(onError) {
    this.onError = onError;
    this.isRecording = true;
    
    if (this.recognition) {
      console.log('🎤 Начинаем распознавание речи...');
      return new Promise((resolve, reject) => {
        this.recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          console.log('🎯 Распознано:', transcript);
          this.isRecording = false;
          resolve(transcript);
        };
        
        this.recognition.onerror = (event) => {
          console.error('❌ Ошибка распознавания:', event.error);
          this.isRecording = false;
          if (this.onError) this.onError(event.error);
          reject(event.error);
        };
        
        this.recognition.onend = () => {
          this.isRecording = false;
        };
        
        this.recognition.start();
      });
    } else {
      // Fallback к моку если Speech Recognition недоступен
      console.log('🎤 Мок: Начинаем "запись"...');
      return Promise.resolve();
    }
  }

  async stopListening() {
    if (!this.isRecording) {
      return null;
    }
    
    if (this.recognition) {
      console.log('🎤 Останавливаем распознавание...');
      this.recognition.stop();
      return null; // Результат будет в onresult
    } else {
      // Мок для случаев когда Speech Recognition недоступен
      this.isRecording = false;
      console.log('🎤 Мок: Останавливаем "запись"...');
      
      const mockQueries = [
        'построй маршрут до мечети Машхур Жусупа',
        'покажи музеи', 
        'найди достопримечательности рядом',
        'маршрут до набережной Иртыша',
        'покажи исторические места'
      ];
      
      const mockText = mockQueries[Math.floor(Math.random() * mockQueries.length)];
      console.log(`🎯 Мок: Распознанный текст: "${mockText}"`);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockText;
    }
  }

  async processVoiceQuery(transcribedText, currentLocation) {
    const BACKEND_URL = 'https://tourgid-backend.onrender.com';
    
    const requestData = {
      query: transcribedText,
      user_location: currentLocation || { latitude: 52.3000, longitude: 76.9500 } 
    };

    try {
      console.log('🚀 === ТЕСТ БЭКЕНДА GPT-4o ===');
      console.log(`🎯 Тестовый запрос: "${transcribedText}"`);
      console.log(`🌐 URL: ${BACKEND_URL}/api/v2/ai/process-voice`);
      console.log(`📍 Локация пользователя:`, requestData.user_location);
      console.log(`📝 Полные данные запроса:`, JSON.stringify(requestData, null, 2));
      
      console.log('⏳ Отправляем запрос...');
      const startTime = Date.now();
      
      const response = await fetch(`${BACKEND_URL}/api/v2/ai/process-voice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestData)
      });
      
      const endTime = Date.now();
      console.log(`⏱️ Время ответа: ${endTime - startTime}мс`);
      console.log(`📊 Status: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Ошибка HTTP:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}\nResponse: ${errorText}`);
      }

      const result = await response.json();
      console.log('📦 Ответ от бэкенда:', JSON.stringify(result, null, 2));
      
      if (result.success && result.data) {
        console.log('✅ GPT-4o успешно обработал запрос!');
        console.log(`🔧 Function: ${result.data.function}`);
        if (result.data.destination) console.log(`🎯 Destination: ${result.data.destination}`);
        if (result.data.category) console.log(`📂 Category: ${result.data.category}`);
        if (result.data.preferences) console.log(`⚙️ Preferences: ${result.data.preferences}`);
        
        return result.data;
      } else {
        console.error('❌ Бэкенд вернул неуспешный ответ:', result.error);
        throw new Error(result.error || 'Backend returned an unsuccessful response without an error message.');
      }
      
    } catch (error) {
      console.error('💥 ОШИБКА ТЕСТА:', error);
      console.error('🔍 Проверьте: 1) URL бэкенда 2) Структуру запроса 3) Работу GPT-4o');
      throw error;
    }
  }
}

export default new AIService(); 