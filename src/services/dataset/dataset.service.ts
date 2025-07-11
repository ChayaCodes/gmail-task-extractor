import { DatasetEntry, DatasetConfig, DatasetStats, DatasetEvent } from '/src/types/dataset.types';
import { Event } from '/src/types/event.types';
import { EmailDetails } from '/src/types/email.types';
import { DatasetManager } from '/src/interfaces/dataset-manager.interface';
import { ExtensionStorage } from '/src/utils/storage';

/**
 * Service for managing dataset collection for model training
 * Handles saving, loading, and exporting user interactions with event detection
 */
export class DatasetService implements DatasetManager {
    private entries: DatasetEntry[] = [];
    private config: DatasetConfig;

    constructor(config: Partial<DatasetConfig> = {}) {
        this.config = {
            maxEntries: 1000,
            storageKey: 'gmail-event-extractor-dataset',
            autoExport: false,
            ...config
        };
    }

    /**
     * Initialize the service by loading existing data from storage
     */
    public async initialize(): Promise<void> {
        await this.loadFromStorage();
    }

    /**
     * Save an approved event to the dataset
     */
    public async saveApprovedEvent(emailDetails: EmailDetails, event: Event): Promise<void> {
        const entry = this.createDatasetEntry(emailDetails, [event], 'approved');
        await this.addEntry(entry);
    }

    /**
     * Save a rejected event to the dataset
     */
    public async saveRejectedEvent(emailDetails: EmailDetails, event: Event): Promise<void> {
        const entry = this.createDatasetEntry(emailDetails, [], 'rejected');
        await this.addEntry(entry);
    }

    /**
     * Get dataset statistics
     */
    public getStats(): DatasetStats {
        const approvedEntries = this.entries.filter(entry => entry.action === 'approved').length;
        const rejectedEntries = this.entries.filter(entry => entry.action === 'rejected').length;

        return {
            totalEntries: this.entries.length,
            approvedEntries,
            rejectedEntries,
            lastUpdated: this.entries.length > 0
                ? this.entries[this.entries.length - 1].timestamp
                : new Date().toISOString()
        };
    }

    /**
     * Export dataset as JSON file
     */
    public exportDataset(): void {
        try {
            const stats = this.getStats();
            const exportData = {
                metadata: {
                    exportDate: new Date().toISOString(),
                    ...stats
                },
                entries: this.entries
            };

            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `gmail-event-extractor-dataset-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            console.log(`Dataset exported: ${stats.totalEntries} entries`);
        } catch (error) {
            console.error('Failed to export dataset:', error);
            throw new Error('Dataset export failed');
        }
    }

    /**
     * Clear all dataset entries
     */
    public async clearDataset(): Promise<void> {
        this.entries = [];
        await this.saveToStorage();
        console.log('Dataset cleared');
    }

    /**
     * Get current dataset entries (for debugging/inspection)
     */
    public getEntries(): ReadonlyArray<DatasetEntry> {
        return [...this.entries];
    }

    private createDatasetEntry(
        emailDetails: EmailDetails,
        events: Event[],
        action: 'approved' | 'rejected'
    ): DatasetEntry {
        // Convert events to serializable format with proper date handling
        const serializableEvents: DatasetEvent[] = events.map(event => ({
            ...event,
            startDateTime: event.startDateTime ? event.startDateTime.toISOString() : '',
            endDateTime: event.endDateTime ? event.endDateTime.toISOString() : ''
        }));

        return {
            emailSubject: emailDetails.subject,
            emailBody: emailDetails.body,
            emailSender: `${emailDetails.senderName} <${emailDetails.senderEmail}>`,
            emailDate: emailDetails.dateTime,
            events: serializableEvents,
            action,
            timestamp: new Date().toISOString()
        };
    }

    private async addEntry(entry: DatasetEntry): Promise<void> {
        this.entries.push(entry);

        // Manage max entries
        if (this.config.maxEntries && this.entries.length > this.config.maxEntries) {
            this.entries = this.entries.slice(-this.config.maxEntries);
        }

        await this.saveToStorage();

        // Auto-export if configured
        if (this.config.autoExport && this.entries.length % 100 === 0) {
            this.exportDataset();
        }

        console.log(`Dataset entry saved: ${entry.action.toUpperCase()}`, {
            subject: entry.emailSubject,
            eventCount: entry.events.length,
            totalEntries: this.entries.length
        });
    }

    private async saveToStorage(): Promise<void> {
        try {
            const data = {
                entries: this.entries,
                lastSaved: new Date().toISOString()
            };
            await ExtensionStorage.setItem(this.config.storageKey, data);
        } catch (error) {
            console.error('Failed to save dataset to storage:', error);
        }
    }

    private async loadFromStorage(): Promise<void> {
        try {
            const data = await ExtensionStorage.getItem(this.config.storageKey);
            if (data) {
                this.entries = data.entries || [];
                console.log(`Loaded ${this.entries.length} dataset entries from storage`);
            }
        } catch (error) {
            console.error('Failed to load dataset from storage:', error);
            this.entries = [];
        }
    }

    /**
     * Get all dataset entries with optional filtering
     */
    public getAllEntries(filter?: {
        action?: 'approved' | 'rejected';
        fromDate?: string;
        toDate?: string;
    }): DatasetEntry[] {
        let filtered = [...this.entries];

        if (filter?.action) {
            filtered = filtered.filter(entry => entry.action === filter.action);
        }

        if (filter?.fromDate) {
            filtered = filtered.filter(entry => entry.timestamp >= filter.fromDate!);
        }

        if (filter?.toDate) {
            filtered = filtered.filter(entry => entry.timestamp <= filter.toDate!);
        }

        return filtered;
    }

    /**
     * Export dataset to JSON format for model training
     */
    public exportToJson(): string {
        const exportData = {
            metadata: {
                exportDate: new Date().toISOString(),
                totalEntries: this.entries.length,
                stats: this.getStats()
            },
            entries: this.entries
        };

        return JSON.stringify(exportData, null, 2);
    }

    /**
     * Get dataset configuration
     */
    public getConfig(): {
        maxEntries: number;
        storageKey: string;
        autoSave: boolean;
    } {
        return {
            maxEntries: this.config.maxEntries || 1000,
            storageKey: this.config.storageKey,
            autoSave: this.config.autoExport || false
        };
    }
}
