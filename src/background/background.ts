import '@inboxsdk/core/background.js';

console.log('Background script initialized');

// האזנה לבקשות מה-content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_GOOGLE_AUTH_TOKEN') {
    chrome.identity.getAuthToken({ interactive: message.interactive ?? true }, (token) => {
      if (chrome.runtime.lastError || !token) {
        sendResponse({ success: false, error: chrome.runtime.lastError?.message });
      } else {
        sendResponse({ success: true, token });
      }
    });
    // Return true to indicate async response
    return true;
  }
});

