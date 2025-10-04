import { useState, useRef, useCallback } from "react";

export function useTabScroll() {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const scrollLeft = () => {
    if (scrollAreaRef.current) {
      const scrollAmount = scrollAreaRef.current.clientWidth * 0.85;
      scrollAreaRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollAreaRef.current) {
      const scrollAmount = scrollAreaRef.current.clientWidth * 0.85;
      scrollAreaRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const updateScrollButtons = () => {
    if (scrollAreaRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollAreaRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const scrollToActiveTab = useCallback(
    (activeAssetId: string, assets: { id: string }[]) => {
      if (activeAssetId && scrollAreaRef.current) {
        // Use querySelector to find the tab with the data-tab-id attribute
        const activeTabElement = scrollAreaRef.current.querySelector(
          `[data-tab-id="${activeAssetId}"]`
        );

        if (activeTabElement) {
          const container = scrollAreaRef.current;
          const containerRect = container.getBoundingClientRect();
          const tabRect = activeTabElement.getBoundingClientRect();

          // Check if this is the last tab and scroll to show (+) button
          const currentAssetIndex = assets.findIndex(
            (asset) => asset.id === activeAssetId
          );
          const isLastTab = currentAssetIndex === assets.length - 1;

          if (isLastTab) {
            // For the last tab, scroll to show the (+) button
            const addButton = document.getElementById("add-asset-button");

            if (addButton) {
              // Scroll to show the (+) button at the right edge
              const buttonRect = addButton.getBoundingClientRect();
              const buttonLeft =
                buttonRect.left - containerRect.left + container.scrollLeft;
              const targetScroll =
                buttonLeft - containerRect.width + buttonRect.width + 80;

              // Try both methods
              container.scrollLeft = Math.max(0, targetScroll);

              // Also try scrollTo as backup
              setTimeout(() => {
                container.scrollTo({
                  left: Math.max(0, targetScroll),
                  behavior: "smooth",
                });
              }, 50);
            } else {
              // Fallback: scroll to the end
              container.scrollTo({
                left: container.scrollWidth,
                behavior: "smooth",
              });
            }
          } else {
            // For other tabs, center the tab
            const tabLeft =
              tabRect.left - containerRect.left + container.scrollLeft;
            const tabCenter = tabLeft + tabRect.width / 2;
            const containerCenter = containerRect.width / 2;
            const targetScroll = tabCenter - containerCenter + 40;

            container.scrollTo({
              left: Math.max(0, targetScroll),
              behavior: "smooth",
            });
          }
        }
      }
    },
    []
  );

  const handleScroll = () => {
    updateScrollButtons();
  };

  return {
    scrollAreaRef,
    canScrollLeft,
    canScrollRight,
    scrollLeft,
    scrollRight,
    updateScrollButtons,
    scrollToActiveTab,
    handleScroll,
  };
}
