import { useEffect, useState } from "react";
import { Balance } from "@quadcode-tech/client-sdk-js";
import { useSdk } from "@/hooks/useSdk";
import { useTradingStore } from "@/stores/assets/tradingStore";
import { useAssetSelection } from "@/features/graphs/hooks/chart";

export function useSelectedBalance() {
  const { sdk } = useSdk();
  const { getSelectedBalanceId } = useTradingStore();
  const { activeAssetId } = useAssetSelection();
  const [selectedBalance, setSelectedBalance] = useState<Balance | undefined>();

  const selectedBalanceId = getSelectedBalanceId(activeAssetId!);

  useEffect(() => {
    sdk.balances().then((balances) => {
      setSelectedBalance(
        balances
          .getBalances()
          .find((balance) => balance.id === selectedBalanceId)
      );
    });
  }, [sdk, selectedBalanceId]);

  return {
    selectedBalance,
    selectedBalanceId,
  };
}
