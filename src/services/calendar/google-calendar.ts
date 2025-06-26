import { CalendarEvent, CalendarService } from '../../interfaces/calendar.interface';
import { GoogleAuthService } from '../auth/oauth-service';

export class GoogleCalendar implements CalendarService {
    private oauthService: GoogleAuthService;
    private apiKey: string;

    constructor() {
        this.oauthService = new GoogleAuthService();
        this.apiKey = (this.oauthService as any).apiKey || process.env.GOOGLE_CREDENTIALS_API_KEY || '';
    }

    async addEvent(event: CalendarEvent): Promise<string> {
        const token = await this.oauthService.getAuthToken();
        const googleEvent = {
            summary: event.title,
            description: event.description,
            start: {
                dateTime: event.start.toISOString(),
                timeZone: 'Asia/Jerusalem',
            },
            end: {
                dateTime: event.end.toISOString(),
                timeZone: 'Asia/Jerusalem',
            },
            location: event.location,
        };

        const response = await fetch(
            `https://www.googleapis.com/calendar/v3/calendars/primary/events?key=${this.apiKey}`,
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