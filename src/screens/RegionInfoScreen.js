import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  Linking,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import TranslationService from '../services/TranslationService';

const { width } = Dimensions.get('window');

export const RegionInfoScreen = () => {
  const { theme } = useTheme();
  const t = (key, params) => TranslationService.translate(key, params);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Image 
        source={require('../assets/pavlodar/kyzyltau-reserve.jpg')} 
        style={styles.headerImage}
      />
      
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {t('screens.regionInfo.title')}
        </Text>
        
        <View style={[styles.infoCard, { backgroundColor: theme.colors.cardBackground }]}>
          <View style={styles.infoRow}>
            <Ionicons name="location" size={20} color={theme.colors.primary} />
            <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
              {t('regionInfo.description')}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="people" size={20} color={theme.colors.primary} />
            <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
              {t('regionInfo.population')}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="thermometer" size={20} color={theme.colors.primary} />
            <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
              {t('regionInfo.climate')}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="business" size={20} color={theme.colors.primary} />
            <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
              {t('regionInfo.economy')}
            </Text>
          </View>
        </View>
        
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          {t('regionInfo.geographyTitle')}
        </Text>
        <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
          {t('regionInfo.geography')}
        </Text>
        
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          {t('regionInfo.historyTitle')}
        </Text>
        <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
          {t('regionInfo.historyDescription')}
        </Text>
        
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          {t('regionInfo.cultureTitle')}
        </Text>
        <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
          {t('regionInfo.culture')}
        </Text>
        
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          {t('regionInfo.natureTitle')}
        </Text>
        <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
          {t('regionInfo.nature')}
        </Text>
        
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          {t('regionInfo.mainAttractionsTitle')}
        </Text>
        <View style={styles.attractionsList}>
          <Text style={[styles.attractionItem, { color: theme.colors.textSecondary }]}>
            {t('regionInfo.attraction1')}
          </Text>
          <Text style={[styles.attractionItem, { color: theme.colors.textSecondary }]}>
            {t('regionInfo.attraction2')}
          </Text>
          <Text style={[styles.attractionItem, { color: theme.colors.textSecondary }]}>
            {t('regionInfo.attraction3')}
          </Text>
          <Text style={[styles.attractionItem, { color: theme.colors.textSecondary }]}>
            {t('regionInfo.attraction4')}
          </Text>
          <Text style={[styles.attractionItem, { color: theme.colors.textSecondary }]}>
            {t('regionInfo.attraction5')}
          </Text>
          <Text style={[styles.attractionItem, { color: theme.colors.textSecondary }]}>
            {t('regionInfo.attraction6')}
          </Text>
        </View>
        
        <View style={styles.linksContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t('regionInfo.links')}
          </Text>
          
          <TouchableOpacity 
            style={[styles.linkButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => Linking.openURL('https://pavlodar.gov.kz/ru')}
          >
            <Ionicons name="globe" size={20} color="#FFFFFF" />
            <Text style={styles.linkText}>
              {t('regionInfo.officialSite')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.linkButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => Linking.openURL('https://kazakhstan.travel/ru/guide/regions/pavlodar')}
          >
            <Ionicons name="airplane" size={20} color="#FFFFFF" />
            <Text style={styles.linkText}>
              {t('regionInfo.touristPortal')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.linkButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => Linking.openURL('https://2gis.kz/pavlodar')}
          >
            <Ionicons name="map" size={20} color="#FFFFFF" />
            <Text style={styles.linkText}>
              {t('regionInfo.map')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerImage: {
    width: width,
    height: 200,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoCard: {
    marginBottom: 25,
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  infoText: {
    marginLeft: 12,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 20,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
  },
  attractionsList: {
    marginBottom: 20,
  },
  attractionItem: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 8,
  },
  linksContainer: {
    marginTop: 10,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  linkText: {
    color: '#FFFFFF',
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '500',
  },
});