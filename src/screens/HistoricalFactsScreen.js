import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, SafeAreaView, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import * as ApiService from '../services/ApiService';
import TranslationService from '../services/TranslationService';
import { mapImage } from '../utils/imageMapper';

const HistoricalFactsScreen = ({ route }) => {
  const { theme } = useTheme();
  const t = (key) => TranslationService.translate(key);
  const { regionId } = route.params;

  const [facts, setFacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFact, setSelectedFact] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchFacts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedFacts = await ApiService.getHistoricalFacts(regionId);
        setFacts(fetchedFacts);
      } catch (e) {
        console.error("Failed to fetch historical facts:", e);
        setError(t('errors.fetchDataFailed'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchFacts();
  }, [regionId]);

  const handleFactPress = (fact) => {
    setSelectedFact(fact);
    setModalVisible(true);
  };

  const renderFact = ({ item }) => {
    // Приоритет: photoUrl из БД → локальное изображение
    const imageSource = item.photoUrl || (item.image ? mapImage(item.image) : null);
    const placeholder = item.image ? mapImage(item.image) : null;
    
    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.colors.cardBackground }]}
        onPress={() => handleFactPress(item)}
      >
        {imageSource && (
          <Image 
            source={imageSource} 
            placeholder={placeholder}
            contentFit="cover"
            transition={300}
            style={styles.image} 
          />
        )}
        <View style={styles.textContainer}>
          <Text style={[styles.year, { color: theme.colors.primary }]}>{item.year}</Text>
          <Text style={[styles.title, { color: theme.colors.text }]}>{t(item.title)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.text }}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={facts}
        renderItem={renderFact}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      {selectedFact && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.colors.cardBackground }]}>
              <Image 
                source={selectedFact.photoUrl || mapImage(selectedFact.image)} 
                placeholder={mapImage(selectedFact.image)}
                contentFit="cover"
                transition={300}
                style={styles.modalImage} 
              />
              <Text style={[styles.modalYear, { color: theme.colors.primary }]}>{selectedFact.year}</Text>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>{t(selectedFact.title)}</Text>
              <Text style={[styles.modalDescription, { color: theme.colors.textSecondary }]}>{t(selectedFact.description)}</Text>
              <TouchableOpacity
                style={[styles.closeButton, { backgroundColor: theme.colors.primary }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>{t('common.close')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  textContainer: {
    flex: 1,
    padding: 12,
  },
  year: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 16,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalContent: {
    width: '90%',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  modalYear: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HistoricalFactsScreen; 