export interface Event {
  id?: string;
  title: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  location?: string;
  status: 'suggested' | 'edited' | 'confirmed' | 'rejected';
  mailLink?: string;
}