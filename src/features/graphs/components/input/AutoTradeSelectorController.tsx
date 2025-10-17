"use client";

import AutoTradeSelector from "@/components/input/AutoTradeSelector";
import { useHandleAutoTrade } from "../../hooks/auto-trade-selector/useHandleAutoTrade";
import { useHandleMartingale } from "../../hooks/auto-trade-selector/useHandleMartingale";
import { useState } from "react";
import MartingaleModal from "./martingale/MartingaleModal";
import { DEFAULT_MARTINGALE } from "@/types/martingale";

export default function AutoTradeSelectorController() {
  const [opened, setOpened] = useState(false);
  const { martingale, handleUpdateMartingale } = useHandleMartingale();
  const {
    activeAssetId,
    enable,
    amount,
    selectedBalance,
    handleAutoTradeChange,
    updateAutoTrade,
  } = useHandleAutoTrade();

  return (
    <>
      <AutoTradeSelector
        enabled={enable}
        tradeAmount={amount}
        balance={selectedBalance}
        onAutoTradeChange={handleAutoTradeChange}
        onTradeAmountChange={(amount) => {
          updateAutoTrade(activeAssetId!, { enable: enable!, amount: amount });
        }}
        isMartingaleOn={martingale?.enabled}
        onMartingaleClick={() => setOpened(true)}
      />
      <MartingaleModal
        opened={opened}
        onClose={() => setOpened(false)}
        martingale={martingale || DEFAULT_MARTINGALE}
        updateMartingale={handleUpdateMartingale}
      />
    </>
  );
}
