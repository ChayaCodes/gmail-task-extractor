import { h, render } from "preact";
import { Event } from "/src/types/event.types";
import { EventSidebar } from "/src/ui/components/events/EventSidebar";
import * as InboxSDK from "@inboxsdk/core";

export class InboxSDKUIService {
  private currentSidebarPanel: any = null;
  private currentSidebarEl: HTMLElement | null = null;
  private sdk: any;
  private currentEvents: Event[] = [];
  private currentHandlers: {
    onEventUpdate: (event: Event) => void;
    onEventApprove: (event: Event) => void;
    onEventReject: (event: Event) => void;
  } | null = null;

  constructor(inboxSdkService: any) {
    this.sdk = inboxSdkService.getSdk();
  }
  

  public closeCurrentSidebar(): void {
    if (this.currentSidebarPanel) {
      this.currentSidebarPanel.remove();

    }
  }

  public showNotification(
    message: string,
    options: {
      type?: "info" | "success" | "error";
      timeout?: number;
    } = { type: "info", timeout: 5000 }
  ): void {
    if (!this.sdk) {
      return;
    }
    if (options.type === "error") {
      this.sdk.ButterBar.showError({ text: message, time: options.timeout });
    } else {
      this.sdk.ButterBar.showMessage({
        text: message,
        time: options.timeout,
      });
    }
  }

  public async initSidebar(options: {
    onEventUpdate: (event: Event) => void;
    onEventApprove: (event: Event) => void;
    onEventReject: (event: Event) => void;
  },
    open?: boolean
  ): Promise<void> {
    const sidebarEl = document.createElement("div");
    this.currentSidebarEl = sidebarEl;
    this.currentSidebarPanel = await this.sdk.Global.addSidebarContentPanel({
      el: sidebarEl,
      title: "Events",
      iconUrl: chrome.runtime.getURL('icons/icon.png'),
      className: "event-sidebar-panel",
      hideTitleBar: true,
      visible: open ?? false
    })

    render(
      h(EventSidebar, {
        events: [],
        onEventUpdate: options.onEventUpdate,
        onEventApprove: options.onEventApprove,
        onEventReject: options.onEventReject,
        onClose: () => this.closeSidebar(),
      }),
      sidebarEl
    );
  }

  public addEventsToSidebar(events: Event[], handlers: {
    onEventUpdate: (event: Event) => void;
    onEventApprove: (event: Event) => void;
    onEventReject: (event: Event) => void;
  }): void {
    // שמור את האירועים ו-handlers הנוכחיים
    this.currentEvents = [...events];
    this.currentHandlers = {
      onEventUpdate: handlers.onEventUpdate,
      onEventApprove: (event: Event) => {
        handlers.onEventApprove(event);
        this.removeEventFromSidebar(event);
      },
      onEventReject: (event: Event) => {
        handlers.onEventReject(event);
        this.removeEventFromSidebar(event);
      }
    };

    const sidebarEl = this.currentSidebarEl;
    if (this.currentSidebarPanel) {
      this.currentSidebarPanel.open();
    }

    if (this.currentSidebarPanel && sidebarEl) {
      this.renderSidebar();
      console.log("Events added to sidebar", events);
    } else {
      if (!this.currentSidebarPanel) {
        console.error("Cannot add events - sidebar panel not found");
      }
      if (!sidebarEl) {
        console.error("Cannot add events - sidebar element not found");
      }
    }
  }

  private removeEventFromSidebar(eventToRemove: Event): void {
    // הסר את האירוע מהרשימה - השווה לפי תכונות ייחודיות במקום reference
    const initialCount = this.currentEvents.length;
    console.log("Before removal - events:", this.currentEvents.map(e => ({ title: e.title, time: e.startDateTime.getTime() })));
    console.log("Removing event:", { title: eventToRemove.title, time: eventToRemove.startDateTime.getTime() });
    
    this.currentEvents = this.currentEvents.filter(event => 
      !(event.title === eventToRemove.title && 
        event.startDateTime.getTime() === eventToRemove.startDateTime.getTime() &&
        event.location === eventToRemove.location)
    );
    
    console.log("After removal - events:", this.currentEvents.map(e => ({ title: e.title, time: e.startDateTime.getTime() })));
    console.log(`Events count: ${initialCount} -> ${this.currentEvents.length}`);
    
    // עדכן את התצוגה עם הרשימה החדשה לפני סגירת ה-sidebar
    this.renderSidebar();
    
    // אם אין עוד אירועים, סגור את ה-sidebar אחרי דיליי קצר
    if (this.currentEvents.length === 0) {
      setTimeout(() => {
        this.closeSidebar();
      }, 500); // דיליי של חצי שנייה כדי שהמשתמש יראה שהטופס התרוקן
      return;
    }
  }

  private renderSidebar(): void {
    if (this.currentSidebarEl && this.currentHandlers) {
      render(
        h(EventSidebar, {
          events: this.currentEvents,
          onEventUpdate: this.currentHandlers.onEventUpdate,
          onEventApprove: this.currentHandlers.onEventApprove,
          onEventReject: this.currentHandlers.onEventReject,
          onClose: () => this.closeSidebar(),
        }),
        this.currentSidebarEl
      );
    }
  }

  public closeSidebar(): void {
    if (this.currentSidebarPanel) {
      this.currentSidebarPanel.close();
    }
  }
}