import { PrismaClient } from '@prisma/client';
import { REGIONS, ATTRACTIONS, INTERESTS, ROUTES, HISTORICAL_FACTS } from '../src/db/data';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Очистить БД
  console.log('🗑️  Clearing database...');
  await prisma.historicalFact.deleteMany();
  await prisma.route.deleteMany();
  await prisma.attraction.deleteMany();
  await prisma.category.deleteMany();
  await prisma.region.deleteMany();

  // 1. Создать регионы
  console.log('📍 Creating regions...');
  const regionMap = new Map();
  for (const region of REGIONS) {
    const created = await prisma.region.create({
      data: {
        id: region.id,
        name: region.name,
        region: region.region,
        coordinates: region.coordinates,
        description: region.description,
        population: region.population || null,
        climate: region.climate || null,
        mainCity: region.mainCity,
        founded: region.founded,
        attractions_count: region.attractions_count || null,
        mapImage: region.mapImage,
        photoUrl: region.photoUrl || null,
        geography: region.geography || null,
        history: region.history || null,
        culture: region.culture || null,
        nature: region.nature || null,
      },
    });
    regionMap.set(region.id, created);
    console.log(`  ✅ ${region.name}`);
  }

  // 2. Создать категории
  console.log('🏷️  Creating categories...');
  const categoryMap = new Map();
  for (const interest of INTERESTS) {
    const created = await prisma.category.create({
      data: {
        id: interest.id,
        name: interest.name,
        icon: interest.icon,
      },
    });
    categoryMap.set(interest.id, created);
    console.log(`  ✅ ${interest.name}`);
  }

  // 3. Создать достопримечательности
  console.log('🏛️  Creating attractions...');
  const attractionMap = new Map();
  for (const attraction of ATTRACTIONS) {
    const created = await prisma.attraction.create({
      data: {
        id: attraction.id,
        name: attraction.name,
        description: attraction.description,
        location: attraction.location,
        image: attraction.image || null,
        photoUrl: attraction.photoUrl || null,
        coordinates: attraction.coordinates,
        workingHours: attraction.workingHours,
        contacts: attraction.contacts,
        historicalInfo: attraction.historicalInfo,
        tips: attraction.tips,
        rating: attraction.rating || null,
        regionId: attraction.regionId,
        categories: {
          connect: attraction.categories.map((catId) => ({ id: catId })),
        },
      },
    });
    attractionMap.set(attraction.id, created);
    console.log(`  ✅ ${attraction.name}`);
  }

  // 4. Создать маршруты
  console.log('🗺️  Creating routes...');
  for (const route of ROUTES) {
    await prisma.route.create({
      data: {
        id: route.id,
        name: route.name,
        description: route.description,
        duration: route.duration,
        difficulty: route.difficulty,
        recommendedTransport: route.recommendedTransport,
        photoUrl: route.photoUrl || null,
        regionId: route.regionId,
        attractions: {
          connect: route.attractions.map((attrId) => ({ id: attrId })),
        },
      },
    });
    console.log(`  ✅ ${route.name}`);
  }

  // 5. Создать исторические факты
  console.log('📜 Creating historical facts...');
  for (const fact of HISTORICAL_FACTS) {
    await prisma.historicalFact.create({
      data: {
        id: fact.id,
        year: fact.year,
        title: fact.title,
        description: fact.description,
        image: fact.image || null,
        photoUrl: fact.photoUrl || null,
        regionId: fact.regionId,
      },
    });
    console.log(`  ✅ ${fact.year} - ${fact.title}`);
  }

  console.log('✨ Seed completed!');
  console.log(`📊 Stats:
    Regions: ${REGIONS.length}
    Categories: ${INTERESTS.length}
    Attractions: ${ATTRACTIONS.length}
    Routes: ${ROUTES.length}
    Historical Facts: ${HISTORICAL_FACTS.length}
  `);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

