import { EmailDetails } from '../types/email.types';
import { Event } from '../types/event.types';

export interface EventExtractor {
    getEventSuggestions(emailDetails: EmailDetails): Promise<Event[]>;
}