document.addEventListener('DOMContentLoaded', function() {
  const toggleRecommended = document.getElementById("toggleRecommended");
  const toggleButtons = document.getElementById("toggleButtons");

  // Load saved preferences
  chrome.storage.sync.get(["blockRecommended", "blockButtons"], function(data) {
    // Default: Block Recommended is true if not set.
    toggleRecommended.checked = (data.blockRecommended === undefined ? true : data.blockRecommended);
    // Default: Block Useless Buttons is false if not set.
    toggleButtons.checked = (data.blockButtons === undefined ? false : data.blockButtons);
  });

  // When the toggles change, save the new value and refresh the active tab.
  toggleRecommended.addEventListener('change', function() {
    chrome.storage.sync.set({ blockRecommended: toggleRecommended.checked }, function() {
      console.log("Block Recommended set to", toggleRecommended.checked);
      refreshCurrentTab();
    });
  });

  toggleButtons.addEventListener('change', function() {
    chrome.storage.sync.set({ blockButtons: toggleButtons.checked }, function() {
      console.log("Block Useless Buttons set to", toggleButtons.checked);
      refreshCurrentTab();
    });
  });

  function refreshCurrentTab() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs && tabs.length > 0) {
        chrome.tabs.reload(tabs[0].id);
      }
    });
  }
});
