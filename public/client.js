document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('scrape-form');
    const urlInput = document.getElementById('url-input');
    const loading = document.getElementById('loading');
    const results = document.getElementById('results');
    const error = document.getElementById('error');
    
    // Elements for displaying results
    const pageTitle = document.getElementById('page-title');
    const contentPreview = document.getElementById('content-preview');
    const linksCount = document.getElementById('links-count');
    const linksList = document.getElementById('links-list');
    const screenshot = document.getElementById('screenshot');
    const viewScreenshot = document.getElementById('view-screenshot');
    const downloadScreenshot = document.getElementById('download-screenshot');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get the URL
        const url = urlInput.value.trim();
        if (!url) {
            showError('Please enter a valid URL');
            return;
        }
        
        // Reset UI
        hideResults();
        hideError();
        showLoading();
        
        try {
            // Send request to scrape the URL
            const response = await fetch('/api/scrape', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url })
            });
            
            // Check if the request was successful
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to scrape the website');
            }
            
            // Parse response
            const data = await response.json();
            
            // Display the results
            pageTitle.textContent = data.title;
            contentPreview.textContent = data.content || 'No content found.';
            linksCount.textContent = `Links Found (${data.links.length}):`;
            
            // Set up screenshot
            if (data.screenshot) {
                screenshot.src = data.screenshot;
                viewScreenshot.href = data.screenshot;
                downloadScreenshot.href = data.screenshot;
                
                // Extract filename for download attribute
                const filename = data.screenshot.split('/').pop();
                downloadScreenshot.setAttribute('download', filename);
            }
            
            // Display links
            linksList.innerHTML = '';
            const maxLinks = Math.min(data.links.length, 15); // Show max 15 links
            
            for (let i = 0; i < maxLinks; i++) {
                const link = data.links[i];
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = link.href;
                a.textContent = link.text || link.href;
                a.target = '_blank';
                li.appendChild(a);
                linksList.appendChild(li);
            }
            
            if (data.links.length > maxLinks) {
                const li = document.createElement('li');
                li.textContent = `... and ${data.links.length - maxLinks} more`;
                linksList.appendChild(li);
            }
            
            showResults();
            
        } catch (error) {
            showError(error.message);
        } finally {
            hideLoading();
        }
    });
    
    function showLoading() {
        loading.style.display = 'block';
    }
    
    function hideLoading() {
        loading.style.display = 'none';
    }
    
    function showResults() {
        results.style.display = 'block';
    }
    
    function hideResults() {
        results.style.display = 'none';
    }
    
    function showError(message) {
        error.textContent = `Error: ${message}`;
        error.style.display = 'block';
    }
    
    function hideError() {
        error.style.display = 'none';
    }
});