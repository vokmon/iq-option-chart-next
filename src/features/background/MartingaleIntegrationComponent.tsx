import { useMartingaleIntegration } from "@/hooks/martingale/useMartingaleIntegration";
import { useMartingaleCleanup } from "@/hooks/martingale/useMartingaleCleanup";
import { useAutoTradeCleanup } from "@/hooks/autoTrade/useAutoTradeCleanup";
import { notifications } from "@mantine/notifications";
import { OrderSuccessNotification } from "@/components/notifications/OrderSuccessNotification";
import { useTranslations } from "next-intl";

export default function MartingaleIntegrationComponent() {
  const t = useTranslations();

  // Initialize martingale integration
  useMartingaleIntegration({
    onSuccess: ({ asset, direction, isSystemTrade }) => {
      notifications.show({
        title: t("Martingale Success"),
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

  // Initialize martingale cleanup
  useMartingaleCleanup();

  // Initialize auto-trade cleanup
  useAutoTradeCleanup();

  return null;
}
