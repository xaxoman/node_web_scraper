const express = require('express');
const app = express();
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// Create screenshots directory if it doesn't exist
const screenshotsDir = path.join(__dirname, 'public', 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Parse JSON request bodies
app.use(express.json());

// Example function that uses Puppeteer directly
async function scrapeWebsite(url) {
  console.log(`Starting to scrape ${url}...`);
  
  // Generate a unique filename for the screenshot based on timestamp and URL
  const timestamp = Date.now();
  const urlSlug = url.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
  const screenshotFilename = `${timestamp}_${urlSlug}.png`;
  const screenshotPath = path.join(screenshotsDir, screenshotFilename);
  const screenshotRelativePath = `/screenshots/${screenshotFilename}`;
  
  // Specify the path to your Chrome executable
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: "new" // Use new headless mode
  });
  
  const page = await browser.newPage();
  await page.goto(url);
  
  // Example: Get the title of the page
  const title = await page.title();
  console.log(`Page title: ${title}`);
  
  // Example: Get all links on the page
  const links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a')).map(a => {
      return {
        text: a.innerText.trim(),
        href: a.href
      };
    }).filter(link => link.text !== '');
  });
  
  console.log(`Found ${links.length} links`);
  
  // Get page content
  const content = await page.evaluate(() => {
    return document.body.innerText.substring(0, 1000); // First 1000 chars
  });
  
  // Take a full page screenshot
  await page.screenshot({ 
    path: screenshotPath,
    fullPage: true 
  });
  console.log(`Screenshot saved to ${screenshotPath}`);
  
  await browser.close();
  console.log('Browser closed');
  
  return { 
    title, 
    links, 
    content,
    screenshot: screenshotRelativePath
  };
}

// API endpoint to handle scraping requests
app.post('/api/scrape', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    const result = await scrapeWebsite(url);
    res.json(result);
  } catch (error) {
    console.error('Error during scraping:', error);
    res.status(500).json({ error: 'Failed to scrape the website', details: error.message });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});