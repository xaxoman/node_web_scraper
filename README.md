# Web Scraper Tool

A web-based application that allows users to scrape information from any website. The tool captures screenshots, extracts links, and provides content previews.

## Demo

https://user-images.githubusercontent.com/yourusername/assets/demo.mp4

<video width="100%" controls>
    <source src="" type="video/mp4">
    Your browser does not support the video tag.
</video>

Watch the video above to see the Web Scraper Tool in action.

## Features

- **Web Scraping**: Extract information from any website by providing its URL
- **Screenshot Capture**: Take full-page screenshots of websites
- **Link Extraction**: Collect all links present on the target webpage
- **Content Preview**: Get a preview of the page content
- **Download Options**: Save screenshots to your local machine


## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14.x or higher)
- Google Chrome browser
- npm (usually comes with Node.js)

## Installation

1. Clone the repository or download the source code:
   ```
   git clone <repository-url>
   ```
   or download and extract the ZIP file.

2. Navigate to the project directory:
   ```
   cd node_web_scraper
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Make sure the path to Chrome executable in `index.js` matches your system:
   ```javascript
   executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
   ```
   Update this path if Chrome is installed in a different location.

## Usage

> **Note**: This tool doesn't work on WSL (Windows Subsystem for Linux). If you're using Windows, please run the script in PowerShell. The tool works normally on native Linux systems.


1. Start the server:
   ```
   node index.js
   ```

2. Open your web browser and navigate to:
   ```
   http://localhost:3000
   ```

3. Enter a URL in the input field (including the protocol, e.g., https://example.com)

4. Click the "Scrape Website" button and wait for the results

5. View the screenshot, content preview, and list of links extracted from the website

6. Use the "View Full Screenshot" or "Download" buttons to interact with the screenshot

## Project Structure

```
8-node_web_scraper/
│
├── index.js            # Server code and Puppeteer implementation
├── public/             # Frontend assets
│   ├── index.html      # Main HTML page
│   ├── style.css       # CSS styles
│   ├── client.js       # Client-side JavaScript
│   └── screenshots/    # Generated screenshots (created automatically)
└── README.md           # This file
```

## How It Works

1. The client sends a URL to the server via a POST request to `/api/scrape`
2. The server uses Puppeteer to visit the URL and:
   - Capture a full-page screenshot
   - Extract the page title
   - Collect all links on the page
   - Get a preview of the page content
3. The server saves the screenshot to the `public/screenshots` directory and returns all data to the client
4. The client displays the results, including the screenshot, links, and content preview


## Limitations

- Some websites may block scraping attempts
- For large websites, screenshot capture may take longer
- CORS policies may prevent scraping certain websites

## License

This project is licensed under the MIT License - see the LICENSE file for details.

