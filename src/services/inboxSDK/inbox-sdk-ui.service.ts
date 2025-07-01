import { h, render } from "preact";
import { Event } from "/src/types/event.types";
import { EventSidebar } from "/src/ui/components/events/EventSidebar";
import * as InboxSDK from "@inboxsdk/core";

export class InboxSDKUIService {
  private currentSidebarPanel: any = null;
  private sdk: any;

  constructor(inboxSdkService: any) {
    this.sdk = inboxSdkService.getSdk();
  }

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

    this.currentSidebarPanel = messageView.getThreadView().addSidebarContentPanel({
      el: sidebarEl,
      title: "",
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/2098/2098402.png',
      className: "event-sidebar-panel",
      hideTitleBar: true,

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

  public addSidebar(options: {
    onEventUpdate: (event: Event) => void;
    onEventApprove: (event: Event) => void;
    onEventReject: (event: Event) => void;
  },
  open?: boolean
): void {
    const sidebarEl = document.createElement("div");
    this.currentSidebarPanel = this.sdk.Global.addSidebarContentPanel({
      el: sidebarEl,
      title: "Events",
      iconUrl: '/icon.png',
      className: "event-sidebar-panel",
      hideTitleBar: true,
      visible: open ?? false
    });

    render(
      h(EventSidebar, {
        events: [],
        onEventUpdate: options.onEventUpdate,
        onEventApprove: options.onEventApprove,
        onEventReject: options.onEventReject,
        onClose: () => this.closeCurrentSidebar(),
      }),
      sidebarEl
    );
  }

  public closeSidebar(): void {
    if (this.currentSidebarPanel) {
      this.currentSidebarPanel.close();
    }
  }
}