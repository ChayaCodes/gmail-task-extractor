# Gmail Event Extractor

## Overview

**Gmail Event Extractor** is a Chrome extension that automatically detects tasks and events in your Gmail emails, displays them in an interactive sidebar, and lets you add them directly to your Google Calendar. The extension uses InboxSDK, AI (GROQ API), and a modern Preact-based UI.

---

## Features

- **Automatic detection of events and tasks** in Gmail emails.
- **AI-powered suggestions (GROQ API)** for smart event extraction.
- **One-click add to Google Calendar** (with automatic link to the original email).
- **Interactive UI:** Edit, approve, reject, or manually add tasks from the sidebar.
- **GROQ API key stored locally** (prompted only on first use).
- **Google authentication (OAuth)** directly from the sidebar.
- **Persistent sidebar button** for manual activation, even without a detected email.

---

## Project Structure

```
gmail-task-extractor
├── src
│   ├── background/         # Chrome background scripts (OAuth, permissions)
│   ├── content/            # Content scripts (main logic, Gmail integration)
│   ├── interfaces/         # TypeScript interfaces
│   ├── services/           # Business logic (AI, calendar, auth, storage, InboxSDK)
│   ├── types/              # Type definitions (Event, EmailDetails, etc.)
│   ├── ui/
│   │   ├── components/     # Preact components (Sidebar, Forms, Actions)
│   │   └── styles/         # CSS files
│   └── utils/              # Utilities (logger, storage, date formatting)
├── public/                 # Manifest, popup, icons
├── tests/                  # Unit & integration tests
├── webpack.config.js
├── tsconfig.json
├── package.json
└── README.md
```

---

## Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/yourusername/gmail-task-extractor.git
   cd gmail-task-extractor
   ```
2. **Install dependencies:**

   ```sh
   npm install
   ```
3. **Build the extension:**

   ```sh
   npm run build
   ```
4. **Load in Chrome:**

   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `public` directory

---

## First Use & Configuration


1. **Google Authentication:**
   in the first time you click on the approve task button, you will be prompted to authenticate with your Google account. This is required to access your calendar and add events.

---

## Usage

- **Sidebar Activation:**

  - Automatically opens when an event/task is detected in an email.

- **Task Management:**

  - Edit, approve, reject.
  - Every event added to your calendar includes a link to the original email.

---

## Development

- **Run unit tests:**
  ```sh
  npm run test:unit
  ```
- **Run integration tests:**
  ```sh
  npm run test:integration
  ```
- **Development build (auto-rebuild):**
  ```sh
  npm run watch
  ```

---

## Contribution

Pull requests, bug reports, and suggestions are welcome!

---

## License

MIT

---

## Screenshots

### Gmail sidebar with detected events
![Sidebar with detected events](./screenshots/gmail.png)

### event added to Google Calendar
![Add event to Google Calendar](./screenshots/calendar.png)

---

**Questions?**
Open an issue or contact us by email.
