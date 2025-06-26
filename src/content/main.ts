import * as InboxSDK from '@inboxsdk/core';
import { InboxSDKService } from '../services/inbox-sdk.service';


console.log('Gmail Event Extractor starting...');

async function bootstrap() {
    const appId = 'sdk_email-to-task_8bfd604b40';
    const inboxSDKService = new InboxSDKService(appId);

    try {
      await inboxSDKService.initialize();
      inboxSDKService.registerMessageHandlers({
        onOpenMessage: async (emailDetails) => {
          console.log('Email opened:', emailDetails);
        }
      });
          
    }catch (error) {
      console.error('Error initializing InboxSDK:', error);
    }
    
}

bootstrap();