// Get DOM elements
const masterToggle = document.getElementById('masterToggle');
const trackingScriptsToggle = document.getElementById('trackingScripts');
const socialWidgetsToggle = document.getElementById('socialWidgets');
const cookieControlToggle = document.getElementById('cookieControl');
const clearDataButton = document.getElementById('clearData');
const confirmationModal = document.getElementById('confirmationModal');
const confirmClearButton = document.getElementById('confirmClear');
const cancelClearButton = document.getElementById('cancelClear');
const trackerCountElement = document.getElementById('trackerCount');

// Load saved settings
const loadSettings = async () => {
  const settings = await chrome.storage.local.get({
    masterEnabled: true,
    trackingScripts: true,
    socialWidgets: true,
    cookieControl: true,
    trackerCount: 0
  });

  masterToggle.checked = settings.masterEnabled;
  trackingScriptsToggle.checked = settings.trackingScripts;
  socialWidgetsToggle.checked = settings.socialWidgets;
  cookieControlToggle.checked = settings.cookieControl;
  trackerCountElement.textContent = settings.trackerCount;

  // Update toggle states based on master toggle
  updateToggleStates(settings.masterEnabled);
};

// Update toggle states
const updateToggleStates = (enabled) => {
  const toggles = [trackingScriptsToggle, socialWidgetsToggle, cookieControlToggle];
  toggles.forEach(toggle => {
    toggle.disabled = !enabled;
    if (!enabled) {
      toggle.parentElement.classList.add('disabled');
    } else {
      toggle.parentElement.classList.remove('disabled');
    }
  });
};

// Save settings
const saveSettings = async (key, value) => {
  await chrome.storage.local.set({ [key]: value });
};

// Event listeners for toggles
masterToggle.addEventListener('change', async (e) => {
  await saveSettings('masterEnabled', e.target.checked);
  updateToggleStates(e.target.checked);
});

trackingScriptsToggle.addEventListener('change', async (e) => {
  await saveSettings('trackingScripts', e.target.checked);
});

socialWidgetsToggle.addEventListener('change', async (e) => {
  await saveSettings('socialWidgets', e.target.checked);
});

cookieControlToggle.addEventListener('change', async (e) => {
  await saveSettings('cookieControl', e.target.checked);
});

// Clear browsing data functionality
clearDataButton.addEventListener('click', () => {
  confirmationModal.style.display = 'block';
});

confirmClearButton.addEventListener('click', async () => {
  confirmationModal.style.display = 'none';
  clearDataButton.disabled = true;
  clearDataButton.textContent = 'Clearing...';

  try {
    await chrome.runtime.sendMessage({ type: 'CLEAR_DATA' });
    clearDataButton.textContent = 'Data Cleared!';
    setTimeout(() => {
      clearDataButton.disabled = false;
      clearDataButton.textContent = 'Clear Browsing Data';
    }, 2000);
  } catch (error) {
    clearDataButton.textContent = 'Error Clearing Data';
    setTimeout(() => {
      clearDataButton.disabled = false;
      clearDataButton.textContent = 'Clear Browsing Data';
    }, 2000);
  }
});

cancelClearButton.addEventListener('click', () => {
  confirmationModal.style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
  if (e.target === confirmationModal) {
    confirmationModal.style.display = 'none';
  }
});

// Update tracker count periodically
const updateTrackerCount = async () => {
  try {
    const response = await chrome.runtime.sendMessage({ type: 'GET_STATS' });
    if (response && response.trackerCount !== undefined) {
      trackerCountElement.textContent = response.trackerCount;
    }
  } catch (error) {
    console.error('Error updating tracker count:', error);
  }
};

// Initialize popup
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  updateTrackerCount();
  // Update tracker count every 5 seconds
  setInterval(updateTrackerCount, 5000);
}); 