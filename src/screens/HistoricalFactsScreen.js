import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import TranslationService from '../services/TranslationService';

const HISTORICAL_FACTS = [
  // ========== ПАВЛОДАР (Северный регион) ==========
  {
    id: 'pavlodar_1',
    year: '1720',
    regionId: 'pavlodar',
    title: 'historicalFacts.pavlodarFoundation.title',
    description: 'historicalFacts.pavlodarFoundation.description',
    fullDescription: 'historicalFacts.pavlodarFoundation.fullDescription',
    image: require('../assets/historical/pavlodar-foundation.jpg')
  },
  {
    id: 'pavlodar_2',
    year: '1861',
    regionId: 'pavlodar',
    title: 'historicalFacts.cityStatus.title',
    description: 'historicalFacts.cityStatus.description',
    fullDescription: 'historicalFacts.cityStatus.fullDescription',
    image: require('../assets/historical/pavlodar-city.jpeg')
  },
  
  // ========== УСТЬ-КАМЕНОГОРСК (Восточный регион) ==========
  {
    id: 'usk_1',
    year: '1720',
    regionId: 'ust-kamenogorsk',
    title: 'historicalFacts.uskFortress.title',
    description: 'historicalFacts.uskFortress.description',
    fullDescription: 'historicalFacts.uskFortress.fullDescription',
    image: require('../assets/historical/pavlodar-foundation.jpg') // Заменить на usk-fortress.jpg
  },
  {
    id: 'usk_2',
    year: '1868',
    regionId: 'ust-kamenogorsk',
    title: 'historicalFacts.uskRegionalCenter.title',
    description: 'historicalFacts.uskRegionalCenter.description',
    fullDescription: 'historicalFacts.uskRegionalCenter.fullDescription',
    image: require('../assets/historical/pavlodar-city.jpeg') // Заменить на usk-city.jpg
  },
  
  // ========== ШЫМКЕНТ (Южный регион) ==========
  {
    id: 'shymkent_1',
    year: '1100-1200',
    regionId: 'shymkent',
    title: 'historicalFacts.shymkentOrigin.title',
    description: 'historicalFacts.shymkentOrigin.description',
    fullDescription: 'historicalFacts.shymkentOrigin.fullDescription',
    image: require('../assets/historical/pavlodar-foundation.jpg') // Заменить на shymkent-ancient.jpg
  },
  {
    id: 'shymkent_2',
    year: '2018',
    regionId: 'shymkent',
    title: 'historicalFacts.shymkentCity.title',
    description: 'historicalFacts.shymkentCity.description',
    fullDescription: 'historicalFacts.shymkentCity.fullDescription',
    image: require('../assets/historical/pavlodar-city.jpeg') // Заменить на shymkent-modern.jpg
  },
  
  // ========== АСТАНА (Центральный регион) ==========
  {
    id: 'astana_1',
    year: '1830',
    regionId: 'astana',
    title: 'historicalFacts.astanaFoundation.title',
    description: 'historicalFacts.astanaFoundation.description',
    fullDescription: 'historicalFacts.astanaFoundation.fullDescription',
    image: require('../assets/historical/pavlodar-foundation.jpg') // Заменить на astana-akmola.jpg
  },
  {
    id: 'astana_2',
    year: '1997',
    regionId: 'astana',
    title: 'historicalFacts.astanaCapital.title',
    description: 'historicalFacts.astanaCapital.description',
    fullDescription: 'historicalFacts.astanaCapital.fullDescription',
    image: require('../assets/historical/pavlodar-city.jpeg') // Заменить на astana-modern.jpg
  },
  
  // ========== АКТАУ (Западный регион) ==========
  {
    id: 'aktau_1',
    year: '1963',
    regionId: 'aktau',
    title: 'historicalFacts.aktauFoundation.title',
    description: 'historicalFacts.aktauFoundation.description',
    fullDescription: 'historicalFacts.aktauFoundation.fullDescription',
    image: require('../assets/historical/pavlodar-foundation.jpg') // Заменить на aktau-foundation.jpg
  },
  {
    id: 'aktau_2',
    year: '1991',
    regionId: 'aktau',
    title: 'historicalFacts.aktauRename.title',
    description: 'historicalFacts.aktauRename.description',
    fullDescription: 'historicalFacts.aktauRename.fullDescription',
    image: require('../assets/historical/pavlodar-city.jpeg') // Заменить на aktau-modern.jpg
  }
];

export const HistoricalFactsScreen = ({ route }) => {
  const [selectedFact, setSelectedFact] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  const { theme } = useTheme();

  const t = (key, params) => TranslationService.translate(key, params);
  
  // Получаем regionId из параметров навигации (если передан)
  const regionId = route?.params?.regionId;
  
  // Фильтруем факты по региону (если regionId передан)
  const displayedFacts = regionId 
    ? HISTORICAL_FACTS.filter(fact => fact.regionId === regionId)
    : HISTORICAL_FACTS;

  const openFactDetails = (fact) => {
    setSelectedFact(fact);
    setModalVisible(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={displayedFacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.factCard, { backgroundColor: theme.colors.cardBackground }]}
            onPress={() => openFactDetails(item)}
            activeOpacity={0.7}
          >
            <Image source={item.image} style={styles.factImage} />
            <View style={styles.factContent}>
              <Text style={[styles.year, { color: theme.colors.primary }]}>{item.year}</Text>
              <Text style={[styles.title, { color: theme.colors.text }]}>{t(item.title)}</Text>
              <Text style={[styles.description, { color: theme.colors.textSecondary }]}>{t(item.description)}</Text>
              <View style={styles.readMoreContainer}>
                <Text style={[styles.readMore, { color: theme.colors.primary }]}>{t('common.readMore')}</Text>
                <Ionicons name="chevron-forward" size={16} color={theme.colors.primary} />
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.cardBackground }]}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            
            {selectedFact && (
              <ScrollView>
                <Image source={selectedFact.image} style={styles.modalImage} />
                <View style={styles.modalTextContent}>
                  <Text style={[styles.modalYear, { color: theme.colors.primary }]}>{selectedFact.year}</Text>
                  <Text style={[styles.modalTitle, { color: theme.colors.text }]}>{t(selectedFact.title)}</Text>
                  <Text style={[styles.modalDescription, { color: theme.colors.textSecondary }]}>
                    {t(selectedFact.fullDescription)}
                  </Text>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  factCard: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  factImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  factContent: {
    padding: 16,
  },
  year: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  readMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
  },
  readMore: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '85%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 8,
  },
  modalImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  modalTextContent: {
    padding: 20,
  },
  modalYear: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    lineHeight: 28,
  },
  modalDescription: {
    fontSize: 16,
    lineHeight: 24,
  },
}); 