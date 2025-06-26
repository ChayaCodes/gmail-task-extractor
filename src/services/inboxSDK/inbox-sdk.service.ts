import * as InboxSDK from "@inboxsdk/core";
import { EmailDetails } from "/src/types/email.types";

export interface MessageActionHandlers {
  onOpenMessage: (emailDetails: EmailDetails, messageView: any) => void;
}

export class InboxSDKService {
  private sdk: any = null;
  private appId: string;

  constructor(appId: string) {
    this.appId = appId;
  }

  async initialize(): Promise<void> {
    try {
      console.log("Loading InboxSDK...");
      this.sdk = await InboxSDK.load(2, this.appId);
      console.log("InboxSDK loaded successfully");
      return Promise.resolve();
    } catch (error) {
      console.error("Failed to load InboxSDK:", error);
      return Promise.reject(error);
    }
  }

  // רישום מאזינים למייל ולחיצה על כפתורים
  public registerMessageHandlers(handlers: MessageActionHandlers): void {
    if (!this.sdk) {
      console.error("InboxSDK not initialized");
      return;
    }

    this.sdk.Conversations.registerMessageViewHandler((messageView: any) => {
      const emailDetails = this.extractEmailDetails(messageView);
      handlers.onOpenMessage(emailDetails, messageView);
    });
  }

  private extractEmailDetails(messageView: any): EmailDetails {

    const sender = messageView.getSender();
    const bodyElement = messageView.getBodyElement();
    
    return {
      senderName: sender?.name || "",
      senderEmail: sender?.emailAddress || "",
      dateTime: messageView.getDateString() || new Date().toISOString(),
      subject: messageView.getThreadView().getSubject() || "",
      body: bodyElement ? bodyElement.textContent || '' : ''
    };
  }
}
