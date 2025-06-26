import { CalendarEvent, CalendarService } from '../../interfaces/calendar.interface';

export class GoogleCalendar implements CalendarService {
    isAuthenticated(): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
    addEvent(event: CalendarEvent): Promise<string> {
        throw new Error('Method not implemented.');
    }
    updateEvent(eventId: string, updatedEvent: CalendarEvent): Promise<void> {
        throw new Error('Method not implemented.');
    }
    deleteEvent(eventId: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
    getEvents(startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
        throw new Error('Method not implemented.');
    }

}