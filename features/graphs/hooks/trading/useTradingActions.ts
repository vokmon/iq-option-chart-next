import { useMutation } from "@tanstack/react-query";
import { useSdk } from "@/hooks/useSdk";
import { useAssetStore } from "@/stores/assetStore";
import { useTradingStore } from "@/stores/tradingStore";
import {
  Balance,
  DigitalOptionsDirection,
  DigitalOptionsOrder,
} from "@quadcode-tech/client-sdk-js";
import { notifications } from "@mantine/notifications";

interface TradingParams {
  balance: Balance;
  amount: number;
  direction: DigitalOptionsDirection;
}

interface UseTradingActionsParams {
  t: (key: string, values?: Record<string, string>) => string;
}

export function useTradingActions({ t }: UseTradingActionsParams) {
  const { getActiveAsset } = useAssetStore();
  const { addOrder } = useTradingStore();
  const { sdk } = useSdk();

  const executeTrade = async ({
    balance,
    amount,
    direction,
  }: TradingParams): Promise<void> => {
    const activeAsset = getActiveAsset();
    const asset = activeAsset?.asset;

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

      // Save order information to trading store
      console.log(
        "Saving order information to trading store",
        order,
        activeAsset
      );
      if (activeAsset) {
        addOrder(activeAsset.id, {
          id: order.id,
          isByUser: true,
        });
      }

      notifications.show({
        title: "Success",
        message: t("Order placed successfully", {
          direction:
            direction === DigitalOptionsDirection.Call ? "Call 🔺" : "Put 🔻",
          assetName: asset?.name || "",
        }),
        color: "green",
        position: "top-right",
      });
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

  const callMutation = useMutation({
    mutationFn: (params: { balance: Balance; amount: number }) =>
      executeTrade({ ...params, direction: DigitalOptionsDirection.Call }),
  });

  const putMutation = useMutation({
    mutationFn: (params: { balance: Balance; amount: number }) =>
      executeTrade({ ...params, direction: DigitalOptionsDirection.Put }),
  });

  return {
    onCall: callMutation.mutate,
    onPut: putMutation.mutate,
    callMutation,
    putMutation,
  };
}
