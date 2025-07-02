// Block common tracking scripts and social widgets
const blockTrackingScripts = () => {
  const scriptElements = document.getElementsByTagName('script');
  for (let script of scriptElements) {
    const src = script.src.toLowerCase();
    if (src.includes('google-analytics') ||
        src.includes('googletagmanager') ||
        src.includes('facebook') ||
        src.includes('twitter') ||
        src.includes('linkedin') ||
        src.includes('hotjar') ||
        src.includes('crazyegg')) {
      script.remove();
    }
  }
};

// Block social media widgets
const blockSocialWidgets = () => {
  // Facebook
  const fbElements = document.querySelectorAll(
    'div[class*="facebook"], div[id*="facebook"], ' +
    'div[class*="fb-"], div[id*="fb-"], ' +
    'iframe[src*="facebook.com"]'
  );
  fbElements.forEach(el => el.remove());

  // Twitter
  const twitterElements = document.querySelectorAll(
    'div[class*="twitter"], div[id*="twitter"], ' +
    'iframe[src*="twitter.com"]'
  );
  twitterElements.forEach(el => el.remove());

  // LinkedIn
  const linkedinElements = document.querySelectorAll(
    'div[class*="linkedin"], div[id*="linkedin"], ' +
    'iframe[src*="linkedin.com"]'
  );
  linkedinElements.forEach(el => el.remove());
};

// Create and show notification
const showNotification = (domain, reason) => {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #1a1a1a;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 14px;
    z-index: 2147483647;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border: 1px solid #4a9eff;
    display: flex;
    align-items: center;
    gap: 10px;
  `;

  const icon = document.createElement('span');
  icon.textContent = '🛡️';
  icon.style.fontSize = '16px';

  const message = document.createElement('span');
  message.textContent = `Blocked ${reason === 'tracker' ? 'tracker' : 'social widget'}: ${domain}`;

  notification.appendChild(icon);
  notification.appendChild(message);
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.transition = 'opacity 0.3s ease-out';
    notification.style.opacity = '0';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
};

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'TRACKER_BLOCKED') {
    showNotification(message.domain, message.reason);
  }
});

// Run blocking functions when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['masterEnabled', 'trackingScripts', 'socialWidgets'], (settings) => {
    if (!settings.masterEnabled) return;

    if (settings.trackingScripts) {
      blockTrackingScripts();
      // Set up a MutationObserver to handle dynamically added scripts
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.addedNodes.length) {
            blockTrackingScripts();
          }
        }
      });
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true
      });
    }

    if (settings.socialWidgets) {
      blockSocialWidgets();
      // Set up a MutationObserver to handle dynamically added widgets
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.addedNodes.length) {
            blockSocialWidgets();
          }
        }
      });
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true
      });
    }
  });
}); 