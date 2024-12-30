document.addEventListener('DOMContentLoaded', () => {
    const apiKeyInput = document.getElementById('apiKeyInput');
    const saveApiKeyButton = document.getElementById('saveApiKey');
    const scanButton = document.getElementById('scanTab');
    const resetApiKeyButton = document.getElementById('resetApiKey');
    const goToScanButton = document.getElementById('goToScan');
    const setupDiv = document.getElementById('setup');
    const scanDiv = document.getElementById('scan');
    const waitingP = document.getElementById('waitingScan');
    const errorP = document.getElementById('errorScan');

    // Load stored API key
    chrome.storage.sync.get('apiKey', (data) => {
        if (data.apiKey) {
            setupDiv.style.display = 'none';
            scanDiv.style.display = 'block';
        }
    });

    // Save API key
    saveApiKeyButton.addEventListener('click', () => {
        const apiKey = apiKeyInput.value;
        if (apiKey) {
            chrome.storage.sync.set({ apiKey }, () => {
                setupDiv.style.display = 'none';
                scanDiv.style.display = 'block';
                resetApiKeyButton.style.display = 'none';
                errorP.style.display = 'none';                
                waitingP.style.display = 'none';
                scanButton.style.display = 'inline';
            });
        } else {
            alert('Please enter a valid API key.');
        }
    });

    // Scan current tab
    scanButton.addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const url = tabs[0].url;
            scanButton.style.display = 'none';
            waitingP.style.display = 'block';
            chrome.storage.sync.get('apiKey', (data) => {
                if (data.apiKey) {
                    fetch('https://api.urldna.io/scan', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${data.apiKey}`
                        },
                        body: JSON.stringify({ submitted_url: url })
                    })
                        .then(response => response.json())
                        .then(result => {
                            if (result.id) {
                                const scanUrl = `https://urldna.io/scan/${result.id}`;
                                goToScanButton.setAttribute('scan-url', scanUrl)
                                goToScanButton.style.display = 'inline';
                                waitingP.style.display = 'none';
                            } else {
                                waitingP.style.display = 'none';
                                errorP.innerText = 'Scan failed. Please check your API key or try again.';
                                errorP.style.display = 'block';
                                resetApiKeyButton.style.display = 'inline';
                            }
                        })
                        .catch(error => {
                            console.error('Error:', error);
                            waitingP.style.display = 'none';
                            errorP.innerText = 'Scan failed. Please check your API key or try again.';
                            errorP.style.display = 'block';
                            resetApiKeyButton.style.display = 'inline';
            }           );
                } else {
                    errorP.innerText = 'API Key not found. Please set it up first.';
                    errorP.style.display = 'block';
                    resetApiKeyButton.style.display = 'inline';
                }
            });
        });
    });

    // Scan current tab
    goToScanButton.addEventListener('click', () => {
        const scanUrl = goToScanButton.getAttribute("scan-url");
        chrome.tabs.create({ url: scanUrl });
    });
    
    // Reset API Key
    resetApiKeyButton.addEventListener('click', () => {
        setupDiv.style.display = "block";
        scanDiv.style.display = "none";
    });

});
