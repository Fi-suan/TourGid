import React, { useEffect, useCallback } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import { HomeScreen } from './src/screens/HomeScreen';
import { AttractionDetailScreen } from './src/screens/AttractionDetailScreen';
import HistoricalFactsScreen from './src/screens/HistoricalFactsScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { RegionInfoScreen } from './src/screens/RegionInfoScreen';
import { MapScreen } from './src/screens/MapScreen';
import { ThemeProvider } from './src/context/ThemeContext';
import { LanguageProvider, useLanguage } from './src/context/LanguageContext';
import { RegionProvider } from './src/context/RegionContext';
import TranslationService from './src/services/TranslationService';
import GoogleAPIService from './src/services/GoogleAPIService';
import { RoutesScreen } from './src/screens/RoutesScreen';
import { RouteDetailScreen } from './src/screens/RouteDetailScreen';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

function AppContent() {
  const { language } = useLanguage();
  const [appIsReady, setAppIsReady] = React.useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Минимальная задержка для плавного перехода
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <NavigationContainer key={language}>
        <Stack.Navigator
          screenOptions={({ route }) => ({
            headerBackTitle: '',
          })}
        >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="AttractionDetail" 
          component={AttractionDetailScreen}
          options={({ route }) => ({ 
            title: route.params?.attraction?.name || TranslationService.translate('screens.attractionDetail.title')
          })}
        />
        <Stack.Screen 
          name="HistoricalFacts" 
          component={HistoricalFactsScreen}
          options={{ title: TranslationService.translate('screens.historicalFacts.title') }}
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{ title: TranslationService.translate('screens.settings.title') }}
        />
        <Stack.Screen 
          name="RegionInfo" 
          component={RegionInfoScreen}
          options={{ title: TranslationService.translate('screens.regionInfo.title') }}
        />
        <Stack.Screen 
          name="Map" 
          component={MapScreen}
          options={{ title: TranslationService.translate('screens.map.title') }}
        />
        <Stack.Screen 
          name="Routes" 
          component={RoutesScreen}
          options={{ title: TranslationService.translate('screens.routes.title') }}
        />
        <Stack.Screen 
          name="RouteDetail" 
          component={RouteDetailScreen}
          options={{ title: TranslationService.translate('screens.routeDetail.title') }}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </View>
  );
}

export default function App() {
  return (
    <View style={{ flex: 1 }} onLayout={() => {}}>
      <ThemeProvider>
        <LanguageProvider>
          <RegionProvider>
            <AppContent />
          </RegionProvider>
        </LanguageProvider>
      </ThemeProvider>
    </View>
  );
}
