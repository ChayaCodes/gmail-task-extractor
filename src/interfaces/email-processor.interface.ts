export interface EmailProcessor {
    extractTasks(emailContent: string): Promise<string[]>;
    extractEvents(emailContent: string): Promise<string[]>;
    getEmailSubject(emailContent: string): string;
    getEmailBody(emailContent: string): string;
    getEmailSender(emailContent: string): string;
}