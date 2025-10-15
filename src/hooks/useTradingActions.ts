import { useMutation } from "@tanstack/react-query";
import { useSdk } from "@/hooks/useSdk";
import {
  Balance,
  DigitalOptionsDirection,
  DigitalOptionsOrder,
  DigitalOptionsUnderlying,
} from "@quadcode-tech/client-sdk-js";
import { notifications } from "@mantine/notifications";
import { useTranslations } from "next-intl";
import { useRefetchOpenPositions } from "./positions/useGetOpenPositions";
import { getFirstAvailableInstrument } from "@/utils/tradingUtil";

interface TradingParams {
  asset: DigitalOptionsUnderlying;
  balance: Balance;
  amount: number;
  direction: DigitalOptionsDirection;
  period: number;
  isSystemTrade?: boolean;
}

export function useTradingActions({
  onSuccess,
}: {
  onSuccess?: ({
    asset,
    order,
    direction,
    isSystemTrade,
  }: {
    asset: DigitalOptionsUnderlying;
    order: DigitalOptionsOrder;
    direction: DigitalOptionsDirection;
    isSystemTrade?: boolean;
  }) => void;
}) {
  const t = useTranslations();
  const { sdk } = useSdk();
  const { refetchOpenPositions } = useRefetchOpenPositions();

  const executeTrade = async ({
    asset,
    balance,
    amount,
    direction,
    period,
    isSystemTrade,
  }: TradingParams): Promise<void> => {
    try {
      if (!asset) {
        throw new Error("No active asset selected");
      }

      const [instruments, digitalOptions] = await Promise.all([
        asset.instruments(),
        sdk.digitalOptions(),
      ]);

      const firstInstrument = getFirstAvailableInstrument(
        instruments,
        period,
        sdk.currentTime()
      );

      if (!firstInstrument) {
        throw new Error("No available instruments for trading");
      }

      const order: DigitalOptionsOrder = await digitalOptions.buySpotStrike(
        firstInstrument,
        direction,
        amount,
        balance
      );

      if (onSuccess) {
        await onSuccess({
          asset,
          order,
          direction,
          isSystemTrade: isSystemTrade || false,
        });
      }

      // Wait for 0.1 second to ensure the positions are updated
      await new Promise((resolve) => setTimeout(resolve, 100));
      refetchOpenPositions();
    } catch (error) {
      const errorMessage = t("Error executing order", {
        direction,
        assetName: asset?.name || "",
      });
      console.warn(error, errorMessage);
      notifications.show({
        title: "Error",
        message: errorMessage,
        color: "red",
        position: "top-right",
      });
    }
  };

  const createOrderMutation = useMutation({
    mutationFn: (params: {
      asset: DigitalOptionsUnderlying;
      balance: Balance;
      amount: number;
      direction: DigitalOptionsDirection;
      period: number;
      isSystemTrade?: boolean;
    }) => executeTrade({ ...params }),
  });

  return createOrderMutation;
}
