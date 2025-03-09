const express = require('express');
const app = express();
const puppeteer = require('puppeteer');
const path = require('path');

// Serve static files
app.use(express.static('public'));
app.use(express.json());

// API endpoint to take screenshot
app.post('/api/screenshot', async (req, res) => {
    const { url } = req.body;
    
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }
    
    try {
        // Ensure URL has proper protocol
        let targetUrl = url;
        if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
            targetUrl = 'https://' + targetUrl;
        }
        
        console.log(`Taking screenshot of: ${targetUrl}`);
        
        // Get screenshot as base64 string
        const screenshotBase64 = await takeScreenshot(targetUrl);
        
        // Return the base64 data to the client
        res.json({ 
            success: true, 
            screenshot: screenshotBase64,
            url: targetUrl
        });
    } catch (error) {
        console.error('Error taking screenshot:', error);
        res.status(500).json({ 
            error: 'Failed to take screenshot', 
            details: error.message
        });
    }
});

async function takeScreenshot(url) {
    let browser = null;
    try {
        // Launch browser - use bundled Chromium for Vercel compatibility
        browser = await puppeteer.launch({
            // Omit executablePath for serverless environments
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        // Set viewport size
        await page.setViewport({
            width: 1280,
            height: 800,
            deviceScaleFactor: 1,
        });
        
        // Navigate to URL with timeout and wait for network idle
        await page.goto(url, { 
            waitUntil: 'networkidle2',
            timeout: 30000
        });
        
        // Take screenshot and return as base64
        const screenshot = await page.screenshot({ 
            fullPage: true,
            encoding: 'base64'
        });
        
        return screenshot;
    } finally {
        if (browser) await browser.close();
    }
}

// Start the server (not needed for Vercel, but useful for local development)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Export for serverless
module.exports = app;

