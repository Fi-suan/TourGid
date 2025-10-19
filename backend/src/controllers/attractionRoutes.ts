import { Router } from 'express';
import { getRegions, getAttractionsByRegion, getInterests, getRoutesByRegion, getHistoricalFactsByRegion } from './attractionController';

const router = Router();

router.get('/regions', async (req, res) => {
    try {
        const regions = await getRegions();
        res.json(regions);
    } catch (error) {
        console.error('Error fetching regions:', error);
        res.status(500).json({ message: 'Error fetching regions' });
    }
});

router.get('/attractions', async (req, res) => {
    try {
        const { regionId } = req.query;
        const attractions = await getAttractionsByRegion(regionId as string);
        res.json(attractions);
    } catch (error) {
        console.error('Error fetching attractions:', error);
        res.status(500).json({ message: 'Error fetching attractions' });
    }
});

router.get('/interests', async (req, res) => {
    try {
        const interests = await getInterests();
        res.json(interests);
    } catch (error) {
        console.error('Error fetching interests:', error);
        res.status(500).json({ message: 'Error fetching interests' });
    }
});

router.get('/routes', async (req, res) => {
    try {
        const { regionId } = req.query;
        const routes = await getRoutesByRegion(regionId as string);
        res.json(routes);
    } catch (error) {
        console.error('Error fetching routes:', error);
        res.status(500).json({ message: 'Error fetching routes' });
    }
});

router.get('/historical-facts', async (req, res) => {
    try {
        const regionId = req.query.regionId as string;
        const facts = await getHistoricalFactsByRegion(regionId);
        res.json(facts);
    } catch (error) {
        console.error('Error fetching historical facts:', error);
        res.status(500).json({ message: 'Error fetching historical facts' });
    }
});

export default router;
