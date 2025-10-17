import { useAssetStore } from "@/stores/assets/assetStore";
import { useTradingStore } from "@/stores/assets/tradingStore";
import { useSelectedBalance } from "../../hooks/positions/useSelectedBalance";

export function useHandleAutoTrade() {
  const { activeAssetId, assets } = useAssetStore();
  const { getAutoTrade, updateAutoTrade } = useTradingStore();
  const { selectedBalance } = useSelectedBalance();

  const autoTrade = getAutoTrade(activeAssetId!);
  const enable = autoTrade?.enable;
  const amount = autoTrade?.amount;

  const handleAutoTradeChange = (enabled: boolean, amount: number) => {
    // If enabling auto trade for this asset, disable it for all other assets
    if (enabled) {
      assets.forEach((asset) => {
        if (asset.id !== activeAssetId) {
          const otherAutoTrade = getAutoTrade(asset.id);
          if (otherAutoTrade?.enable) {
            updateAutoTrade(asset.id, { ...otherAutoTrade, enable: false });
          }
        }
      });
    }

    // Update auto trade for the current asset
    updateAutoTrade(activeAssetId!, { enable: enabled, amount: amount });
  };

  return {
    activeAssetId,
    handleAutoTradeChange,
    enable,
    amount,
    selectedBalance,
    updateAutoTrade,
  };
}
