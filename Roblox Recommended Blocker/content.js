(function () {
  let blockRecommended = true;
  let blockUselessButtons = false;
  let blockHunt = false;

  // Retrieve the user's preferences from storage
  chrome.storage.sync.get(["blockRecommended", "blockButtons", "blockHunt"], function (data) {
    blockRecommended = data.blockRecommended !== undefined ? data.blockRecommended : true;
    blockUselessButtons = data.blockButtons !== undefined ? data.blockButtons : false;
    blockHunt = data.blockHunt !== undefined ? data.blockHunt : false;
    runRemovals();
  });

  // Listen for changes to storage values and update preferences accordingly
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.blockRecommended) {
      blockRecommended = changes.blockRecommended.newValue;
    }
    if (changes.blockButtons) {
      blockUselessButtons = changes.blockButtons.newValue;
    }
    if (changes.blockHunt) {
      blockHunt = changes.blockHunt.newValue;
    }
    runRemovals();
  });

  // Function to remove recommended games and related elements
  function removeRecommended() {
    // Block Recommended Elements if the toggle is enabled
    document.querySelectorAll(".container-header > h2").forEach(header => {
      if (header.textContent && header.textContent.toLowerCase().includes("recommended")) {
        let sectionContainer = header.parentElement?.parentElement;
        if (sectionContainer) {
          sectionContainer.remove();
        }
      }
    });

    // Remove feed elements dynamically by matching patterns
    const feedSelectors = [
      ".btr-feed:nth-child(1) > .btr-feedtitle", 
      ".btr-feed:nth-child(1) > .btr-feeddesc", 
      ".btr-feed:nth-child(2) > .btr-feedtitle", 
      ".btr-feed:nth-child(2) > .btr-feeddesc", 
      ".btr-feed:nth-child(3) > .btr-feedtitle", 
      ".btr-feed:nth-child(3) > .btr-feeddesc",
      ".btr-feed:nth-child(1)", 
      ".btr-feed:nth-child(2)", 
      ".btr-feed:nth-child(3)"
    ];

    feedSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(element => {
        element.remove();
      });
    });

    // Add more general patterns to catch similar elements
    document.querySelectorAll(".edit.btr-feed").forEach(feed => {
      feed.querySelectorAll(".btr-feedtitle, .btr-feeddesc").forEach(child => {
        child.remove();
      });
    });
  }

  // Function to remove "The Hunt" related elements
  function removeHunt() {
    // Remove "The Hunt" Elements if the toggle is enabled
    const huntSelectors = [
      ".rbx-platform-event-header", 
      ".rbx-platform-event-thumbnail", 
      ".sort-header > span", 
      ".text-default",
      ".css-hitfbc-heroUnitContentContainer" // Newly added selector
    ];

    huntSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        el.remove();
      });
    });

    // Remove specific game elements by their IDs
    const gameSelectors = [
      "#\\37 296012067",   // Removing this element by ID
      "#\\34 540138978",   // Removing this element by ID
      "#\\36 894451805",   // Removing this element by ID
      "#\\32 74816972",    // Removing this element by ID
      "#\\31 11958650",    // Removing this element by ID
      "#\\33 317771874"    // New game ID added
    ];

    gameSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        el.remove();
      });
    });
  }

  // Function to remove useless buttons
  function removeUselessButtons() {
    const uselessButtonSelectors = [
      "#upgrade-now-button", 
      "#nav-giftcards > .dynamic-ellipsis-item", 
      "#nav-giftcards", 
      "#nav-shop > .dynamic-ellipsis-item", 
      "#nav-shop", 
      "#nav-blog > .dynamic-ellipsis-item", 
      "#nav-blog", 
      "#nav-premium > .dynamic-ellipsis-item", 
      "#nav-premium", 
      "#nav-money > .dynamic-ellipsis-item", 
      "#nav-money", 
      "#nav-trade > .dynamic-ellipsis-item", 
      "#nav-trade", 
      "#nav-favorites > .dynamic-ellipsis-item", 
      "#nav-favorites", 
      "li:nth-child(6) > #nav-inventory > .dynamic-ellipsis-item", 
      "li:nth-child(6) > #nav-inventory"
    ];

    uselessButtonSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => el.remove());
    });
  }

  // Run the main removal function
  function runRemovals() {
    if (blockRecommended) removeRecommended();
    if (blockUselessButtons) removeUselessButtons();
    if (blockHunt) removeHunt();
  }

  // Create a MutationObserver to track any changes in the DOM (for dynamically added content)
  const observer = new MutationObserver(() => {
    runRemovals(); // Re-run the removal logic when the DOM changes
  });

  // Start observing the body for changes in the DOM
  observer.observe(document.body, { childList: true, subtree: true });

  // Run initial removal logic
  runRemovals();
})();
