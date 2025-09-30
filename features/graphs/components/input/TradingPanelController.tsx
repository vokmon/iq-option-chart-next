import TradingPanel from "@/components/input/TradingPanel";
import { useTradingState } from "../../hooks/trading/useTradingState";
import { useTradingActions } from "@/hooks/useTradingActions";
import { DigitalOptionsDirection } from "@quadcode-tech/client-sdk-js";
import { useTradingStore } from "@/stores/tradingStore";
import { useAssetStore } from "@/stores/assetStore";

export default function TradingPanelController() {
  const { getActiveAsset } = useAssetStore();
  const { addOrder } = useTradingStore();
  const activeAsset = getActiveAsset();
  const asset = activeAsset?.asset;

  const { selectedBalanceId, amount, onBalanceChange, onAmountChange } =
    useTradingState();

  const createOrderMutation = useTradingActions({
    asset: asset!,
    onSuccess: (order) => {
      if (activeAsset) {
        addOrder(activeAsset.id, {
          id: order.id,
          isByUser: true,
        });
      }
    },
  });

  const { isPending, mutate: createOrder } = createOrderMutation;

  return (
    <TradingPanel
      onBalanceChange={onBalanceChange}
      selectedBalanceId={selectedBalanceId}
      amount={amount}
      onAmountChange={onAmountChange}
      disabled={isPending}
      onCall={async (balance, amount) => {
        createOrder({
          balance,
          amount,
          direction: DigitalOptionsDirection.Call,
        });
      }}
      onPut={async (balance, amount) => {
        createOrder({
          balance,
          amount,
          direction: DigitalOptionsDirection.Put,
        });
      }}
    />
  );
}
