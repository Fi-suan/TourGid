import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useLanguage, languages } from '../context/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import TranslationService from '../services/TranslationService';

export const SettingsScreen = () => {
  const { theme, themeMode, setTheme, isDark } = useTheme();
  const { language, changeLanguage } = useLanguage();
  const t = (key) => TranslationService.translate(key, key);

  const themeOptions = [
    { key: 'light', name: t('screens.settings.themeLight'), icon: 'sunny-outline' },
    { key: 'dark', name: t('screens.settings.themeDark'), icon: 'moon-outline' },
    { key: 'system', name: t('screens.settings.themeSystem'), icon: 'cog-outline' }
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.header, { color: theme.colors.text }]}>{t('screens.settings.title')}</Text>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
          {t('screens.settings.languageSection')}
        </Text>
        <View style={[styles.card, { backgroundColor: theme.colors.cardBackground }]}>
          {languages.map((lang, index) => (
            <OptionItem
              key={lang.code}
              text={`${lang.flag} ${lang.name}`}
              isSelected={language === lang.code}
              onPress={() => changeLanguage(lang.code)}
              isLast={index === languages.length - 1}
              theme={theme}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
          {t('screens.settings.themeSection')}
        </Text>
        <View style={[styles.card, { backgroundColor: theme.colors.cardBackground }]}>
          {themeOptions.map((option, index) => (
            <OptionItem
              key={option.key}
              text={option.name}
              icon={option.icon}
              isSelected={themeMode === option.key}
              onPress={() => setTheme(option.key)}
              isLast={index === themeOptions.length - 1}
              theme={theme}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const OptionItem = ({ text, icon, isSelected, onPress, isLast, theme }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={[styles.optionItem, !isLast && { borderBottomWidth: 1, borderBottomColor: theme.colors.border }]}>
      {icon && <Ionicons name={icon} size={22} color={theme.colors.textSecondary} style={styles.optionIcon} />}
      <Text style={[styles.optionText, { color: theme.colors.text }]}>{text}</Text>
      {isSelected && (
        <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
      )}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    padding: 20,
    paddingBottom: 10,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 16,
  },
  optionIcon: {
    marginRight: 15,
    width: 24,
    textAlign: 'center'
  },
  optionText: {
    fontSize: 16,
    flex: 1,
  },
}); 