import TradingPanel from "@/components/input/TradingPanel";
import { useTradingState } from "../../hooks/trading/useTradingState";
import { useTradingActions } from "@/hooks/useTradingActions";
import { DigitalOptionsDirection } from "@quadcode-tech/client-sdk-js";
import { useAssetStore } from "@/stores/assets/assetStore";
import { notifications } from "@mantine/notifications";
import { OrderSuccessNotification } from "@/components/notifications/OrderSuccessNotification";
import { useAmountHistoryStore } from "@/stores/assets/amountHistoryStore";
import { useAmountHistory } from "../../hooks/trading/useAmountHistory";

export default function TradingPanelController() {
  const { getActiveAsset } = useAssetStore();
  const activeAsset = getActiveAsset();
  const asset = activeAsset?.asset;

  const { selectedBalanceId, amount, onBalanceChange, onAmountChange } =
    useTradingState();

  const createOrderMutation = useTradingActions({
    onSuccess: ({ asset, direction }) => {
      notifications.show({
        title: "Success",
        message: (
          <OrderSuccessNotification asset={asset} direction={direction} />
        ),
        color: "green",
        position: "top-right",
      });
    },
  });

  const { isPending, mutate: createOrder } = createOrderMutation;
  const { addAmount } = useAmountHistoryStore();

  // Use the custom hook to get amount history and handle lastActive updates
  const amountHistory = useAmountHistory(
    activeAsset?.asset?.activeId,
    selectedBalanceId
  );

  return (
    <TradingPanel
      onBalanceChange={onBalanceChange}
      selectedBalanceId={selectedBalanceId}
      amount={amount}
      onAmountChange={onAmountChange}
      disabled={isPending}
      quickAmounts={amountHistory}
      onCall={async (balance, amount) => {
        addAmount(activeAsset!.asset!.activeId!, balance.id, amount);
        createOrder({
          asset: asset!,
          balance,
          amount,
          direction: DigitalOptionsDirection.Call,
          period: activeAsset!.candleSize!,
        });
      }}
      onPut={async (balance, amount) => {
        addAmount(activeAsset!.asset!.activeId!, balance.id, amount);
        createOrder({
          asset: asset!,
          balance,
          amount,
          direction: DigitalOptionsDirection.Put,
          period: activeAsset!.candleSize!,
        });
      }}
    />
  );
}
