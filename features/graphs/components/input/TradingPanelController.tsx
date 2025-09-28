import TradingPanel from "@/components/input/TradingPanel";
import { useTradingState } from "../../hooks/trading/useTradingState";
import { useTradingActions } from "../../hooks/trading/useTradingActions";
import { useTranslations } from "next-intl";

export default function TradingPanelController() {
  const t = useTranslations();
  const { selectedBalanceId, amount, onBalanceChange, onAmountChange } =
    useTradingState();

  const { callMutation, putMutation } = useTradingActions({ t });
  const { isPending: isCallPending, mutateAsync: onCall } = callMutation;
  const { isPending: isPutPending, mutateAsync: onPut } = putMutation;

  return (
    <TradingPanel
      onBalanceChange={onBalanceChange}
      selectedBalanceId={selectedBalanceId}
      amount={amount}
      onAmountChange={onAmountChange}
      disabled={isCallPending || isPutPending}
      onCall={async (balance, amount) => {
        await onCall({ balance, amount });
      }}
      onPut={async (balance, amount) => {
        await onPut({ balance, amount });
      }}
    />
  );
}
