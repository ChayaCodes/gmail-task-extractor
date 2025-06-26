import { EmailDetails } from '../types/email.types';

export interface EmailParser {
  parseEmailContent(messageView: any): EmailDetails;
}