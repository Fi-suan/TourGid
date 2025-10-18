import { Request, Response } from 'express';
import fetch from 'node-fetch';

// Читаем API ключ динамически
const getGoogleApiKey = () => process.env.GOOGLE_API_KEY;

export const getPlaceDetailsHandler = async (req: Request, res: Response) => {
    const { placeId } = req.query;
    if (!placeId) {
        return res.status(400).json({ error: 'Place ID is required' });
    }

    try {
        const GOOGLE_API_KEY = getGoogleApiKey();
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_API_KEY}&fields=photos,reviews,website&language=ru`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Google Places API error: ${response.status}`);
        }

        const data = await response.json();
        res.json(data.result);
    } catch (error) {
        console.error('Error fetching place details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const findPlacePhotoHandler = async (req: Request, res: Response) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }
    
    const GOOGLE_API_KEY = getGoogleApiKey();
    if (!GOOGLE_API_KEY) {
        return res.status(500).json({ error: 'Google API key is not configured on the server' });
    }

    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query as string)}&key=${GOOGLE_API_KEY}`;

    try {
        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json() as any;

        console.log(`🔍 Query: "${query}"`);
        console.log(`📊 Status: ${searchData.status}`);
        console.log(`📍 Results: ${searchData.results?.length || 0}`);
        
        if (searchData.status === 'REQUEST_DENIED') {
            console.error('❌ Google API Error:', searchData.error_message);
            return res.status(500).json({ error: 'API access denied', details: searchData.error_message });
        }

        if (searchData.results && searchData.results.length > 0 && searchData.results[0].photos) {
            const photoReference = searchData.results[0].photos[0].photo_reference;
            const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoReference}&key=${getGoogleApiKey()}`;
            console.log(`✅ Photo found!`);
            return res.json({ photoUrl });
        } else {
            console.log(`❌ No photo available`);
            return res.status(404).json({ error: 'No photo found for this query' });
        }
    } catch (error) {
        console.error('Error finding place photo:', error);
        res.status(500).json({ error: 'Failed to find place photo' });
    }
};


export const getPhotoHandler = async (req: Request, res: Response) => {
    const { photo_reference } = req.query;
    if (!photo_reference) {
        return res.status(400).json({ error: 'Photo reference is required' });
    }

    try {
        const GOOGLE_API_KEY = getGoogleApiKey();
        const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photoreference=${photo_reference}&key=${GOOGLE_API_KEY}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Google Places Photo API error: ${response.status}`);
        }
        
        // Redirect to the actual image URL
        res.redirect(response.url);

    } catch (error) {
        console.error('Error fetching place photo:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// 🆕 Directions API endpoint
export const getDirectionsHandler = async (req: Request, res: Response) => {
    const { origin, destination, waypoints, mode } = req.query;
    
    if (!origin || !destination) {
        return res.status(400).json({ error: 'Origin and destination are required' });
    }

    try {
        const GOOGLE_API_KEY = getGoogleApiKey();
        let url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=${mode || 'walking'}&language=ru&region=kz&key=${GOOGLE_API_KEY}`;
        
        // Добавляем waypoints если есть
        if (waypoints && typeof waypoints === 'string' && waypoints.length > 0) {
            url += `&waypoints=optimize:true|${waypoints}`;
        }

        console.log('🗺️ Requesting Google Directions API...');
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'REQUEST_DENIED') {
            console.error('❌ Directions API Error:', data.error_message);
            return res.status(403).json({ error: 'API access denied', details: data.error_message });
        }

        console.log('✅ Directions API Response:', data.status);
        res.json(data);
    } catch (error) {
        console.error('Error fetching directions:', error);
        res.status(500).json({ error: 'Failed to fetch directions' });
    }
};

// 🆕 Geocoding API endpoint
export const geocodeHandler = async (req: Request, res: Response) => {
    const { address, latlng } = req.query;
    
    if (!address && !latlng) {
        return res.status(400).json({ error: 'Address or latlng is required' });
    }

    try {
        const GOOGLE_API_KEY = getGoogleApiKey();
        const param = address ? `address=${encodeURIComponent(address as string)}` : `latlng=${latlng}`;
        const url = `https://maps.googleapis.com/maps/api/geocode/json?${param}&key=${GOOGLE_API_KEY}`;
        
        console.log('🗺️ Requesting Google Geocoding API...');
        const response = await fetch(url);
        const data = await response.json();

        console.log('✅ Geocoding API Response:', data.status);
        res.json(data);
    } catch (error) {
        console.error('Error fetching geocode:', error);
        res.status(500).json({ error: 'Failed to fetch geocode' });
    }
};

// 🆕 Places Reviews endpoint
export const getPlaceReviewsHandler = async (req: Request, res: Response) => {
    const { placeId } = req.query;
    
    if (!placeId) {
        return res.status(400).json({ error: 'Place ID is required' });
    }

    try {
        const GOOGLE_API_KEY = getGoogleApiKey();
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&language=ru&key=${GOOGLE_API_KEY}`;
        
        console.log('⭐ Requesting Place Reviews...');
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'OK' && data.result) {
            const reviews = data.result.reviews || [];
            const rating = data.result.rating || 0;
            const totalRatings = data.result.user_ratings_total || 0;

            console.log(`✅ Found ${reviews.length} reviews, rating: ${rating}`);
            res.json({ reviews, rating, totalRatings });
        } else {
            console.log('❌ No reviews found');
            res.json({ reviews: [], rating: 0, totalRatings: 0 });
        }
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
};
