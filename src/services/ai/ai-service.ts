import { GroqService } from './groq-service';
import { AITaskModel } from '../../interfaces/ai-model.interface';

export class AIService {
    private groqService: GroqService;

    constructor() {
        this.groqService = new GroqService();
    }

    public async extractTasksFromEmail(emailContent: string): Promise<AITaskModel[]> {
        const prompt = this.createPrompt(emailContent);
        const tasks = await this.groqService.getTaskSuggestions(prompt);
        return tasks;
    }

    private createPrompt(emailContent: string): string {
        return `Extract tasks from the following email content: ${emailContent}`;
    }
}