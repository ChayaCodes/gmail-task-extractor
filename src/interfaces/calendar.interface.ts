import { Event } from '../types/event.types';



export interface CalendarService {
  addEvent(event: Event): Promise<string>;
}