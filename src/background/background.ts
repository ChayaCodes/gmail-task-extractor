import * as InboxSDK from '@inboxsdk/core';
import { EmailParser } from '../services/email/email-parser';  // שינוי מ-EmailProcessor ל-EmailParser
import { AIService } from '../services/ai/ai-service';
import { CalendarService } from '../services/calendar/calendar-service';

const emailProcessor = new EmailParser();  // שימוש ב-EmailParser במקום EmailProcessor
const aiService = new AIService();
const calendarService = new CalendarService();

InboxSDK.load(2, 'your_sdk_key_here').then((sdk) => {
    sdk.Compose.registerComposeViewHandler((composeView) => {
        // Handle compose view events if needed
    });

    sdk.Lists.registerThreadRowViewHandler((threadRowView) => {
        threadRowView.on('selected', async () => {
            const emailContent = threadRowView.getBodyElement().innerText;  // Assuming this gets the email body
            const emailSubject = threadRowView.getSubject();
            const emailSender = threadRowView.getFromEmailAddress();

            console.log('Email selected:', {
                subject: emailSubject,
                body: emailContent,
                sender: emailSender,
            });
        });
    });
});