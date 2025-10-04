import TradingPanel from "@/components/input/TradingPanel";
import { useTradingState } from "../../hooks/trading/useTradingState";
import { useTradingActions } from "@/hooks/useTradingActions";
import { DigitalOptionsDirection } from "@quadcode-tech/client-sdk-js";
import { useAssetStore } from "@/stores/assetStore";
import { notifications } from "@mantine/notifications";
import { OrderSuccessNotification } from "@/components/notifications/OrderSuccessNotification";

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

  return (
    <TradingPanel
      onBalanceChange={onBalanceChange}
      selectedBalanceId={selectedBalanceId}
      amount={amount}
      onAmountChange={onAmountChange}
      disabled={isPending}
      onCall={async (balance, amount) => {
        createOrder({
          asset: asset!,
          balance,
          amount,
          direction: DigitalOptionsDirection.Call,
        });
      }}
      onPut={async (balance, amount) => {
        createOrder({
          asset: asset!,
          balance,
          amount,
          direction: DigitalOptionsDirection.Put,
        });
      }}
    />
  );
}
