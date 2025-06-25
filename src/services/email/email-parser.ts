import { EmailProcessor } from '../../interfaces/email-processor.interface';

export class EmailParser implements EmailProcessor {
    extractTasks(emailContent: string): Promise<string[]> {
        return Promise.resolve(this.parseEmailContent(emailContent));
    }
    extractEvents(emailContent: string): Promise<string[]> {
        throw new Error('Method not implemented.');
    }
    getEmailSubject(emailContent: string): string {
        throw new Error('Method not implemented.');
    }
    getEmailBody(emailContent: string): string {
        throw new Error('Method not implemented.');
    }
    getEmailSender(emailContent: string): string {
        throw new Error('Method not implemented.');
    }
    parseEmailContent(emailContent: string): string[] {
        const tasks: string[] = [];
        const taskRegex = /(?:\*\s*|\d+\.\s*)(.*?)(?=\n|$)/g;
        let match;

        while ((match = taskRegex.exec(emailContent)) !== null) {
            tasks.push(match[1].trim());
        }

        return tasks;
    }

    extractRelevantInfo(email: { subject: string; body: string }): { subject: string; tasks: string[] } {
        const tasks = this.parseEmailContent(email.body);
        return {
            subject: email.subject,
            tasks: tasks,
        };
    }
}