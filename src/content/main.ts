import * as InboxSDK from '@inboxsdk/core';
import { InboxSDKService } from '/src/services/inboxSDK/inbox-sdk.service';
import { GroqService } from '/src/services/ai/groq-service';
import { InboxSDKUIService } from '/src/services/inboxSDK/inbox-sdk-ui.service';
import { EmailDetails } from '/src/types/email.types';
import { Event } from '/src/types/event.types';

// Application configuration
const CONFIG = {
  appId: process.env.INBOX_SDK_APP_ID || 'your-app-id',
  enableDebugMode: true,
};

// Global services container
const services = {
  inboxSDK: null as InboxSDKService | null,
  groq: null as GroqService | null,
  uiService: new InboxSDKUIService()
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
}

function registerEventHandlers(): void {
  if (!services.inboxSDK) {
    console.error('Cannot register handlers - InboxSDK not initialized');
    return;
  }
  
  // Register email open handler
  services.inboxSDK.registerMessageHandlers({
    onOpenMessage: handleEmailOpened
  });
}

async function handleEmailOpened(emailDetails: EmailDetails, messageView: any): Promise<void> {
  console.log(`Email opened: "${emailDetails.subject}"`, { 
    sender: emailDetails.senderEmail 
  });
  
  await processEmailForEvents(emailDetails, messageView);
  
}

async function processEmailForEvents(emailDetails: EmailDetails, messageView: any): Promise<void> {
  if (!services.groq) {
    console.error('Cannot process email - Groq service not initialized');
    return;
  }
  
  try {
    console.log(`Processing email for events: ${emailDetails.subject}`);
    
    const events = await services.groq.getEventSuggestions(emailDetails);
    
    handleExtractedEvents(events, emailDetails, messageView);
  } catch (error) {
    console.error(`Failed to process email for events`, error);
  }
}

function handleExtractedEvents(events: Event[], emailDetails: EmailDetails, messageView: any): void {
  if (events.length === 0) {
    console.log(`No events found in email: ${emailDetails.subject}`);
    return;
  }
  
  console.log(`Found ${events.length} events in email: ${emailDetails.subject}`);
  
  events.forEach((event, index) => {
    console.log(`Event ${index + 1}: ${event.title}`, {
      date: `${event.startDate} (${event.startTime} - ${event.endTime})`,
      location: event.location || 'No location'
    });
  });
  
  services.uiService.showEventSidebar(events, messageView, {
    onEventUpdate: (event) => {
      console.log('Event updated:', event);
    },
    onEventApprove: (event) => {
      console.log('Event approved:', event);
      
      services.uiService.closeCurrentSidebar();
    },
    onEventReject: (event) => {
      console.log('Event rejected:', event);
    }
  });
}

bootstrap().catch(error => {
  console.error('Fatal application error', error);
});