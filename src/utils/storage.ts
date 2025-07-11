/**
 * Storage utility for Chrome extension
 * Handles both localStorage (for content scripts) and chrome.storage (for popup/background)
 */
export class ExtensionStorage {
    private static isExtensionContext(): boolean {
        return typeof chrome !== 'undefined' && !!chrome.storage;
    }

    /**
     * Save data to storage
     */
    static async setItem(key: string, value: any): Promise<void> {
        try {
            if (this.isExtensionContext()) {
                // Use chrome.storage for extension context
                await chrome.storage.local.set({ [key]: value });
            } else {
                // Use localStorage for content script context
                localStorage.setItem(key, JSON.stringify(value));
            }
        } catch (error) {
            console.error('Failed to save to storage:', error);
            throw error;
        }
    }

    /**
     * Get data from storage
     */
    static async getItem(key: string): Promise<any> {
        try {
            if (this.isExtensionContext()) {
                // Use chrome.storage for extension context
                const result = await chrome.storage.local.get([key]);
                return result[key] || null;
            } else {
                // Use localStorage for content script context
                const stored = localStorage.getItem(key);
                return stored ? JSON.parse(stored) : null;
            }
        } catch (error) {
            console.error('Failed to get from storage:', error);
            return null;
        }
    }

    /**
     * Remove data from storage
     */
    static async removeItem(key: string): Promise<void> {
        try {
            if (this.isExtensionContext()) {
                await chrome.storage.local.remove([key]);
            } else {
                localStorage.removeItem(key);
            }
        } catch (error) {
            console.error('Failed to remove from storage:', error);
            throw error;
        }
    }

    /**
     * Get all dataset entries (for backward compatibility)
     */
    static async getDatasetEntries(): Promise<any> {
        const key = 'gmail-event-extractor-dataset';
        return await this.getItem(key);
    }
}
