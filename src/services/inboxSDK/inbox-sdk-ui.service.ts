import { h, render } from "preact";
import { Event } from "/src/types/event.types";
import { EventSidebar } from "/src/ui/components/events/EventSidebar";

export class InboxSDKUIService {
  private currentSidebarPanel: any = null;
  private currentSidebarElement: HTMLElement | null = null;

  public showEventSidebar(
    events: Event[],
    messageView: any,
    options: {
      onEventUpdate: (event: Event) => void;
      onEventApprove: (event: Event) => void;
      onEventReject: (event: Event) => void;
    }
  ): void {
    this.closeCurrentSidebar();

    const sidebarEl = document.createElement("div");
    this.currentSidebarElement = sidebarEl;

    this.currentSidebarPanel = messageView.getThreadView().addSidebarContentPanel({
      el: sidebarEl,
      title: "Tasks",
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/2098/2098402.png',
      className: "event-sidebar-panel",

    });

    render(
      h(EventSidebar, {
        events: events,
        onEventUpdate: options.onEventUpdate,
        onEventApprove: options.onEventApprove,
        onEventReject: options.onEventReject,
        onClose: () => this.closeCurrentSidebar(),
      }),
      sidebarEl
    );
  }

  public closeCurrentSidebar(): void {
    if (this.currentSidebarPanel) {
      this.currentSidebarPanel.close();
    }
  }
}

// filepath: d:\Users\user\projects\gmail-task-extractor\src\services\inboxSDK\inbox-sdk-ui.service.ts
