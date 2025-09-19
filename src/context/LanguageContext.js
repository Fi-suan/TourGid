import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TranslationService from '../services/TranslationService';

export const languages = {
  RU: 'ru',
  KZ: 'kz',
  EN: 'en'
};


const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('ru');

  // Load saved language
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('language');
        if (savedLanguage) {
          changeLanguage(savedLanguage);
        }
      } catch (error) {
        console.error('Failed to load language', error);
      }
    };
    
    loadLanguage();
  }, []);

  // Change language and save preference
  const changeLanguage = async (lang) => {
    try {
      await AsyncStorage.setItem('language', lang);
      TranslationService.changeLanguage(lang);
      setLanguage(lang);
    } catch (error) {
      console.error('Failed to save language', error);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext); 