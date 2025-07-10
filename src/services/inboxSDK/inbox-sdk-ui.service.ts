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
    // שמור את ה-handlers הנוכחיים (בלי לעטוף אותם)
    this.currentHandlers = handlers;

    const sidebarEl = this.currentSidebarEl;
    if (this.currentSidebarPanel) {
      this.currentSidebarPanel.open();
    }

    if (this.currentSidebarPanel && sidebarEl) {
      this.renderSidebar(events);
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

  public updateSidebarWithEvents(events: Event[]): void {
    if (events.length === 0) {
      // אם אין עוד אירועים, הצג מצב ריק ואז סגור את ה-sidebar
      this.showEmptyState();
      setTimeout(() => {
        this.closeSidebar();
      }, 500);
    } else {
      // עדכן את ה-sidebar עם הרשימה החדשה
      this.updateEvents(events);
    }
  }

  public updateEvents(events: Event[]): void {
    console.log("Updating sidebar with new events:", events.length);
    this.renderSidebar(events);
  }

  public showEmptyState(): void {
    console.log("Showing empty state");
    this.renderSidebar([]);
  }

  private renderSidebar(events?: Event[]): void {
    if (this.currentSidebarEl && this.currentHandlers) {
      const eventsToRender = events || this.currentEvents;
      render(
        h(EventSidebar, {
          events: eventsToRender,
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