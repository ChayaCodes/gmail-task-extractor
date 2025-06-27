# Gmail Event Extractor

## Overview

The Gmail Event Extractor is a Chrome extension designed to enhance productivity by extracting events from incoming emails and adding them to Google Calendar. Utilizing the InboxSDK, this extension identifies relevant emails, processes them with an AI model, and presents event suggestions in a user-friendly sidebar interface.

## Features

- **Email Processing**: Automatically identifies and extracts events from emails in your inbox.
- **AI Integration**: Uses the GROQ API to analyze email content and generate event suggestions.
- **Calendar Integration**: Seamlessly adds tasks and events to Google Calendar.
- **User Interface**: A sidebar within Gmail that displays task suggestions and allows users to edit or confirm tasks.

## Project Structure

```
gmail-task-extractor
├── src
│   ├── background
│   │   └── background.ts
│   ├── content
│   │   └── main.ts
│   ├── interfaces
│   │   ├── ai-model.interface.ts
│   │   ├── calendar.interface.ts
│   │   └── email-processor.interface.ts
│   ├── services
│   │   ├── ai
│   │   │   ├── groq-service.ts
│   │   │   └── ai-service.ts
│   │   ├── calendar
│   │   │   ├── calendar-service.ts
│   │   │   └── google-calendar.ts
│   │   └── email
│   │       └── email-parser.ts
│   ├── ui
│   │   ├── components
│   │   │   ├── sidebar.ts
│   │   │   ├── task-item.ts
│   │   │   └── task-editor.ts
│   │   └── styles
│   │       └── main.css
│   └── utils
│       ├── storage.ts
│       └── logger.ts
├── public
│   ├── manifest.json
│   ├── icons
│   │   ├── icon16.png
│   │   ├── icon48.png
│   │   └── icon128.png
│   └── popup.html
├── webpack.config.js
├── tsconfig.json
├── package.json
└── README.md
```

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/gmail-task-extractor.git
   ```
2. Navigate to the project directory:
   ```
   cd gmail-task-extractor
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage

1. Load the extension in Chrome:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `public` directory.
2. Open Gmail and start using the extension to extract tasks from your emails.

## Development

- The project is structured to separate concerns, allowing for easy updates and maintenance.
- Interfaces are used to define contracts for services, making it easy to swap out implementations as needed.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
