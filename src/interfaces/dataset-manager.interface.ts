import { DatasetEntry, DatasetStats } from '/src/types/dataset.types';

/**
 * Interface for dataset management operations
 * Provides clean abstraction for dataset CRUD operations
 */
export interface DatasetManager {
  /**
   * Get statistical information about the dataset
   */
  getStats(): DatasetStats;

  /**
   * Get all dataset entries with optional filtering
   */
  getAllEntries(filter?: {
    action?: 'approved' | 'rejected';
    fromDate?: string;
    toDate?: string;
  }): DatasetEntry[];

  /**
   * Export dataset to JSON format for model training
   */
  exportToJson(): string;

  /**
   * Clear all dataset entries
   */
  clearDataset(): void;

  /**
   * Get dataset configuration
   */
  getConfig(): {
    maxEntries: number;
    storageKey: string;
    autoSave: boolean;
  };
}
