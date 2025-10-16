import { useAssetStore } from "@/stores/assets/assetStore";

export function useTabAssetHandlers() {
  const {
    activeAssetId,
    setActiveAsset,
    addAsset,
    removeAsset,
    canAddAsset,
    canRemoveAsset,
  } = useAssetStore();

  const handleAddAsset = () => {
    if (canAddAsset()) {
      addAsset();
      // Scroll to show the (+) button after adding
      setTimeout(() => {
        const addButton = document.getElementById("add-asset-button");
        if (addButton) {
          const container = document.querySelector(
            "[data-scroll-area]"
          ) as HTMLElement;
          if (container) {
            const containerRect = container.getBoundingClientRect();
            const buttonRect = addButton.getBoundingClientRect();

            // Calculate the scroll position to show the button
            const buttonLeft =
              buttonRect.left - containerRect.left + container.scrollLeft;
            const targetScroll =
              buttonLeft - containerRect.width + buttonRect.width + 40; // 40px padding to show button clearly

            container.scrollTo({
              left: Math.max(0, targetScroll),
              behavior: "smooth",
            });
          }
        }
      }, 100);
    }
  };

  const handleRemoveAsset = (assetId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (canRemoveAsset(assetId)) {
      removeAsset(assetId);
    }
  };

  const handleAssetChange = (value: string | null) => {
    if (value) {
      setActiveAsset(value);
    }
  };

  return {
    activeAssetId,
    handleAddAsset,
    handleRemoveAsset,
    handleAssetChange,
    canAddAsset,
    canRemoveAsset,
  };
}
