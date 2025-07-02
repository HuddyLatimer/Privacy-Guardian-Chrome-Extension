# Privacy Guardian Chrome Extension

A comprehensive privacy protection extension that helps you maintain control over your browsing data and block unwanted trackers.

## Showcase

![Privacy Guardian Interface](screenshots/popup.png)

### Key Features Demonstrated:
- 🛡️ **Active Protection**: Real-time tracker and social widget blocking
- 🌙 **Dark Theme Interface**: Clean, modern design with blue accents
- 📊 **Live Counter**: Shows number of blocked trackers
- 🎯 **Granular Controls**: Toggle specific protection features
- 🗑️ **Data Clearing**: One-click browsing data removal

## Features

- Block common tracking scripts and cookies automatically
- Block social media widgets and trackers
- Clear browsing data with one click
- Visual feedback for blocked trackers
- Counter showing number of trackers blocked
- Dark theme interface with modern design
- Persistent settings

## Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory
5. The Privacy Guardian icon should appear in your Chrome toolbar

## Usage

### Main Controls

- Click the extension icon to open the popup interface
- Use the master toggle to enable/disable all protection features
- Individual toggles for specific protection features:
  - Tracking Scripts
  - Social Widgets
  - Cookie Control
- Click "Clear Browsing Data" to remove history, cookies, and cache

### Visual Feedback

- The extension shows notifications when trackers are blocked
- Counter displays the total number of blocked trackers
- Toggle switches show the current state of each protection feature

## Privacy Features

### Tracker Blocking
- Google Analytics
- Facebook Pixel
- Twitter Analytics
- LinkedIn Ads
- Various other common tracking services

### Social Widget Blocking
- Facebook Like/Share buttons
- Twitter embeds
- LinkedIn widgets
- Other social media integration elements

### Cookie Control
- Blocks third-party cookies
- Controls cookie headers
- Provides option to clear all cookies

## Testing

A test page is included to verify the extension's functionality:
1. Run the test server: `python server.py`
2. Visit `http://localhost:8000/test.html`
3. The page will show which trackers and widgets are being blocked
4. Check the extension popup for the tracker count

## Development

The extension is built using vanilla JavaScript and Chrome Extension APIs. The main components are:

- `manifest.json`: Extension configuration
- `popup.html/js/css`: User interface
- `background.js`: Core blocking functionality
- `content.js`: Page-level blocking and notifications

## License

MIT License - Feel free to use and modify as needed. 