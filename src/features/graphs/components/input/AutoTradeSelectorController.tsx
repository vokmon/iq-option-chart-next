"use client";

import AutoTradeSelector from "@/components/input/AutoTradeSelector";
import { useAssetStore } from "@/stores/assets/assetStore";
import { useTradingStore } from "@/stores/assets/tradingStore";
import { useSelectedBalance } from "../../hooks/positions/useSelectedBalance";

export default function AutoTradeSelectorController() {
  const { activeAssetId } = useAssetStore();
  const { getAutoTrade, updateAutoTrade } = useTradingStore();
  const { selectedBalance } = useSelectedBalance();

  const autoTrade = getAutoTrade(activeAssetId!);
  const enable = autoTrade?.enable;
  const amount = autoTrade?.amount;

  return (
    <AutoTradeSelector
      enabled={enable}
      tradeAmount={amount}
      balance={selectedBalance}
      onAutoTradeChange={(enabled, amount) => {
        updateAutoTrade(activeAssetId!, { enable: enabled, amount: amount });
      }}
      onTradeAmountChange={(amount) => {
        updateAutoTrade(activeAssetId!, { enable: enable!, amount: amount });
      }}
    />
  );
}
