import TradingPanel from "@/components/input/TradingPanel";
import { useAssetStore } from "@/stores/assetStore";
import { useTradingStore } from "@/stores/tradingStore";
import { useCallback } from "react";
import type { Balance } from "@quadcode-tech/client-sdk-js";

export default function TradingPanelController() {
  const { getActiveAsset } = useAssetStore();
  const {
    updateSelectedBalance,
    updateAmount,
    getSelectedBalanceId,
    getAmount,
  } = useTradingStore();
  const activeAsset = getActiveAsset();

  const handleBalanceChange = useCallback(
    (balance: Balance) => {
      if (activeAsset) {
        updateSelectedBalance(activeAsset.id, balance.id);
      }
    },
    [activeAsset, updateSelectedBalance]
  );

  const handleAmountChange = useCallback(
    (amount: number) => {
      if (activeAsset) {
        updateAmount(activeAsset.id, amount);
      }
    },
    [activeAsset, updateAmount]
  );

  return (
    <TradingPanel
      onBalanceChange={handleBalanceChange}
      selectedBalanceId={
        activeAsset ? getSelectedBalanceId(activeAsset.id) : undefined
      }
      amount={activeAsset ? getAmount(activeAsset.id) : undefined}
      onAmountChange={handleAmountChange}
    />
  );
}
