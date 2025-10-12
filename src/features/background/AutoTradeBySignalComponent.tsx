import { notifications } from "@mantine/notifications";
import { useAutoTrade } from "./hooks/trade/useAutoTrade";
import { OrderSuccessNotification } from "@/components/notifications/OrderSuccessNotification";
import { useCalculateAutoTrade } from "./hooks/trade/useCalculateAutoTrade";

export default function AutoTradeBySignalComponent() {
  useCalculateAutoTrade();
  useAutoTrade({
    onSuccess: ({ asset, direction, isSystemTrade }) => {
      notifications.show({
        title: "Success",
        message: (
          <OrderSuccessNotification
            asset={asset}
            direction={direction}
            isSystemTrade={isSystemTrade}
          />
        ),
        color: "green",
        position: "top-right",
      });
    },
  });

  return null;
}
