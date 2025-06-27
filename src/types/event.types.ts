export interface Event {
  id?: string;
  title: string;
  description?: string;
  startDateTime: Date;
  endDateTime: Date;
  location?: string;
  status?: 'suggested' | 'edited' | 'confirmed' | 'rejected';
  mailLink?: string;
}