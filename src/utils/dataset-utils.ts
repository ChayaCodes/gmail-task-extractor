import { DatasetService } from '/src/services/dataset/dataset.service';

/**
 * Utility functions for dataset management and export
 * Can be used in popup or background scripts for dataset administration
 */
export class DatasetUtils {
    private static datasetService: DatasetService | null = null;

    /**
     * Initialize the dataset service if not already done
     */
    private static initService(): DatasetService {
        if (!this.datasetService) {
            this.datasetService = new DatasetService();
        }
        return this.datasetService;
    }

    /**
     * Export dataset to downloadable JSON file
     */
    public static async exportDatasetToFile(): Promise<void> {
        const service = this.initService();
        const jsonData = service.exportToJson();
        const blob = new Blob([jsonData], { type: 'application/json' });
        
        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `gmail-events-dataset-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    /**
     * Get dataset statistics for display
     */
    public static getDatasetStats() {
        const service = this.initService();
        return service.getStats();
    }

    /**
     * Clear the entire dataset (use with caution)
     */
    public static clearDataset(): void {
        const service = this.initService();
        service.clearDataset();
    }

    /**
     * Get filtered dataset entries
     */
    public static getFilteredEntries(filter?: {
        action?: 'approved' | 'rejected';
        fromDate?: string;
        toDate?: string;
    }) {
        const service = this.initService();
        return service.getAllEntries(filter);
    }

    /**
     * Copy dataset JSON to clipboard
     */
    public static async copyDatasetToClipboard(): Promise<void> {
        const service = this.initService();
        const jsonData = service.exportToJson();
        
        try {
            await navigator.clipboard.writeText(jsonData);
            console.log('Dataset copied to clipboard');
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
            throw new Error('Failed to copy dataset to clipboard');
        }
    }

    /**
     * Get dataset configuration information
     */
    public static getConfig() {
        const service = this.initService();
        return service.getConfig();
    }
}
