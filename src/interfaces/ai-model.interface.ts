export interface AIModel {
    processPrompt(prompt: string): Promise<string>;
    getTaskSuggestions(emailContent: string): Promise<string[]>;
    saveHistory(entry: string): Promise<void>;
    retrieveHistory(): Promise<string[]>;
}