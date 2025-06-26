import { Event } from '../types/event.types';

export interface CalendarEvent {
  title: string;
  description: string;
  start: Date;
  end: Date;
  location?: string;
}

export interface CalendarService {
  addEvent(event: CalendarEvent): Promise<string>;
}