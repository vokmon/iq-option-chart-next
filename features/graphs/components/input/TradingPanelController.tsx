import TradingPanel from "@/components/input/TradingPanel";
import { useTradingState } from "../../hooks/trading/useTradingState";
import { useTradingActions } from "../../hooks/trading/useTradingActions";

export default function TradingPanelController() {
  const { selectedBalanceId, amount, onBalanceChange, onAmountChange } =
    useTradingState();

  const { onCall, onPut } = useTradingActions();

  return (
    <TradingPanel
      onBalanceChange={onBalanceChange}
      selectedBalanceId={selectedBalanceId}
      amount={amount}
      onAmountChange={onAmountChange}
      onCall={onCall}
      onPut={onPut}
    />
  );
}
