import { Request, Response } from 'express';
import { transcribeAudio, processTextQuery } from '../services/aiService'; 

export const handleTranscription = async (req: Request, res: Response) => {
    try {
        const { audio } = req.body;
        if (!audio) {
            return res.status(400).json({ error: 'No audio data provided' });
        }

        const text = await transcribeAudio(audio);
        if (text) {
            res.json({ text });
        } else {
            res.status(500).json({ error: 'Failed to transcribe audio' });
        }
    } catch (error) {
        console.error('Transcription handler error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const handleProcessQuery = async (req: Request, res: Response) => {
    try {
        const { text, context } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'No text provided' });
        }

        const result = await processTextQuery(text, context);
        res.json(result);
    } catch (error) {
        console.error('Process query handler error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
