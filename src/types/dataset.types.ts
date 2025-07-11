import { Event } from './event.types';

/**
 * Event interface for dataset storage with serializable dates
 */
export interface DatasetEvent {
  id?: string;
  title: string;
  description?: string;
  startDateTime: string; // ISO string format for JSON serialization
  endDateTime: string;   // ISO string format for JSON serialization
  location?: string;
  status?: 'suggested' | 'edited' | 'confirmed' | 'rejected';
  mailLink?: string;
}

/**
 * Interface for dataset entries used for model training
 * Each entry represents a user's interaction with an event detection
 */
export interface DatasetEntry {
  /** Email subject line */
  emailSubject: string;
  
  /** Full email body content */
  emailBody: string;
  
  /** Email sender address */
  emailSender: string;
  
  /** Email date in ISO string format */
  emailDate: string;
  
  /** 
   * Array of events - contains the event if approved, empty if rejected 
   * This follows the pattern requested where rejected events result in empty array
   */
  events: DatasetEvent[];
  
  /** User action taken on the event */
  action: 'approved' | 'rejected';
  
  /** Timestamp when the action was taken */
  timestamp: string;
}

/**
 * Configuration for dataset collection and export
 */
export interface DatasetConfig {
  /** Maximum number of entries to keep in memory */
  maxEntries?: number;
  
  /** Storage key for localStorage */
  storageKey: string;
  
  /** Whether to auto-export when reaching max entries */
  autoExport?: boolean;
}

/**
 * Statistics about the collected dataset
 */
export interface DatasetStats {
  totalEntries: number;
  approvedEntries: number;
  rejectedEntries: number;
  lastUpdated: string;
}
