import { useEffect } from "react";

interface UseTabScrollEffectsProps {
  scrollAreaRef: React.RefObject<HTMLDivElement | null>;
  activeAssetId: string | null;
  assets: { id: string }[];
  updateScrollButtons: () => void;
  scrollToActiveTab: (activeAssetId: string, assets: { id: string }[]) => void;
}

export function useTabScrollEffects({
  scrollAreaRef,
  activeAssetId,
  assets,
  updateScrollButtons,
  scrollToActiveTab,
}: UseTabScrollEffectsProps) {
  // Initialize scroll button states when component mounts or assets change
  useEffect(() => {
    const timer = setTimeout(() => {
      updateScrollButtons();
    }, 100); // Small delay to ensure DOM is updated

    return () => clearTimeout(timer);
  }, [assets.length, updateScrollButtons]);

  // Scroll to active tab when activeAssetId changes or on initial mount
  useEffect(() => {
    if (activeAssetId && assets.length > 0) {
      const attemptScroll = () => {
        const activeTabElement = scrollAreaRef.current?.querySelector(
          `[data-tab-id="${activeAssetId}"]`
        );
        if (activeTabElement) {
          scrollToActiveTab(activeAssetId, assets);
          return true;
        } else {
          return false;
        }
      };

      // Try immediately
      if (!attemptScroll()) {
        // Use MutationObserver to watch for when the tab element is added
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === "childList") {
              const activeTabElement = scrollAreaRef.current?.querySelector(
                `[data-tab-id="${activeAssetId}"]`
              );
              if (activeTabElement) {
                scrollToActiveTab(activeAssetId, assets);
                observer.disconnect();
              }
            }
          });
        });

        // Start observing the scroll area for changes
        if (scrollAreaRef.current) {
          observer.observe(scrollAreaRef.current, {
            childList: true,
            subtree: true,
          });
        }

        // Also try with delays as fallback
        const timer1 = setTimeout(() => {
          if (!attemptScroll()) {
            const timer2 = setTimeout(() => {
              attemptScroll();
              observer.disconnect();
            }, 500);
            return () => clearTimeout(timer2);
          } else {
            observer.disconnect();
          }
        }, 100);

        return () => {
          clearTimeout(timer1);
          observer.disconnect();
        };
      }
    }
  }, [activeAssetId, scrollToActiveTab, assets.length, scrollAreaRef, assets]);

  // Additional effect for page refresh - listen to window load event as final fallback
  useEffect(() => {
    const handleWindowLoad = () => {
      if (activeAssetId && assets.length > 0) {
        setTimeout(() => {
          scrollToActiveTab(activeAssetId, assets);
        }, 200);
      }
    };

    window.addEventListener("load", handleWindowLoad);
    return () => window.removeEventListener("load", handleWindowLoad);
  }, [activeAssetId, scrollToActiveTab, assets.length, assets]);
}
