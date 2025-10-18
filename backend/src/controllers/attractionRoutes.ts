import { Router } from 'express';
import { getRegions, getAttractionsByRegion, getInterests, getRoutesByRegion, getHistoricalFactsByRegion } from './attractionController';

const router = Router();

router.get('/regions', (req, res) => {
    try {
        const regions = getRegions();
        res.json(regions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching regions' });
    }
});

router.get('/attractions', (req, res) => {
    try {
        const { regionId } = req.query;
        const attractions = getAttractionsByRegion(regionId as string);
        res.json(attractions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching attractions' });
    }
});

router.get('/interests', (req, res) => {
    try {
        const interests = getInterests();
        res.json(interests);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching interests' });
    }
});

router.get('/routes', (req, res) => {
    try {
        const { regionId } = req.query;
        const routes = getRoutesByRegion(regionId as string);
        res.json(routes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching routes' });
    }
});

router.get('/historical-facts', (req, res) => {
    const regionId = req.query.regionId as string;
    res.json(getHistoricalFactsByRegion(regionId));
});

export default router;
