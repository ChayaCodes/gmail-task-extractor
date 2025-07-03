import { CalendarService } from '../../interfaces/calendar.interface';
import { GoogleAuthService } from '../auth/oauth-service';
import {Event} from '/src/types/event.types';

export class GoogleCalendar implements CalendarService {


    async addEvent(event: Event): Promise<string> {
        const token = await GoogleAuthService.getAuthToken();
        // Convert Event fields to ISO strings for Google Calendar
        const startDateTime = event.startDateTime.toISOString();
        const endDateTime = event.endDateTime.toISOString();

        const googleEvent = {
            summary: event.title,
            description: event.description,
            start: {
            dateTime: startDateTime,
            timeZone: 'Asia/Jerusalem',
            },
            end: {
            dateTime: endDateTime,
            timeZone: 'Asia/Jerusalem',
            },
            location: event.location,
        };

        const response = await fetch(
            `https://www.googleapis.com/calendar/v3/calendars/primary/events?key=${GoogleAuthService.getApiKey()}`,
            {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(googleEvent)
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error('Failed to add event: ' + (error.error?.message || response.statusText));
        }

        const data = await response.json();
        console.log('Event added to Google Calendar:', data);
        return data.id;
    }
}