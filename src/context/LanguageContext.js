import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TranslationService from '../services/TranslationService';

export const languages = [
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'kz', name: 'Қазақша', flag: '🇰🇿' },
];

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('ru'); // Default language

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('appLanguage');
        if (savedLanguage && languages.some(l => l.code === savedLanguage)) {
          setLanguage(savedLanguage);
          TranslationService.changeLanguage(savedLanguage);
        } else {
          // You could set a default or device language here
          TranslationService.changeLanguage('ru');
        }
      } catch (error) {
        // console.error('Failed to load language', error);
      }
    };
    
    loadLanguage();
  }, []);

  const changeLanguage = async (langCode) => {
    try {
      await AsyncStorage.setItem('appLanguage', langCode);
      TranslationService.changeLanguage(langCode);
      setLanguage(langCode);
    } catch (error) {
      // console.error('Failed to save language', error);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, availableLanguages: languages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext); 