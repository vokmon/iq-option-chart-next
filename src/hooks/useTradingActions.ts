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

interface TradingParams {
  balance: Balance;
  amount: number;
  direction: DigitalOptionsDirection;
}

export function useTradingActions({
  asset,
  onSuccess,
}: {
  asset: DigitalOptionsUnderlying;
  onSuccess?: ({
    order,
    direction,
  }: {
    order: DigitalOptionsOrder;
    direction: DigitalOptionsDirection;
  }) => void;
}) {
  const t = useTranslations();
  const { sdk } = useSdk();
  const { refetchOpenPositions } = useRefetchOpenPositions();

  const executeTrade = async ({
    balance,
    amount,
    direction,
  }: TradingParams): Promise<void> => {
    try {
      if (!asset) {
        throw new Error("No active asset selected");
      }

      const [instruments, digitalOptions] = await Promise.all([
        asset.instruments(),
        sdk.digitalOptions(),
      ]);

      const instrument = instruments?.getAvailableForBuyAt(new Date());
      const firstInstrument = instrument?.[0];

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
        await onSuccess({ order, direction });
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
      balance: Balance;
      amount: number;
      direction: DigitalOptionsDirection;
    }) => executeTrade({ ...params }),
  });

  return createOrderMutation;
}
