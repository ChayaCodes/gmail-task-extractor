import { CalendarServiceInterface } from '../../interfaces/calendar.interface';
import { GoogleCalendar } from './google-calendar';

export class CalendarService implements CalendarServiceInterface {
    private googleCalendar: GoogleCalendar;

    constructor() {
        this.googleCalendar = new GoogleCalendar();
    }

    async addEvent(eventDetails: any): Promise<void> {
        await this.googleCalendar.createEvent(eventDetails);
    }

    async getEvents(timeRange: { start: Date; end: Date }): Promise<any[]> {
        return await this.googleCalendar.fetchEvents(timeRange);
    }

    async deleteEvent(eventId: string): Promise<void> {
        await this.googleCalendar.removeEvent(eventId);
    }
}