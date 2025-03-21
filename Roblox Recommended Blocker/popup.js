document.addEventListener('DOMContentLoaded', function() {
  const toggleRecommended = document.getElementById("toggleRecommended");
  const toggleButtons = document.getElementById("toggleButtons");
  const toggleHunt = document.getElementById("toggleHunt");
  const checkUpdateButton = document.getElementById("checkUpdate");
  const VERSION_URL = "https://raw.githubusercontent.com/Banois/Roblox-Recommended-Blocker/main/Roblox%20Recommended%20Blocker/Version.txt";

  // Load saved preferences
  chrome.storage.sync.get(["blockRecommended", "blockButtons", "blockHunt", "currentVersion"], function(data) {
    toggleRecommended.checked = data.blockRecommended !== undefined ? data.blockRecommended : true;
    toggleButtons.checked = data.blockButtons !== undefined ? data.blockButtons : false;
    toggleHunt.checked = data.blockHunt !== undefined ? data.blockHunt : false;
    document.getElementById('currentVersionLabel').textContent = data.currentVersion || "1.0";  // Default to 1.0 if not set
  });

  // When the toggles change, save the new value and refresh the active tab.
  toggleRecommended.addEventListener('change', function() {
    chrome.storage.sync.set({ blockRecommended: toggleRecommended.checked }, refreshCurrentTab);
  });

  toggleButtons.addEventListener('change', function() {
    chrome.storage.sync.set({ blockButtons: toggleButtons.checked }, refreshCurrentTab);
  });

  toggleHunt.addEventListener('change', function() {
    chrome.storage.sync.set({ blockHunt: toggleHunt.checked }, refreshCurrentTab);
  });

  checkUpdateButton.addEventListener('click', checkForUpdate);

  function refreshCurrentTab() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs && tabs.length > 0) {
        chrome.tabs.reload(tabs[0].id);
      }
    });
  }

  function checkForUpdate() {
    fetch(VERSION_URL).then(response => {
      if (!response.ok) {
        throw new Error("Failed to fetch version file");
      }
      return response.text();
    }).then(text => {
      const lines = text.split('\n');
      const newVersion = lines[0].replace("Current Version: ", "").trim();

      chrome.storage.sync.get(["currentVersion"], function(data) {
        const currentVersion = data.currentVersion || "1.0";  // Use "1.0" if no version is saved

        // Compare versions and prompt update if necessary
        if (newVersion !== currentVersion) {
          if (confirm("Update found! Would you like to download it now?")) {
            chrome.storage.sync.set({ currentVersion: newVersion }, function() {
              document.getElementById('currentVersionLabel').textContent = newVersion;  // Update UI with new version
              alert("Update successfully installed. Please reload the page.");
            });
          }
        } else {
          alert("You are already using the latest version.");
        }
      });
    }).catch(err => {
      console.error("Error checking for updates:", err);
      alert("Error: Unable to check for updates. Please try again later.");
    });
  }
});
