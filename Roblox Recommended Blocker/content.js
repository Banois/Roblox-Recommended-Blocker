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
      // Match text headers that indicate recommendations
      const matchTexts = ["recommended", "because you played"];
      document.querySelectorAll(
        ".container-header > h2, .home-sort-header-container h2, .css-59f5rs-textOverride, .css-9h4h37-textIconRow"
      ).forEach(header => {
        const text = header.textContent?.toLowerCase();
        if (text && matchTexts.some(match => text.includes(match))) {
          const section = header.closest(".game-home-page-container > div > div") ||
                         header.closest(".btr-home-section") ||
                         header.closest("section") ||
                         header.parentElement?.parentElement;
          if (section) {
            section.remove();
          }
        }
      });
    }

    if (blockUselessButtons) {
      const selectors = [
        "#upgrade-now-button",
        "#nav-giftcards",
        "#nav-shop",
        "#nav-money",
        "#nav-premium",
        "#nav-blog",
        ".btr-feed:nth-child(3) > .btr-feeddesc",
        ".btr-feed:nth-child(3) > .btr-feedtitle",
        ".btr-feed:nth-child(2) > .btr-feeddesc",
        ".btr-feed:nth-child(2) > .btr-feedtitle",
        ".btr-feed:nth-child(1) > .btr-feeddesc",
        ".btr-feed:nth-child(1) > .btr-feedtitle",
        ".btr-feed:nth-child(1)",
        ".btr-feed:nth-child(2)",
        ".btr-feed:nth-child(3)"
      ];

      selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => el.remove());
      });
    }
  }

  // Mutation observer to keep running removals on dynamic page changes
  const observer = new MutationObserver(() => {
    runRemovals();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  runRemovals();
})();
