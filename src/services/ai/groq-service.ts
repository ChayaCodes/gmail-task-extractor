import axios from 'axios';
import { EventExtractor } from '../../interfaces/event-extractor.interface';

export class GroqService {
    private apiUrl: string;

    constructor(apiUrl: string) {
        this.apiUrl = apiUrl;
    }

    public async sendPrompt(prompt: string): Promise<EventExtractor[]> {
        try {
            const response = await axios.post(this.apiUrl, { prompt });
            return response.data.tasks;
        } catch (error) {
            console.error('Error sending prompt to GROQ API:', error);
            throw new Error('Failed to retrieve tasks from AI model');
        }
    }
}