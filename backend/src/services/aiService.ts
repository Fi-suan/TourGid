import fetch from 'node-fetch';

// Читаем переменные окружения динамически при каждом вызове, а не при импорте
const getGoogleApiKey = () => process.env.GOOGLE_API_KEY;
const getOpenAiApiKey = () => process.env.OPENAI_API_KEY;

export const transcribeAudio = async (audioData: string): Promise<string | null> => {
    try {
        const GOOGLE_API_KEY = getGoogleApiKey();
        
        console.log('🎤 Transcribing audio...');
        console.log('📊 Audio data length:', audioData?.length || 0);
        console.log('🔑 API Key present:', !!GOOGLE_API_KEY);
        
        if (!GOOGLE_API_KEY) {
            throw new Error('GOOGLE_API_KEY not configured in backend .env');
        }
        
        const response = await fetch(`https://speech.googleapis.com/v1/speech:recognize?key=${GOOGLE_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                config: {
                    encoding: 'MP3', // M4A/AAC можно отправить как MP3 для Google STT
                    sampleRateHertz: 16000,
                    languageCode: 'ru-RU',
                    enableAutomaticPunctuation: true,
                    alternativeLanguageCodes: ['kk-KZ', 'en-US'],
                    model: 'default', // используем базовую модель
                    useEnhanced: false,
                },
                audio: {
                    content: audioData,
                },
            }),
        });

        console.log('📡 Google STT Response status:', response.status);

        if (!response.ok) {
            const errorBody = await response.json();
            console.error('❌ Google STT API Error:', JSON.stringify(errorBody, null, 2));
            throw new Error(`Google STT API error: ${response.status} - ${JSON.stringify(errorBody)}`);
        }

        const data = await response.json();
        console.log('✅ Google STT Response:', JSON.stringify(data, null, 2));
        
        if (data.results && data.results[0]?.alternatives[0]) {
            const transcript = data.results[0].alternatives[0].transcript;
            console.log('📝 Transcribed text:', transcript);
            return transcript;
        }
        
        console.warn('⚠️ No transcription results');
        return null;

    } catch (error) {
        console.error('❌ Error in transcribeAudio service:', error);
        throw error;
    }
};

export const processTextQuery = async (text: string, context: any): Promise<any> => {
    try {
        const OPENAI_API_KEY = getOpenAiApiKey();
        
        console.log('🤖 Processing query with OpenAI...');
        console.log('📝 Query text:', text);
        console.log('🔑 OpenAI API Key present:', !!OPENAI_API_KEY);
        console.log('🔑 API Key starts with:', OPENAI_API_KEY?.substring(0, 10) || 'UNDEFINED');
        
        if (!OPENAI_API_KEY) {
            throw new Error('OPENAI_API_KEY not configured in backend .env');
        }
        
        const systemPrompt = `Ты - умный AI-помощник туристического приложения TourGid Kazakhstan.
Анализируй запросы пользователей и возвращай ТОЛЬКО валидный JSON.

КОНТЕКСТ:
- Текущий регион: ${context.region || 'не указан'}
- Доступные достопримечательности: ${context.availableAttractions || 'загрузка...'}
- Категории: ${context.categories || 'музеи, парки, природа, история, архитектура, культура, религия'}

ДОСТУПНЫЕ ФУНКЦИИ:
1. "build_route" - построить маршрут к месту
   Формат: {"function": "build_route", "destination": "точное название"}
2. "find_attractions" - найти места по категории/ключевому слову
   Формат: {"function": "find_attractions", "category": "категория"}
3. "show_info" - показать информацию о месте
   Формат: {"function": "show_info", "name": "название места"}
4. Если это общий вопрос - дай полезный ответ
   Формат: {"responseText": "твой ответ"}

ПРАВИЛА:
- Используй ТОЧНЫЕ названия из списка доступных достопримечательностей
- Всегда возвращай ТОЛЬКО JSON, без дополнительного текста.`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: text }
                ],
                temperature: 0.2,
                max_tokens: 300,
                response_format: { type: "json_object" }
            })
        });

        console.log('📡 OpenAI Response status:', response.status);
        
        if (!response.ok) {
            const errorBody = await response.json();
            console.error('❌ OpenAI API Error:', JSON.stringify(errorBody, null, 2));
            throw new Error(`OpenAI API error: ${response.status} - ${JSON.stringify(errorBody)}`);
        }

        const data = await response.json();
        console.log('✅ OpenAI Response received');
        const content = data.choices[0].message.content.trim();
        console.log('📄 AI Response:', content);
        return JSON.parse(content);

    } catch (error) {
        console.error('❌ Error in processTextQuery service:', error);
        throw error;
    }
};
