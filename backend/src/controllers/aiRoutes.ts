import { Router } from 'express';
import { handleTranscription, handleProcessQuery } from './aiController';

const router = Router();

router.post('/transcribe', handleTranscription);
router.post('/process-query', handleProcessQuery);

export default router;
