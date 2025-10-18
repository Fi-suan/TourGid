import { Router } from 'express';
import { 
    getPlaceDetailsHandler, 
    getPhotoHandler, 
    findPlacePhotoHandler,
    getDirectionsHandler,
    geocodeHandler,
    getPlaceReviewsHandler
} from './placesController';

const router = Router();

router.get('/place-details', getPlaceDetailsHandler);
router.get('/place-photo', getPhotoHandler);
router.get('/find-place-photo', findPlacePhotoHandler);
router.get('/directions', getDirectionsHandler);
router.get('/geocode', geocodeHandler);
router.get('/place-reviews', getPlaceReviewsHandler);

export default router;
