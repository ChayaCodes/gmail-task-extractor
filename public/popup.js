// Dataset management for popup
class PopupDatasetManager {
    constructor() {
        this.init();
    }

    async init() {
        await this.loadStats();
        this.bindEvents();
    }

    async loadStats() {
        try {
            // Get data from chrome.storage (shared across extension contexts)
            const result = await chrome.storage.local.get(['gmail-event-extractor-dataset']);
            const data = result['gmail-event-extractor-dataset'];
            
            if (!data || !data.entries) {
                this.showNoDataMessage();
                return;
            }

            const entries = data.entries || [];
            
            const approved = entries.filter(e => e.action === 'approved').length;
            const rejected = entries.filter(e => e.action === 'rejected').length;
            const lastUpdated = entries.length > 0 
                ? new Date(entries[entries.length - 1].timestamp).toLocaleDateString('he-IL')
                : '-';

            document.getElementById('totalEntries').textContent = entries.length;
            document.getElementById('approvedEntries').textContent = approved;
            document.getElementById('rejectedEntries').textContent = rejected;
            document.getElementById('lastUpdated').textContent = lastUpdated;

        } catch (error) {
            console.error('Error loading stats:', error);
            this.showErrorMessage('שגיאה בטעינת הנתונים');
        }
    }

    bindEvents() {
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportDataset();
        });

        document.getElementById('copyBtn').addEventListener('click', () => {
            this.copyToClipboard();
        });

        document.getElementById('clearBtn').addEventListener('click', () => {
            this.clearDataset();
        });
    }

    exportDataset() {
        try {
            chrome.storage.local.get(['gmail-event-extractor-dataset'], (result) => {
                const data = result['gmail-event-extractor-dataset'];
                
                if (!data || !data.entries) {
                    alert('אין נתונים לייצוא');
                    return;
                }

                const exportData = {
                    metadata: {
                        exportDate: new Date().toISOString(),
                        totalEntries: data.entries?.length || 0,
                        exportedBy: 'Gmail Event Extractor v1.0'
                    },
                    entries: data.entries || []
                };

                const blob = new Blob([JSON.stringify(exportData, null, 2)], {
                    type: 'application/json'
                });
                
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `gmail-events-dataset-${new Date().toISOString().split('T')[0]}.json`;
                link.click();
                URL.revokeObjectURL(url);

                this.showSuccessMessage('הקובץ הורד בהצלחה!');
            });
        } catch (error) {
            console.error('Export error:', error);
            this.showErrorMessage('שגיאה בייצוא הקובץ');
        }
    }

    async copyToClipboard() {
        try {
            const result = await chrome.storage.local.get(['gmail-event-extractor-dataset']);
            const data = result['gmail-event-extractor-dataset'];
            
            if (!data || !data.entries) {
                alert('אין נתונים להעתקה');
                return;
            }

            const exportData = {
                metadata: {
                    exportDate: new Date().toISOString(),
                    totalEntries: data.entries?.length || 0
                },
                entries: data.entries || []
            };

            await navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
            this.showSuccessMessage('הועתק ללוח בהצלחה!');
        } catch (error) {
            console.error('Copy error:', error);
            this.showErrorMessage('שגיאה בהעתקה ללוח');
        }
    }

    clearDataset() {
        if (confirm('האם אתה בטוח שברצונך למחוק את כל הנתונים?\nפעולה זו אינה ניתנת לביטול.')) {
            chrome.storage.local.remove(['gmail-event-extractor-dataset'], () => {
                this.loadStats();
                this.showSuccessMessage('הנתונים נמחקו בהצלחה');
            });
        }
    }

    showNoDataMessage() {
        document.getElementById('totalEntries').textContent = '0';
        document.getElementById('approvedEntries').textContent = '0';
        document.getElementById('rejectedEntries').textContent = '0';
        document.getElementById('lastUpdated').textContent = 'אין נתונים';
    }

    showSuccessMessage(message) {
        // Simple alert for now - can be enhanced with better UI
        alert('✅ ' + message);
    }

    showErrorMessage(message) {
        alert('❌ ' + message);
    }
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    new PopupDatasetManager();
});

// Add keyboard shortcuts
document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === 'e') {
        event.preventDefault();
        document.getElementById('exportBtn').click();
    }
    if (event.ctrlKey && event.key === 'c') {
        event.preventDefault();
        document.getElementById('copyBtn').click();
    }
});
