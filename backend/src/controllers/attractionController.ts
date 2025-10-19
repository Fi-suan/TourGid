import prisma from '../db/prisma';

export const getRegions = async () => {
    return await prisma.region.findMany({
        orderBy: { name: 'asc' }
    });
};

export const getAttractionsByRegion = async (regionId?: string) => {
    if (!regionId) {
        return await prisma.attraction.findMany({
            include: {
                categories: true,
                region: true
            },
            orderBy: { name: 'asc' }
        });
    }
    return await prisma.attraction.findMany({
        where: { regionId },
        include: {
            categories: true,
            region: true
        },
        orderBy: { name: 'asc' }
    });
};

export const getInterests = async () => {
    return await prisma.category.findMany({
        orderBy: { name: 'asc' }
    });
};

export const getRoutesByRegion = async (regionId?: string) => {
    if (!regionId) {
        return await prisma.route.findMany({
            include: {
                attractions: true,
                region: true
            },
            orderBy: { name: 'asc' }
        });
    }
    return await prisma.route.findMany({
        where: { regionId },
        include: {
            attractions: true,
            region: true
        },
        orderBy: { name: 'asc' }
    });
};

export const getHistoricalFactsByRegion = async (regionId?: string) => {
    if (!regionId) {
        return await prisma.historicalFact.findMany({
            include: { region: true },
            orderBy: { year: 'asc' }
        });
    }
    return await prisma.historicalFact.findMany({
        where: { regionId },
        include: { region: true },
        orderBy: { year: 'asc' }
    });
};
