import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import * as ApiService from '../services/ApiService';
import TranslationService from '../services/TranslationService';

export const RoutesScreen = ({ route }) => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const t = (key) => TranslationService.translate(key);
    const { regionId } = route.params;

    const [routes, setRoutes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const fetchedRoutes = await ApiService.getRoutes(regionId);
                setRoutes(fetchedRoutes);
            } catch (e) {
                console.error("Failed to fetch routes:", e);
                setError(t('errors.fetchDataFailed'));
            } finally {
                setIsLoading(false);
            }
        };

        if (regionId) {
            fetchRoutes();
        }
    }, [regionId]);

    const renderRouteItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.routeCard, { backgroundColor: theme.colors.cardBackground }]}
            onPress={() => navigation.navigate('RouteDetail', { routeId: item.id })}
        >
            <View style={styles.cardContent}>
                <Text style={[styles.routeTitle, { color: theme.colors.text }]}>{t(item.name)}</Text>
                <Text style={[styles.routeDescription, { color: theme.colors.textSecondary }]} numberOfLines={3}>
                    {t(item.description)}
                </Text>
                <View style={styles.infoContainer}>
                    <InfoPill icon="time-outline" text={item.duration} />
                    <InfoPill icon="walk-outline" text={item.distance} />
                </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
    );
    
    const InfoPill = ({ icon, text }) => (
        <View style={[styles.infoPill, { backgroundColor: theme.colors.background }]}>
            <Ionicons name={icon} size={14} color={theme.colors.textSecondary} />
            <Text style={[styles.infoPillText, { color: theme.colors.textSecondary }]}>{text}</Text>
        </View>
    );

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
                data={routes}
                renderItem={renderRouteItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <View style={styles.centered}>
                        <Text style={{ color: theme.colors.textSecondary }}>{t('routes.noRoutesFound')}</Text>
                    </View>
                }
            />
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
    routeCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
    cardContent: {
        flex: 1,
        marginRight: 10,
    },
    routeTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    routeDescription: {
        fontSize: 14,
        marginBottom: 12,
        lineHeight: 20,
    },
    infoContainer: {
        flexDirection: 'row',
    },
    infoPill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 12,
        marginRight: 8,
    },
    infoPillText: {
        marginLeft: 4,
        fontSize: 12,
    },
});