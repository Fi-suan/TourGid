import { REGIONS, ATTRACTIONS, INTERESTS, ROUTES, HISTORICAL_FACTS } from '../db/data';

// В будущем здесь будет логика для работы с настоящей базой данных

export const getRegions = () => {
    return REGIONS;
};

export const getAttractionsByRegion = (regionId: string) => {
    if (!regionId) {
        return ATTRACTIONS;
    }
    return ATTRACTIONS.filter(attraction => attraction.regionId === regionId);
};

export const getInterests = () => {
    return INTERESTS;
}

export const getRoutesByRegion = (regionId: string) => {
    if (!regionId) {
        return ROUTES;
    }
    // Предполагаем, что у маршрутов есть привязка к региону. Если нет, нужна доработка.
    // Пока возвращаем все маршруты, т.к. в data.js у них нет regionId.
    return ROUTES;
}

export const getHistoricalFactsByRegion = (regionId: string) => {
    if (!regionId) {
        return HISTORICAL_FACTS;
    }
    return HISTORICAL_FACTS.filter(fact => fact.regionId === regionId);
};
