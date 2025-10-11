import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import TranslationService from '../services/TranslationService';
import { ROUTES } from '../constants/data';

export const RoutesScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const t = (key, params) => TranslationService.translate(key, params);
  
  const regionId = route?.params?.regionId;
  const displayedRoutes = regionId
    ? ROUTES.filter(r => r.regionId === regionId)
    : ROUTES;

  const renderRouteItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.routeCard, { backgroundColor: theme.colors.cardBackground }]}
      onPress={() => navigation.navigate('RouteDetail', { route: item })}
    >
      <Text style={[styles.routeTitle, { color: theme.colors.text }]}>{t(item.name)}</Text>
      <Text style={[styles.routeDescription, { color: theme.colors.textSecondary }]}>{t(item.description)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={displayedRoutes}
        keyExtractor={(item) => item.id}
        renderItem={renderRouteItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  routeCard: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },
  routeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  routeDescription: {
    fontSize: 14,
  },
});