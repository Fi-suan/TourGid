import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useRegion } from '../context/RegionContext';
import * as ApiService from '../services/ApiService';
import TranslationService from '../services/TranslationService';

export const RouteSelector = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const { selectedRegionId } = useRegion();
    const t = (key) => TranslationService.translate(key);
    
    const [routes, setRoutes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!selectedRegionId) return;

        const fetchRoutes = async () => {
            try {
                setIsLoading(false);
                const fetchedRoutes = await ApiService.getRoutes(selectedRegionId);
                setRoutes(fetchedRoutes);
            } catch (error) {
                console.error("Failed to fetch routes:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRoutes();
    }, [selectedRegionId]);

    const renderRouteItem = ({ item }) => (
        <TouchableOpacity 
            style={[styles.routeCard, { backgroundColor: theme.colors.cardBackground }]}
            onPress={() => navigation.navigate('RouteDetail', { routeId: item.id })}
        >
            <View style={styles.routeTextContainer}>
                <Text style={[styles.routeTitle, { color: theme.colors.text }]}>{t(item.name)}</Text>
                <Text style={[styles.routeDescription, { color: theme.colors.textSecondary }]} numberOfLines={2}>
                    {t(item.description)}
                </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
    );

    if (isLoading) {
        return <ActivityIndicator color={theme.colors.primary} style={{ marginVertical: 20 }} />;
    }

    if (!routes || routes.length === 0) {
        return null; // Don't render the component if there are no routes
    }
    
    return (
        <View style={styles.container}>
            <FlatList
                data={routes}
                renderItem={renderRouteItem}
                keyExtractor={item => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
  },
  listContainer: {
    paddingHorizontal: 0,
  },
  routeCard: {
    width: 300,
    padding: 18,
    borderRadius: 16,
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  routeTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  routeTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  routeDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
}); 