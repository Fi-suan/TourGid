import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  Alert,
  Modal,
  Dimensions,
  ScrollView,
  Image,
  ActivityIndicator,
  Platform,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useRegion } from '../context/RegionContext';
import TranslationService from '../services/TranslationService';
import VisionService from '../services/VisionService';
import * as ApiService from '../services/ApiService';

const { width, height } = Dimensions.get('window');

export const VoiceAssistant = ({
  style 
}) => {
  const { theme } = useTheme();
  const { selectedRegionId } = useRegion();
  const navigation = useNavigation();
  const t = (key, params) => TranslationService.translate(key, params);

  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [responseText, setResponseText] = useState('');
  const [error, setError] = useState(null);
  const [pulseAnim] = useState(new Animated.Value(1));
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [volume, setVolume] = useState(0);
  const [textInput, setTextInput] = useState('');
  
  const recordingRef = useRef(null);
  const animatedVolume = useRef(new Animated.Value(0)).current;

  const [attractions, setAttractions] = useState([]);
  const [interests, setInterests] = useState([]);

  useEffect(() => {
    // Pulse animation
    if (isListening || isProcessing) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.2, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true })
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [isListening, isProcessing]);

  useEffect(() => {
    // Volume animation
    Animated.timing(animatedVolume, {
      toValue: volume,
      duration: 100,
      useNativeDriver: false,
    }).start();
  }, [volume]);

  useEffect(() => {
    // Fetch attractions and interests when the component is first used
    const fetchData = async () => {
      try {
        const [attractionsData, interestsData] = await Promise.all([
          ApiService.getAttractions(selectedRegionId),
          ApiService.getInterests()
        ]);
        setAttractions(attractionsData);
        setInterests(interestsData);
      } catch (e) {
        console.error("Failed to fetch data for Voice Assistant:", e);
        // Handle error if necessary
      }
    };
    if (isModalVisible) {
      fetchData();
    }
  }, [isModalVisible, selectedRegionId]);

  const handleVoiceButtonPress = async () => {
    if (isListening) {
      await stopListeningAndProcess();
    } else {
      await startListening();
    }
  };

  const startListening = async () => {
    try {
      setIsModalVisible(true);
      setTranscribedText('');
      setResponseText('');
      setError(null);
      setIsListening(true);
      setVolume(0);
  
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        setError(t('voiceAssistant.permissionDenied'));
        setIsListening(false);
        return;
      }
  
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
  
      const { recording } = await Audio.Recording.createAsync(
        {
          android: {
            extension: '.m4a',
            outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
            audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
            sampleRate: 16000,
            numberOfChannels: 1,
            bitRate: 128000,
          },
          ios: {
            extension: '.m4a',
            outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
            audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
            sampleRate: 16000,
            numberOfChannels: 1,
            bitRate: 128000,
          },
        },
        (status) => {
          if (status.isRecording && status.metering) {
            const normalizedVolume = Math.max(0, Math.min(1, 1 + status.metering / 40));
            setVolume(normalizedVolume);
          }
        },
        100
      );
      
      recordingRef.current = recording;
      console.log('🎤 Запись началась');
    } catch (error) {
      console.error('❌ Ошибка начала записи:', error);
      setIsListening(false);
      setIsModalVisible(false);
      setError(error.message);
      Alert.alert(t('voiceAssistant.error'), error.message || 'Unknown error');
    }
  };

  const stopListeningAndProcess = async () => {
    if (!isListening || !recordingRef.current) return;
  
    try {
      console.log('🛑 Остановка записи...');
      setIsListening(false);
      setIsProcessing(true);
      setResponseText(t('voiceAssistant.processing'));
  
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      recordingRef.current = null;
  
      if (uri) {
        console.log('📤 Отправка аудио на бэкенд...');
        const text = await ApiService.transcribeAudio(uri);
        
        if (text) {
          setTranscribedText(text);
          await processQuery(text);
        } else {
          setResponseText(t('voiceAssistant.noSpeech'));
          setIsProcessing(false);
        }
      } else {
        setResponseText(t('voiceAssistant.recordError'));
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('❌ Ошибка обработки записи:', error);
      setResponseText(t('voiceAssistant.error'));
      setError(error.message);
      setIsProcessing(false);
    }
  };

  const processQuery = async (text) => {
    if (!text || text.trim().length === 0) {
      setIsProcessing(false);
      return;
    }

    try {
      setIsProcessing(true);
      setResponseText(t('voiceAssistant.thinking'));
      
      const attractionNames = attractions.map(a => t(a.name));
      const interestNames = interests.map(i => t(i.name));

      const result = await ApiService.processQuery(text, {
        region: selectedRegionId,
        availableAttractions: attractionNames,
        categories: interestNames.join(', ')
      });

      console.log('🤖 Результат от бэкенда:', result);

      // Если команда начинается с "найти/найди", открываем страницу достопримечательности
      const textLower = text.toLowerCase();
      if ((textLower.startsWith('найти') || textLower.startsWith('найди')) && result.function === 'build_route') {
        result.function = 'show_info';
        result.name = result.destination;
      }

      switch (result.function) {
        case 'build_route':
          const destinationName = result.destination.toLowerCase();
          
          // Ищем достопримечательность с учетом перевода
          const destinationAttraction = attractions.find((attr) => {
            const translatedName = t(attr.name).toLowerCase();
            return translatedName.includes(destinationName) || destinationName.includes(translatedName);
          });

          if (destinationAttraction) {
            // Создаем динамический маршрут
            const dynamicRoute = {
              id: `ai_route_${Date.now()}`,
              name: `Маршрут к ${t(destinationAttraction.name)}`,
              description: `AI-помощник построил маршрут к достопримечательности "${t(destinationAttraction.name)}"`,
              duration: '30-60 минут',
              difficulty: 'Легкий',
              regionId: selectedRegionId,
              attractions: [destinationAttraction.id],
              recommendedTransport: 'Пешком/Такси',
              distance: 'По карте',
              estimatedCost: 'Зависит от транспорта',
              tips: [
                'Маршрут построен AI-помощником',
                'Проверьте актуальность информации перед выездом',
                'Следуйте указаниям на карте'
              ],
              highlights: [t(destinationAttraction.name)]
            };

            setResponseText(t('voiceAssistant.buildingRoute', { name: t(destinationAttraction.name) }));
            setTimeout(() => {
              navigation.navigate('RouteDetail', { 
                route: dynamicRoute,
                translatedName: dynamicRoute.name,
                translatedDescription: dynamicRoute.description
              });
              closeModal();
            }, 800);
          } else {
            setResponseText(t('voiceAssistant.attractionNotFound', { name: result.destination }) + '\n\n' + attractionNames.slice(0, 5).join('\n'));
          }
          break;

        case 'find_attractions':
          const categoryInput = result.category.toLowerCase();
          
          // Ищем категорию
          const interest = interests.find((i) => {
            const categoryName = t(i.name).toLowerCase();
            return categoryName.includes(categoryInput) || categoryInput.includes(categoryName);
          });

          if (interest) {
            const matchingAttractions = attractions.filter((a) =>
              a.categories.includes(interest.id)
            );

            if (matchingAttractions.length > 0) {
              setResponseText(t('voiceAssistant.foundAttractions', { count: matchingAttractions.length, category: t(interest.name) }));
              const attractionIds = matchingAttractions.map((a) => a.id);
              navigation.navigate('Map', { selectedAttractions: attractionIds });
              setTimeout(closeModal, 800);
            } else {
              setResponseText(t('voiceAssistant.noAttractionsInCategory', { category: t(interest.name) }));
            }
          } else {
            // Пробуем найти по ключевым словам в достопримечательностях
            const keywordMatches = attractions.filter(a => {
              const name = t(a.name).toLowerCase();
              const desc = t(a.description).toLowerCase();
              return name.includes(categoryInput) || desc.includes(categoryInput);
            });
            
            if (keywordMatches.length > 0) {
              setResponseText(`🔍 Найдено ${keywordMatches.length} мест по запросу "${result.category}"`);
              const attractionIds = keywordMatches.map((a) => a.id);
              navigation.navigate('Map', { selectedAttractions: attractionIds });
              setTimeout(closeModal, 800);
            } else {
              setResponseText(`❌ Ничего не найдено. Доступные категории:\n${interests.map(i => t(i.name)).join(', ')}`);
            }
          }
          break;

        case 'show_info':
          // Показываем информацию о достопримечательности
          const infoName = result.name.toLowerCase();
          const infoAttraction = attractions.find((attr) => {
            const translatedName = t(attr.name).toLowerCase();
            return translatedName.includes(infoName) || infoName.includes(translatedName);
          });

          if (infoAttraction) {
            setResponseText(`ℹ️ ${t(infoAttraction.name)}\n\n${t(infoAttraction.description)}`);
            // Можно перейти на страницу детальной информации
            setTimeout(() => {
              navigation.navigate('AttractionDetail', { 
                attraction: infoAttraction,
                translatedName: t(infoAttraction.name),
                translatedDescription: t(infoAttraction.description)
              });
              closeModal();
            }, 1500);
          } else {
            setResponseText(`❌ Не найдено информации о "${result.name}"`);
          }
          break;

        default:
          setResponseText(result.responseText || t('voiceAssistant.notUnderstood'));
      }
    } catch (error) {
      console.error('AI processing error:', error);
      setResponseText(t('voiceAssistant.error'));
    } finally {
      setIsProcessing(false);
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setIsListening(false);
    setIsProcessing(false);
    setTranscribedText('');
    setResponseText('');
    setSelectedImage(null);
    setError(null);
    setIsAnalyzingImage(false);
    setVolume(0);
    setTextInput('');
    
    if (recordingRef.current) {
      recordingRef.current.stopAndUnloadAsync().catch(e => {
        console.error('Ошибка остановки записи при закрытии:', e);
      });
      recordingRef.current = null;
    }
  };

  const handleTextSubmit = async () => {
    if (textInput.trim().length === 0) return;
    
    setTranscribedText(textInput);
    await processQuery(textInput);
    setTextInput('');
  };

  const handleCameraPress = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Ошибка', 'Нужно разрешение на доступ к камере');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        await analyzeImage(result.assets[0].base64);
      }
    } catch (error) {
      // console.error('Camera error:', error);
      Alert.alert('Ошибка', 'Не удалось открыть камеру');
    }
  };

  const handleGalleryPress = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Ошибка', 'Нужно разрешение на доступ к галерее');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        await analyzeImage(result.assets[0].base64);
      }
    } catch (error) {
      // console.error('Gallery error:', error);
      Alert.alert('Ошибка', 'Не удалось открыть галерею');
    }
  };

  const analyzeImage = async (base64Image) => {
    setIsAnalyzingImage(true);
    setTranscribedText(t('voiceAssistant.analyzing'));

    try {
      const visionResult = await VisionService.analyzeLandmark(base64Image);

      if (visionResult.success && visionResult.landmark) {
        const landmarkName = visionResult.landmark.name.toLowerCase();
        setTranscribedText(`✅ ${t('voiceAssistant.recognized')}: ${visionResult.landmark.name}`);

        // Ищем по английскому и русскому названию
        const foundAttraction = attractions.find(a => {
          const translatedName = t(a.name).toLowerCase();
          const translatedDesc = t(a.description).toLowerCase();
          
          // Поиск по всем языкам (ru, en, kz)
          const ruName = TranslationService.translate(a.name, {}, 'ru').toLowerCase();
          const enName = TranslationService.translate(a.name, {}, 'en').toLowerCase();
          
          return translatedName.includes(landmarkName) || 
                 landmarkName.includes(translatedName) ||
                 translatedDesc.includes(landmarkName) ||
                 ruName.includes(landmarkName) ||
                 landmarkName.includes(ruName) ||
                 enName.includes(landmarkName) ||
                 landmarkName.includes(enName);
        });

        if (foundAttraction) {
          setResponseText(`🎯 ${t('voiceAssistant.foundAttraction')}: ${t(foundAttraction.name)}`);
          setTimeout(() => {
            navigation.navigate('AttractionDetail', { 
              attraction: foundAttraction,
              translatedName: t(foundAttraction.name),
              translatedDescription: t(foundAttraction.description)
            });
            closeModal();
          }, 1500);
        } else {
          // TODO: Implement places search via backend API
          setResponseText(t('voiceAssistant.placeNotFound', { name: visionResult.landmark.name }));
          console.warn('⚠️ Vision API landmark search not implemented via backend yet');
        }
      } else {
        setResponseText(t('voiceAssistant.imageRecognitionFailed'));
      }
    } catch (error) {
      console.error('Vision analysis error:', error);
      setResponseText(t('voiceAssistant.error'));
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  const getStatusText = () => {
    if (isListening) return 'Говорите...';
    if (isProcessing) return responseText; 
    if (transcribedText) return 'Запрос распознан!';
    return 'Нажмите чтобы говорить с ИИ';
  };

  const getStatusIcon = () => {
    if (isListening) return 'radio-button-on';
    if (isProcessing) return 'sync';
    if (transcribedText) return 'checkmark-circle';
    return 'mic';
  };

  return (
    <>
      <Animated.View style={[
        styles.floatingButton,
        { transform: [{ scale: pulseAnim }] },
        style
      ]}>
        <TouchableOpacity 
          style={[
            styles.aiButton,
            { 
              backgroundColor: theme.colors.primary,
              shadowColor: theme.colors.primary
            }
          ]}
          onPress={handleVoiceButtonPress}
          activeOpacity={0.8}
        >
          <Ionicons 
            name={isListening ? "radio-button-on" : "mic"} 
            size={28} 
            color="white" 
          />
          <Text style={styles.aiButtonText}>AI</Text>
        </TouchableOpacity>
      </Animated.View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
            
            <View style={[styles.modalHeader, { borderBottomColor: theme.colors.border }]}>
              <View style={styles.headerLeft}>
                <View style={[styles.aiIndicator, { backgroundColor: theme.colors.primary }]}>
                  <Ionicons name="sparkles" size={16} color="white" />
                </View>
                <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                  {t('voiceAssistant.title')}
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={closeModal}
              >
                <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              
              <View style={styles.statusSection}>
                {isListening && (
                  <Animated.View style={[
                    styles.volumeIndicator,
                    { 
                      backgroundColor: theme.colors.primary,
                      transform: [{ scaleX: animatedVolume }]
                    }
                  ]} />
                )}

                <Animated.View style={[
                  styles.micContainer,
                  { 
                    backgroundColor: isListening || isProcessing ? theme.colors.primary : theme.colors.cardBackground,
                    borderColor: theme.colors.border,
                    transform: [{ scale: pulseAnim }]
                  }
                ]}>
                  <Ionicons 
                    name={getStatusIcon()} 
                    size={48} 
                    color={isListening || isProcessing ? "white" : theme.colors.primary} 
                  />
                </Animated.View>
                
                <Text style={[styles.statusText, { color: theme.colors.text }]}>
                  {getStatusText()}
                </Text>
                
                <Text style={[styles.hintText, { color: theme.colors.textSecondary }]}>
                  {t('voiceAssistant.hint')}
                </Text>
                
                {!isListening && !isProcessing && !isAnalyzingImage && (
                  <>
                    <View style={styles.imageButtonsContainer}>
                      <TouchableOpacity 
                        style={[styles.imageButton, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border }]}
                        onPress={handleCameraPress}
                      >
                        <Ionicons name="camera" size={24} color={theme.colors.primary} />
                        <Text style={[styles.imageButtonText, { color: theme.colors.text }]}>{t('voiceAssistant.camera')}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.imageButton, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border }]}
                        onPress={handleGalleryPress}
                      >
                        <Ionicons name="images" size={24} color={theme.colors.primary} />
                        <Text style={[styles.imageButtonText, { color: theme.colors.text }]}>{t('voiceAssistant.gallery')}</Text>
                      </TouchableOpacity>
                    </View>
                    
                    {/* Текстовый ввод */}
                    <View style={[styles.textInputContainer, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border }]}>
                      <TextInput
                        style={[styles.textInputField, { color: theme.colors.text }]}
                        placeholder="Или напишите ваш запрос..."
                        placeholderTextColor={theme.colors.textSecondary}
                        value={textInput}
                        onChangeText={setTextInput}
                        onSubmitEditing={handleTextSubmit}
                        multiline
                        maxLength={200}
                      />
                      <TouchableOpacity 
                        style={[styles.sendButton, { backgroundColor: theme.colors.primary }]}
                        onPress={handleTextSubmit}
                        disabled={textInput.trim().length === 0}
                      >
                        <Ionicons name="send" size={20} color="white" />
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>

              {selectedImage && (
                <View style={[styles.imageSection, { backgroundColor: theme.colors.cardBackground }]}>
                  <Text style={[styles.sectionLabel, { color: theme.colors.textSecondary }]}>
                    Загруженное фото:
                  </Text>
                  <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
                </View>
              )}

              {transcribedText ? (
                <View style={[styles.textSection, { backgroundColor: theme.colors.cardBackground }]}>
                  <Text style={[styles.sectionLabel, { color: theme.colors.textSecondary }]}>
                    Ваш запрос:
                  </Text>
                  <Text style={[styles.transcribedText, { color: theme.colors.text }]}>
                    "{transcribedText}"
                  </Text>
                </View>
              ) : null}

              {responseText && !isListening && !isProcessing ? (
                <View style={[styles.textSection, { backgroundColor: theme.colors.cardBackground }]}>
                  <Text style={[styles.sectionLabel, { color: theme.colors.textSecondary }]}>
                    Ответ ИИ:
                  </Text>
                  <Text style={[styles.responseText, { color: theme.colors.text }]}>
                    {responseText}
                  </Text>
                </View>
              ) : null}

              {isListening && (
                <View style={styles.actionButtonSection}>
                  <TouchableOpacity
                    style={[styles.stopButton, { backgroundColor: '#EF4444' }]}
                    onPress={stopListeningAndProcess}
                  >
                    <Ionicons name="stop" size={24} color="white" />
                    <Text style={styles.stopButtonText}>{t('voiceAssistant.stopRecording')}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    zIndex: 1000,
  },
  aiButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  aiButtonText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 2,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.8,
    minHeight: height * 0.5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    flex: 1,
    padding: 20,
  },
  statusSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  micContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  hintText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  textSection: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  transcribedText: {
    fontSize: 16,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  responseText: {
    fontSize: 16,
    lineHeight: 24,
  },
  actionButtonSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  stopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  stopButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  imageButtonsContainer: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 12,
  },
  imageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
  },
  imageButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  imageSection: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 8,
    resizeMode: 'cover',
  },
  volumeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 4,
    width: '100%',
    borderRadius: 2,
    opacity: 0.7,
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  textInputField: {
    flex: 1,
    fontSize: 15,
    maxHeight: 100,
    minHeight: 40,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
}); 
