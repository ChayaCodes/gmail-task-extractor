# Dataset Collection System

The Gmail Task Extractor includes a comprehensive dataset collection system for training machine learning models to improve event extraction accuracy.

## Overview

The dataset system automatically captures user interactions with event suggestions, creating training data that can be used to enhance the AI model's performance over time.

## What Data is Collected

For each user interaction, the system records:

- **Email Details**: Subject, body content, sender information, and timestamp
- **Extracted Events**: Complete event details including title, description, date/time, and location
- **User Action**: Whether the event was approved (added to calendar) or rejected
- **Interaction Timestamp**: When the user made the decision

## Data Structure

Each dataset entry follows this structure:

```typescript
interface DatasetEntry {
  emailSubject: string;
  emailBody: string;
  emailSender: string;
  emailDate: string;
  events: Event[]; // Contains event if approved, empty array if rejected
  action: 'approved' | 'rejected';
  timestamp: string;
}
```

## Data Storage

- Data is stored locally in the browser's localStorage
- No data is transmitted to external servers
- Maximum of 1000 entries are kept by default (configurable)
- Older entries are automatically removed when limit is reached

## Exporting Dataset

### Programmatic Export

```typescript
import { DatasetUtils } from '/src/utils/dataset-utils';

// Export to downloadable file
await DatasetUtils.exportDatasetToFile();

// Copy to clipboard
await DatasetUtils.copyDatasetToClipboard();

// Get statistics
const stats = DatasetUtils.getDatasetStats();
console.log(`Total entries: ${stats.totalEntries}`);
console.log(`Approved: ${stats.approvedEntries}`);
console.log(`Rejected: ${stats.rejectedEntries}`);
```

### Manual Export

You can access the dataset through the browser's developer console:

```javascript
// Get all entries
const entries = JSON.parse(localStorage.getItem('gmail-events-dataset'));

// Export to console
console.log(JSON.stringify(entries, null, 2));
```

## Data Privacy

- All data remains on the user's device
- No personal information is transmitted externally
- Users can clear the dataset at any time
- The system complies with privacy regulations

## Configuration

The dataset system can be configured with these options:

```typescript
interface DatasetConfig {
  maxEntries?: number;     // Maximum entries to store (default: 1000)
  storageKey: string;      // localStorage key (default: 'gmail-events-dataset')
  autoExport?: boolean;    // Auto-export when reaching max entries
}
```

## Architecture

The dataset system follows clean architecture principles:

- **DatasetService**: Core business logic for data management
- **DatasetManager Interface**: Clean abstraction for dataset operations
- **DatasetUtils**: Utility functions for export and management
- **Type Definitions**: Comprehensive TypeScript interfaces

## Future Enhancements

- Machine learning pipeline integration
- Data quality validation
- Advanced filtering and search capabilities
- Automated model retraining
- Performance analytics and insights
