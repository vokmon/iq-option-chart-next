import {
  GoalFulfillmentType,
  useGoalFulfillmentStore,
} from "@/stores/notifications/goalFulfillmentStore";
import { useClosedPositionsStore } from "@/stores/positions/closedPositionsStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { useSdk } from "@/hooks/useSdk";
import { useEffect, useRef } from "react";
import { Balance } from "@quadcode-tech/client-sdk-js";
import { useAssetStore } from "@/stores/assetStore";
import { useTradingStore } from "@/stores/tradingStore";
import { formatDate } from "@/utils/dateTime";
import {
  calculateDailyLossLimit,
  calculateDailyProfitTarget,
} from "@/utils/dailySettingUtils";
import { useDailyBalanceStore } from "@/stores/dailyBalanceStore";

const useCalculateGoalFulfillment = () => {
  const balancesRef = useRef<Balance[]>([]);
  const { sdk } = useSdk();

  const { assets } = useAssetStore();
  const { updateAutoTrade, getAutoTrade } = useTradingStore();

  const { closedPositions } = useClosedPositionsStore();
  const {
    getAllFulfillments,
    recordGoalFulfillment,
    getFulfillmentForBalance,
  } = useGoalFulfillmentStore();
  const { tradingGoals } = useSettingsStore();
  const { getStartingBalance } = useDailyBalanceStore();

  useEffect(() => {
    sdk.balances().then((balances) => {
      balancesRef.current = balances.getBalances();
    });
  }, [sdk]);

  useEffect(() => {
    const allBalances = balancesRef.current;

    const profitTargetPercentage = tradingGoals.profitTargetPercentage;
    const lossLimitPercentage = tradingGoals.lossLimitPercentage;

    for (const balance of allBalances) {
      const dailyProfitTarget = calculateDailyProfitTarget(
        getStartingBalance(balance!.id!)?.startingAmount ?? 0,
        profitTargetPercentage
      );
      const dailyLossLimit = calculateDailyLossLimit(
        getStartingBalance(balance!.id!)?.startingAmount ?? 0,
        lossLimitPercentage
      );

      // Check if there's already a fulfillment for this balance today
      const existingFulfillment = getFulfillmentForBalance(
        balance.id.toString()
      );
      const currentDate = formatDate(new Date());
      if (existingFulfillment && existingFulfillment.date === currentDate) {
        continue; // Skip calculation if fulfillment already exists for today
      }

      const closedPositionsForBalance = closedPositions.filter(
        (position) => position.balanceId === balance.id
      );

      if (closedPositionsForBalance.length === 0) {
        continue;
      }

      const sum = closedPositionsForBalance.reduce(
        (acc, position) => acc + (position.pnl ?? 0),
        0
      );

      if (sum >= dailyProfitTarget || sum <= -dailyLossLimit) {
        const type =
          sum >= dailyProfitTarget
            ? GoalFulfillmentType.PROFIT
            : GoalFulfillmentType.LOSS;

        const targetValue =
          type === GoalFulfillmentType.PROFIT
            ? dailyProfitTarget
            : -dailyLossLimit;

        recordGoalFulfillment({
          balance: {
            balanceId: balance.id,
            balanceType: balance.type!,
            balanceCurrency: balance.currency!,
          },
          type: type,
          actualValue: sum,
          targetValue: targetValue,
        });

        // turn off auto trade
        assets.forEach((assetTab) => {
          const autoTrade = getAutoTrade(assetTab.id);
          if (autoTrade) {
            updateAutoTrade(assetTab.id, {
              enable: false,
              amount: autoTrade.amount,
            });
          }
        });
      }
    }
  }, [
    closedPositions,
    getAllFulfillments,
    recordGoalFulfillment,
    getFulfillmentForBalance,
    assets,
    updateAutoTrade,
    getAutoTrade,
    tradingGoals.profitTargetPercentage,
    tradingGoals.lossLimitPercentage,
    getStartingBalance,
  ]);
  return {};
};

export default useCalculateGoalFulfillment;
