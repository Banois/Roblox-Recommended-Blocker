(function () {
  let blockRecommended = true;
  let blockUselessButtons = false;

  chrome.storage.sync.get(["blockRecommended", "blockButtons"], function (data) {
    if (data.blockRecommended !== undefined) {
      blockRecommended = data.blockRecommended;
    }
    if (data.blockButtons !== undefined) {
      blockUselessButtons = data.blockButtons;
    }
    runRemovals();
  });

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
    if (blockRecommended) {
      document.querySelectorAll(".container-header > h2").forEach(header => {
        if (header.textContent && header.textContent.toLowerCase().includes("recommended")) {
          let sectionContainer = header.parentElement?.parentElement;
          if (sectionContainer) {
            sectionContainer.remove();
          }
        }
      });
    }

    if (blockUselessButtons) {
      const selectors = [
        "#upgrade-now-button", "#nav-giftcards", "#nav-shop", "#nav-money", "#nav-premium", "#nav-blog"
      ];
      selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => el.remove());
      });
    }
  }

  const observer = new MutationObserver(() => {
    runRemovals();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  runRemovals();
})();