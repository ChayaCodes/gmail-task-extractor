export interface CalendarService {
    addEvent(event: CalendarEvent): Promise<void>;
    updateEvent(eventId: string, updatedEvent: CalendarEvent): Promise<void>;
    deleteEvent(eventId: string): Promise<void>;
    getEvents(startDate: Date, endDate: Date): Promise<CalendarEvent[]>;
}

export interface CalendarEvent {
    id?: string;
    title: string;
    start: Date;
    end: Date;
    description?: string;
    location?: string;
}