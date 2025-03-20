(function () {
  // Default settings
  let blockRecommended = true;
  let blockUselessButtons = false;

  // Load saved settings
  chrome.storage.sync.get(["blockRecommended", "blockButtons"], function (data) {
    if (data.blockRecommended !== undefined) {
      blockRecommended = data.blockRecommended;
    }
    if (data.blockButtons !== undefined) {
      blockUselessButtons = data.blockButtons;
    }
    runRemovals();
  });

  // Listen for changes to settings
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.blockRecommended) {
      blockRecommended = changes.blockRecommended.newValue;
    }
    if (changes.blockButtons) {
      blockUselessButtons = changes.blockButtons.newValue;
    }
    runRemovals();
  });

  function runRemovals() {
    // Remove recommended sections if enabled
    if (blockRecommended) {
      const headers = document.querySelectorAll(".container-header > h2");
      headers.forEach(header => {
        if (header.textContent && header.textContent.toLowerCase().includes("recommended")) {
          let sectionContainer = header.parentElement?.parentElement;
          if (sectionContainer) {
            sectionContainer.remove();
          }
        }
      });
    }

    // Remove specific elements if enabled
    if (blockUselessButtons) {
      const staticSelectors = [
        "#upgrade-now-button",
        "#nav-giftcards",
        "#nav-giftcards > .dynamic-ellipsis-item",
        "#nav-shop",
        "#nav-shop > .dynamic-ellipsis-item",
        "#nav-money",
        "#nav-money > .dynamic-ellipsis-item",
        "#nav-premium",
        "#nav-premium > .dynamic-ellipsis-item",
        "#nav-blog",
        "#nav-blog > .dynamic-ellipsis-item",
        ".btr-feed:nth-child(3) .btr-feeddate",
        ".btr-feed:nth-child(3) > .btr-feedtitle",
        ".btr-feed:nth-child(3) > .btr-feeddesc",
        ".btr-feed:nth-child(2) > .btr-feedtitle",
        ".btr-feed:nth-child(2) > .btr-feeddesc",
        ".btr-feed:nth-child(1) > .btr-feedtitle",
        ".btr-feed:nth-child(1) > .btr-feeddesc"
      ];

      staticSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => el.remove());
      });
    }
  }

  // Monitor the page for dynamically added content
  const observer = new MutationObserver(() => {
    runRemovals();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  runRemovals(); // Initial call
})();
