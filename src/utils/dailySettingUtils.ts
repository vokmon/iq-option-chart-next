export const calculateDailyProfitTarget = (
  startingBalance: number,
  profitTargetPercentage: number
) => {
  return startingBalance * (profitTargetPercentage / 100);
};

export const calculateDailyLossLimit = (
  startingBalance: number,
  lossLimitPercentage: number
) => {
  return startingBalance * (lossLimitPercentage / 100);
};
