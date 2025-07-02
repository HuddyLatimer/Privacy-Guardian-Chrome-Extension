// Common tracking domains to block
const trackingDomains = [
  'google-analytics.com',
  'doubleclick.net',
  'facebook.com',
  'facebook.net',
  'ads-twitter.com',
  'analytics.twitter.com',
  'ads.linkedin.com',
  'px.ads.linkedin.com',
  'adnxs.com',
  'scorecardresearch.com',
  'quantserve.com',
  'hotjar.com',
  'crazyegg.com'
];

// Social widget domains to block
const socialWidgetDomains = [
  'platform.twitter.com',
  'connect.facebook.net',
  'platform.linkedin.com',
  'apis.google.com',
  'platform.instagram.com',
  'assets.pinterest.com',
  'widgets.pinterest.com'
];

// Default settings
const defaultSettings = {
  masterEnabled: true,
  trackingScripts: true,
  socialWidgets: true,
  cookieControl: true,
  trackerCount: 0
};

// Initialize settings
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set(defaultSettings);
});

// Update rule states based on settings
async function updateRules(settings) {
  if (!settings.masterEnabled) {
    await chrome.declarativeNetRequest.updateEnabledRulesets({
      disableRulesetIds: ["ruleset_1"]
    });
  } else {
    await chrome.declarativeNetRequest.updateEnabledRulesets({
      enableRulesetIds: ["ruleset_1"]
    });
  }
}

// Listen for settings changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local') {
    if (changes.masterEnabled) {
      updateRules({ masterEnabled: changes.masterEnabled.newValue });
    }
  }
});

// Track blocked requests
chrome.declarativeNetRequest.onRuleMatchedDebug?.addListener((info) => {
  if (info.type === "block") {
    chrome.storage.local.get(['trackerCount'], (result) => {
      chrome.storage.local.set({
        trackerCount: (result.trackerCount || 0) + 1
      });
      
      // Notify content script about the blocked tracker
      try {
        chrome.tabs.sendMessage(info.tabId, {
          type: 'TRACKER_BLOCKED',
          domain: new URL(info.request.url).hostname,
          reason: 'tracker'
        });
      } catch (e) {
        // Tab might not be ready to receive messages yet
      }
    });
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'CLEAR_DATA') {
    chrome.browsingData.remove({
      "since": 0
    }, {
      "cache": true,
      "cookies": true,
      "downloads": true,
      "formData": true,
      "history": true,
      "indexedDB": true,
      "localStorage": true,
      "passwords": true,
      "serviceWorkers": true,
      "webSQL": true
    }, () => {
      sendResponse({ success: true });
    });
    return true; // Will respond asynchronously
  }

  if (message.type === 'GET_STATS') {
    chrome.storage.local.get(['trackerCount'], (result) => {
      sendResponse(result);
    });
    return true; // Will respond asynchronously
  }
}); 