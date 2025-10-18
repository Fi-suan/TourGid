import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

export const themes = {
  light: {
    name: 'light',
    isDark: false,
    colors: {
      primary: '#333333',
      secondary: '#4CAF50',
      background: '#FFFFFF',
      card: '#FFFFFF', 
      text: '#333333',
      textSecondary: '#666666',
      border: '#E0E0E0',
      notification: '#FF9800',
      error: '#F44336',
      success: '#4CAF50',
      info: '#333333',
      warning: '#FF9800',
      disabled: '#BDBDBD',
      placeholder: '#999999',
      backdrop: 'rgba(0, 0, 0, 0.5)',
      shadow: '#000000',
      searchBackground: '#F5F5F5',
      cardBackground: '#F5F5F5',
      inputBackground: '#ECECEC'
    }
  },
  dark: {
    name: 'dark',
    isDark: true,
    colors: {
      primary: '#AAAAAA',
      secondary: '#A5D6A7',
      background: '#121212',
      card: '#1E1E1E',
      text: '#FFFFFF',
      textSecondary: '#AAAAAA', 
      border: '#333333',
      notification: '#FFB74D',
      error: '#EF9A9A',
      success: '#A5D6A7',
      info: '#AAAAAA',
      warning: '#FFB74D',
      disabled: '#757575',
      placeholder: '#AAAAAA',
      backdrop: 'rgba(0, 0, 0, 0.7)',
      shadow: '#000000',
      searchBackground: '#2C2C2C',
      cardBackground: '#1E1E1E',
      inputBackground: '#2C2C2C'
    }
  }
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState('system'); // 'light', 'dark', 'system'
  
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('appTheme');
        if (savedTheme) {
          setThemeMode(savedTheme);
        }
      } catch (error) {
        // console.error('Failed to load theme.', error);
      }
    };
    loadTheme();
  }, []);
  
  const setTheme = async (mode) => {
    try {
      await AsyncStorage.setItem('appTheme', mode);
      setThemeMode(mode);
    } catch (error) {
      // console.error('Failed to save theme.', error);
    }
  };

  const activeTheme = themeMode === 'system' 
    ? (systemScheme === 'dark' ? themes.dark : themes.light)
    : (themeMode === 'dark' ? themes.dark : themes.light);

  return (
    <ThemeContext.Provider value={{ theme: activeTheme, themeMode, setTheme, isDark: activeTheme.isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);