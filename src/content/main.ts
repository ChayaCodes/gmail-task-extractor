import * as InboxSDK from '@inboxsdk/core';
import { InboxSDKService } from '../services/inbox-sdk.service';
import { GroqService } from '../services/ai/groq-service';
import { EmailDetails } from '../types/email.types';
import { Event } from '../types/event.types';

// Application configuration
const CONFIG = {
  appId: process.env.INBOX_SDK_APP_ID || 'your-app-id',
  enableDebugMode: true,
  processAllEmails: true
};

// Global services container
const services = {
  inboxSDK: null as InboxSDKService | null,
  groq: null as GroqService | null
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
  // Initialize InboxSDK service
  services.inboxSDK = new InboxSDKService(CONFIG.appId);
  await services.inboxSDK.initialize();
  
  // Initialize Groq service
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

async function handleEmailOpened(emailDetails: EmailDetails): Promise<void> {
  console.log(`Email opened: "${emailDetails.subject}"`, { 
    sender: emailDetails.senderEmail 
  });
  
  if (CONFIG.processAllEmails) {
    await processEmailForEvents(emailDetails);
  }
}

async function processEmailForEvents(emailDetails: EmailDetails): Promise<void> {
  if (!services.groq) {
    console.error('Cannot process email - Groq service not initialized');
    return;
  }
  
  try {
    console.log(`Processing email for events: ${emailDetails.subject}`);
    
    const events = await services.groq.getEventSuggestions(emailDetails);
    
    handleExtractedEvents(events, emailDetails);
  } catch (error) {
    console.error(`Failed to process email for events`, error);
  }
}

function handleExtractedEvents(events: Event[], emailDetails: EmailDetails): void {
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
}

bootstrap().catch(error => {
  console.error('Fatal application error', error);
});