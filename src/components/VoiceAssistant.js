import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  Alert,
  Modal,
  Dimensions,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import TranslationService from '../services/TranslationService';
import AIService from '../services/AIService';
import { getRouteToAttraction } from '../utils/geoUtils';
import { ATTRACTIONS, INTERESTS } from '../constants/data';

const { width, height } = Dimensions.get('window');

export const VoiceAssistant = ({ 
  currentLocation, 
  attractionsData, 
  onRouteGenerated, 
  navigation,
  style 
}) => {
  const { theme } = useTheme();
  const t = (key, params) => TranslationService.translate(key, params);
  
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [responseText, setResponseText] = useState('');
  const [pulseAnim] = useState(new Animated.Value(1));

  // Pulse animation
  useEffect(() => {
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

  const handleVoiceButtonPress = async () => {
    if (isListening) {
      await stopListening();
    } else {
      await startListening();
    }
  };

  const startListening = async () => {
    try {
      setIsModalVisible(true);
      setTranscribedText('');
      setResponseText('');
      setIsListening(true);

      await AIService.startListening((error) => {
          console.error('Voice recognition error:', error);
          setIsListening(false);
          Alert.alert('Ошибка', 'Не удалось начать запись. Проверьте разрешения микрофона.');
        });
    } catch (error) {
      console.error('Failed to start listening:', error);
      setIsListening(false);
      Alert.alert('Ошибка', 'Не удалось запустить распознавание речи.');
    }
  };

  const stopListening = async () => {
    try {
      setIsListening(false);
      setIsProcessing(true);
      setResponseText('Распознавание речи...');
      
      const recognizedText = await AIService.stopListening();
      
      if (recognizedText) {
        setTranscribedText(recognizedText);
        await processQuery(recognizedText);
      } else {
         setResponseText('Не удалось распознать речь. Попробуйте еще раз.');
         setIsProcessing(false);
      }
    } catch (error) {
      console.error('Failed to stop listening:', error);
      setResponseText('Произошла ошибка при распознавании.');
      setIsProcessing(false);
    }
  };

  const processQuery = async (text) => {
    if (!text || text.trim().length === 0) {
      setIsProcessing(false);
      return;
    }

    try {
      setResponseText('Думаю...');
      const result = await AIService.processVoiceQuery(text, currentLocation);

      switch (result.function) {
        case 'build_route':
          const destinationName = result.destination;
          const destinationAttraction = attractionsData.find(
            (attr) => attr.name.toLowerCase() === destinationName.toLowerCase()
          );

          if (destinationAttraction) {
            setResponseText(`Строю маршрут к "${destinationName}"...`);
            const routeData = await getRouteToAttraction(
              currentLocation,
              destinationAttraction
            );
            if (routeData && routeData.success) {
              onRouteGenerated(routeData);
              closeModal();
            } else {
              throw new Error('Не удалось построить маршрут.');
            }
          } else {
            setResponseText(`К сожалению, я не смог найти "${destinationName}". Попробуйте другое место.`);
          }
          break;

        case 'find_attractions':
          const category = result.category;
          const interest = INTERESTS.find(
            (i) => t(i.name).toLowerCase() === category.toLowerCase()
          );

          if (interest) {
            const matchingAttractions = ATTRACTIONS.filter((a) =>
              a.categories.includes(interest.id)
            );

            if (matchingAttractions.length > 0) {
              setResponseText(`Нашел ${matchingAttractions.length} мест в категории "${category}". Показываю на карте.`);
              const attractionIds = matchingAttractions.map((a) => a.id);
              navigation.navigate('Map', { selectedAttractions: attractionIds });
              closeModal();
            } else {
              setResponseText(`В категории "${category}" ничего не найдено.`);
            }
          } else {
            setResponseText(`Категория "${category}" не найдена.`);
          }
          break;

        default:
          setResponseText(result.responseText || "Не совсем понял, повторите, пожалуйста.");
      }
    } catch (error) {
      console.error('AI processing error:', error);
      setResponseText('Произошла ошибка при обработке вашего запроса.');
    } finally {
      setIsProcessing(false);
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setTranscribedText('');
    setResponseText('');
    if (isListening) {
      AIService.stopListening().catch(e => console.error("Error stopping on close", e));
    }
  };

  const getStatusText = () => {
    if (isListening) return 'Говорите...';
    if (isProcessing) return responseText; // Show intermediate statuses
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
                  AI Помощник
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
                  Попробуйте: "Найди маршрут к мечети" или "Покажи музеи"
                </Text>
              </View>

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

              {/* Кнопка остановки записи */}
              {isListening && (
                <View style={styles.actionButtonSection}>
                  <TouchableOpacity
                    style={[styles.stopButton, { backgroundColor: '#EF4444' }]}
                    onPress={stopListening}
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
}); 
