document.addEventListener('DOMContentLoaded', () => {
    const scrapeForm = document.getElementById('scrape-form');
    const urlInput = document.getElementById('url-input');
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');
    const resultsElement = document.getElementById('results');
    
    // Elements for displaying results
    const pageTitleElement = document.getElementById('page-title');
    const screenshotElement = document.getElementById('screenshot');
    const viewScreenshotLink = document.getElementById('view-screenshot');
    const downloadScreenshotLink = document.getElementById('download-screenshot');
    const contentPreviewElement = document.getElementById('content-preview');
    const linksCountElement = document.getElementById('links-count');
    const linksListElement = document.getElementById('links-list');
    
    scrapeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get the URL from input
        const url = urlInput.value.trim();
        
        // Validate URL
        if (!url) {
            showError('Please enter a valid URL.');
            return;
        }
        
        // Show loading, hide other elements
        loadingElement.style.display = 'block';
        errorElement.style.display = 'none';
        resultsElement.style.display = 'none';
        
        try {
            // Make API request to scrape the website
            const response = await fetch('/api/scrape', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url }),
            });
            
            // Check if the response is successful
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to scrape the website');
            }
            
            // Get the result data
            const data = await response.json();
            
            // Display the results
            displayResults(data, url);
            
            // Hide loading, show results
            loadingElement.style.display = 'none';
            resultsElement.style.display = 'block';
            
        } catch (error) {
            // Handle errors
            loadingElement.style.display = 'none';
            showError(error.message || 'An unexpected error occurred.');
        }
    });
    
    function showError(message) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    
    function displayResults(data, originalUrl) {
        // Set page title
        pageTitleElement.textContent = data.title || 'Untitled Page';
        
        // Set screenshot
        screenshotElement.src = data.screenshot;
        viewScreenshotLink.href = data.screenshot;
        downloadScreenshotLink.href = data.screenshot;
        
        // Set filename for download
        const domain = new URL(originalUrl).hostname;
        downloadScreenshotLink.download = `screenshot-${domain}.png`;
        
        // Set content preview
        contentPreviewElement.textContent = data.content || 'No content available';
        
        // Set links count
        const linkCount = data.links?.length || 0;
        linksCountElement.textContent = `Links Found (${linkCount}):`;
        
        // Clear previous links
        linksListElement.innerHTML = '';
        
        // Add links to the list
        if (data.links && data.links.length > 0) {
            // Only display first 20 links to avoid overwhelming the UI
            const displayLinks = data.links.slice(0, 20);
            
            displayLinks.forEach(link => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = link.href;
                a.textContent = link.text || link.href;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                li.appendChild(a);
                linksListElement.appendChild(li);
            });
            
            // Add message if there are more links
            if (data.links.length > 20) {
                const li = document.createElement('li');
                li.textContent = `... and ${data.links.length - 20} more links`;
                linksListElement.appendChild(li);
            }
        } else {
            const li = document.createElement('li');
            li.textContent = 'No links found on page';
            linksListElement.appendChild(li);
        }
    }
});