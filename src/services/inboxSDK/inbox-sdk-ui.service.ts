import { h, render } from "preact";
import { Event } from "/src/types/event.types";
import { EventSidebar } from "/src/ui/components/events/EventSidebar";

export class InboxSDKUIService {
  private currentSidebarPanel: any = null;

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
    sidebarEl.className = "event-sidebar-container";

    this.currentSidebarPanel = messageView.addSidebarPanel({
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
      const container = this.currentSidebarPanel.getElement();
      if (container) {
        render(null, container);
      }

      this.currentSidebarPanel.destroy();
      this.currentSidebarPanel = null;
    }
  }
}
