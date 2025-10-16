import { useCallback } from "react";
import { useAssetStore } from "@/stores/assets/assetStore";
import { useTradingStore } from "@/stores/assets/tradingStore";
import type { Balance } from "@quadcode-tech/client-sdk-js";

export function useTradingState() {
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

  return {
    activeAsset,
    selectedBalanceId: activeAsset
      ? getSelectedBalanceId(activeAsset.id)
      : undefined,
    amount: activeAsset ? getAmount(activeAsset.id) : undefined,
    onBalanceChange: handleBalanceChange,
    onAmountChange: handleAmountChange,
  };
}
