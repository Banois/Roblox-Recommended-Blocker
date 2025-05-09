document.addEventListener('DOMContentLoaded', function() {
  const toggleRecommended = document.getElementById("toggleRecommended");
  const toggleButtons = document.getElementById("toggleButtons");
  const checkUpdateButton = document.getElementById("checkUpdate");
  const VERSION_URL = "https://raw.githubusercontent.com/Banois/Roblox-Recommended-Blocker/main/Version.txt";

  chrome.storage.sync.get(["blockRecommended", "blockButtons"], function(data) {
    toggleRecommended.checked = data.blockRecommended !== undefined ? data.blockRecommended : true;
    toggleButtons.checked = data.blockButtons !== undefined ? data.blockButtons : false;
  });

  toggleRecommended.addEventListener('change', function() {
    chrome.storage.sync.set({ blockRecommended: toggleRecommended.checked }, refreshCurrentTab);
  });

  toggleButtons.addEventListener('change', function() {
    chrome.storage.sync.set({ blockButtons: toggleButtons.checked }, refreshCurrentTab);
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
    fetch(VERSION_URL).then(response => response.text()).then(text => {
      const lines = text.split('\n');
      const newVersion = lines[0].replace("Current Version: ", "").trim();

      chrome.storage.sync.get(["currentVersion"], function(data) {
        const currentVersion = data.currentVersion || "1.0";
        if (newVersion !== currentVersion) {
          if (confirm("Update found! Would you like to download it now?")) {
            chrome.storage.sync.set({ currentVersion: newVersion });
            alert("Update successfully installed. Please reload the page.");
          }
        } else {
          alert("You are already using the latest version.");
        }
      });
    }).catch(err => console.error("Error checking for updates:", err));
  }
});
