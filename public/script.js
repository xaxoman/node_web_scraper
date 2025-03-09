document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const form = document.getElementById('screenshot-form');
    const urlInput = document.getElementById('url-input');
    const submitBtn = document.getElementById('submit-btn');
    const loadingElement = document.getElementById('loading');
    const errorMessage = document.getElementById('error-message');
    const resultElement = document.getElementById('result');
    const downloadBtn = document.getElementById('download-btn');
    const screenshotPreview = document.getElementById('screenshot-preview');
    
    // Store the current screenshot data
    let currentScreenshot = null;
    let websiteUrl = '';
    
    // Form submission handler
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get and validate URL
        const url = urlInput.value.trim();
        if (!url) {
            showError('Please enter a valid URL');
            return;
        }
        
        // Reset UI state
        hideError();
        resultElement.classList.add('hidden');
        loadingElement.classList.remove('hidden');
        submitBtn.disabled = true;
        
        try {
            // Call screenshot API
            const response = await fetch('/api/screenshot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });
            
            // Process response
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.details || data.error || 'Failed to take screenshot');
            }
            
            if (data.success && data.screenshot) {
                // Store data for download
                currentScreenshot = data.screenshot;
                websiteUrl = data.url;
                
                // Display screenshot
                displayScreenshot(data.screenshot);
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            showError(error.message);
            console.error('Screenshot error:', error);
        } finally {
            loadingElement.classList.add('hidden');
            submitBtn.disabled = false;
        }
    });
    
    // Download button handler
    downloadBtn.addEventListener('click', () => {
        if (!currentScreenshot) return;
        
        // Create a filename from the URL
        const domain = new URL(websiteUrl).hostname;
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `screenshot-${domain}-${timestamp}.png`;
        
        // Create download link
        const link = document.createElement('a');
        link.href = `data:image/png;base64,${currentScreenshot}`;
        link.download = filename;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
    
    // Function to display the screenshot
    function displayScreenshot(base64Image) {
        screenshotPreview.src = `data:image/png;base64,${base64Image}`;
        resultElement.classList.remove('hidden');
    }
    
    // Error handling functions
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    }
    
    function hideError() {
        errorMessage.classList.add('hidden');
        errorMessage.textContent = '';
    }
});
