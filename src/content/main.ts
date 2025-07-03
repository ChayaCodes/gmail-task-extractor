import * as InboxSDK from '@inboxsdk/core';
import { InboxSDKService } from '/src/services/inboxSDK/inbox-sdk.service';
import { GroqService } from '/src/services/ai/groq-service';
import { InboxSDKUIService } from '/src/services/inboxSDK/inbox-sdk-ui.service';
import { EmailDetails } from '/src/types/email.types';
import { Event } from '/src/types/event.types';
import { GoogleCalendar } from '/src/services/calendar/google-calendar';

// Application configuration
const CONFIG = {
  appId: process.env.INBOX_SDK_APP_ID || 'your-app-id',
  enableDebugMode: true,
};

// Global services container
const services = {
  inboxSDK: null as InboxSDKService | null,
  groq: null as GroqService | null,
  uiService: null as InboxSDKUIService | null,
  calendar: new GoogleCalendar()
};

async function bootstrap(): Promise<void> {
  console.log('Gmail Event Extractor starting...');
  try {
    await initializeServices();
    registerEventHandlers();
  } catch (error) {
    console.error('Failed to initialize application', error);
  }
}

async function initializeServices(): Promise<void> {
  services.inboxSDK = new InboxSDKService(CONFIG.appId);
  await services.inboxSDK.initialize();
  services.groq = new GroqService();
  services.uiService = new InboxSDKUIService(services.inboxSDK);
}

function registerEventHandlers(): void {
  if (!services.inboxSDK) {
    console.error('Cannot register handlers - InboxSDK not initialized');
    return;
  }
  services.inboxSDK.registerMessageHandlers({
    onOpenMessage: handleEmailOpened
  });
}

async function handleEmailOpened(emailDetails: EmailDetails, messageView: any): Promise<void> {
  console.log(`Email opened: `, emailDetails);
  await processEmailForEvents(emailDetails, messageView);

}

function showSuccessNotification(message: string) {
  services.uiService?.showNotification(message, { type: 'success', timeout: 7000 });
}

function showErrorNotification(message: string) {
  services.uiService?.showNotification(message, { type: 'error', timeout: 7000 });
}

async function handleEventApprove(event: Event): Promise<void> {
  console.log('Event approved:', event);
  try {

    event = {
      ...event,
      description:
      event.description +
      (event.mailLink ? `\n\n------------------\nקישור למייל המקורי:\n${event.mailLink}` : ''),
    };
    const eventId = await services.calendar.addEvent(event);
    services.uiService?.closeCurrentSidebar();
    const eventLink = `https://calendar.google.com/event?eid=${eventId}`;
    showSuccessNotification(
     'האירוע נוסף בהצלחה! ניתן לראות אותו ביומן Google שלך.'
    );
    // אם תרצי להציג קישור, אפשר להוסיף אותו לטקסט בלבד:
    // showSuccessNotification(`האירוע נוסף בהצלחה! חפש אותו ביומן Google שלך (ID: ${eventId})`);
  } catch (error: any) {
    showErrorNotification('אירעה שגיאה בהוספת האירוע ליומן: ' + (error?.message || ''));
  }
}

async function processEmailForEvents(emailDetails: EmailDetails, messageView: any): Promise<void> {
  if (!services.groq) {
    console.error('Cannot process email - Groq service not initialized');
    showErrorNotification('Cannot process email - Groq service not initialized');

    return;
  }
  try {
    console.log(`Processing email for events: ${emailDetails.subject}`);
    const events = await services.groq.getEventSuggestions(emailDetails);
    handleExtractedEvents(events, emailDetails, messageView);
  } catch (error: any) {
    showErrorNotification('אירעה שגיאה בתקשורת עם שירות הבינה המלאכותית: ' + (error?.message || ''));
    console.error(`Failed to process email for events`, error);
  }
}

function handleExtractedEvents(events: Event[], emailDetails: EmailDetails, messageView: any): void {
  if (events.length === 0) {
    console.log(`No events found in email: ${emailDetails.subject}`);
    return;
  }
  const threadId = messageView?.getThreadView()?.getThreadID();
  const mailLink = threadId ? `https://mail.google.com/mail/u/0/#inbox/${threadId}` : '';
  console.log(`Found ${events.length} events in email: ${emailDetails.subject}`);
  events.forEach((event, index) => {
    logEventDetails(event, index);
  });
  const eventsWithLink = events.map(ev => ({ ...ev, mailLink }));

  showEventSidebar(eventsWithLink, messageView);
}

function logEventDetails(event: Event, index: number): void {
  console.log(`Event ${index + 1}: ${event.title}`, {
    event
  });
}

function showEventSidebar(events: Event[], messageView: any): void {
  if (!services.uiService) {
    console.error('Cannot show event sidebar - UI service not initialized');
    return;
  }
  services.uiService.showEventSidebar(events, messageView, {
    onEventUpdate: handleEventUpdate,
    onEventApprove: handleEventApprove,
    onEventReject: handleEventReject
  });
}

function handleEventUpdate(event: Event): void {
  console.log('Event updated:', event);
}

async function handleEventReject(event: Event): Promise<void> {
  console.log('Event rejected:', event);
  // אפשר להוסיף לוגיקה אם צריך
}

bootstrap().catch(error => {
  console.error('Fatal application error', error);
});