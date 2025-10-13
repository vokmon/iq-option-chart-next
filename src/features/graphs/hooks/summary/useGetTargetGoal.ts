import { useDailyBalanceStore } from "@/stores/dailyBalanceStore";
import { Balance } from "@quadcode-tech/client-sdk-js";
import { useSettingsStore } from "@/stores/settingsStore";
import {
  calculateDailyLossLimit,
  calculateDailyProfitTarget,
} from "@/utils/dailySettingUtils";

export const useGetTargetGoal = (selectedBalance?: Balance) => {
  const { getStartingBalance } = useDailyBalanceStore();
  const { tradingGoals } = useSettingsStore();
  const startingBalance = getStartingBalance(selectedBalance?.id ?? 0);

  const dailyProfitTarget = calculateDailyProfitTarget(
    startingBalance?.startingAmount ?? 0,
    tradingGoals.profitTargetPercentage
  );
  const dailyLossLimit = calculateDailyLossLimit(
    startingBalance?.startingAmount ?? 0,
    tradingGoals.lossLimitPercentage
  );

  return {
    dailyProfitTarget,
    dailyLossLimit,
  };
};
