import { Balance, Position } from "@quadcode-tech/client-sdk-js";
import { Card, Text, Group, Badge, ActionIcon } from "@mantine/core";
import {
  IconTrendingUp,
  IconTrendingDown,
  IconChartArea,
} from "@tabler/icons-react";
import { formatAmount } from "@/utils/currency";
import { useTranslations } from "next-intl";

type TradeSummaryProps = {
  closedPositions: Position[];
  balance?: Balance;
  dailyProfitTarget?: number;
  dailyLossLimit?: number;
  onPnLClick?: () => void;
};

export default function TradeSummary({
  closedPositions,
  balance,
  dailyProfitTarget,
  dailyLossLimit,
  onPnLClick,
}: TradeSummaryProps) {
  const t = useTranslations();

  // Calculate total PnL from closed positions
  const totalPnL = closedPositions.reduce((sum, position) => {
    return sum + (position.pnl ?? 0);
  }, 0);

  // Calculate win/loss statistics
  const winCount = closedPositions.filter((p) => (p.pnl ?? 0) > 0).length;
  const lossCount = closedPositions.filter((p) => (p.pnl ?? 0) < 0).length;
  const totalTrades = closedPositions.length;

  // Calculate win rate
  const winRate = totalTrades > 0 ? (winCount / totalTrades) * 100 : 0;

  // Calculate progress towards daily goals

  const progressData = calculateProgress({
    totalPnL,
    dailyProfitTarget: dailyProfitTarget || 0,
    dailyLossLimit: dailyLossLimit || 0,
    profitTargetLabel: t("of profit target", {
      amount: formatAmount(dailyProfitTarget || 0, balance?.currency),
    }),
    lossLimitLabel: t("of loss limit", {
      amount: formatAmount(dailyLossLimit || 0, balance?.currency),
    }),
  });

  // Determine PnL state and styling
  const isProfit = totalPnL > 0;
  const isLoss = totalPnL < 0;

  const pnlColor = isProfit ? "green" : isLoss ? "red" : "orange";
  const pnlIcon = isProfit
    ? IconTrendingUp
    : isLoss
    ? IconTrendingDown
    : IconChartArea;
  const PnLIcon = pnlIcon;

  return (
    <Card
      shadow="xs"
      padding="6px"
      radius="sm"
      className={`${getBackgroundClass({
        isProfit,
        isLoss,
      })} hover:shadow-sm transition-all duration-200 w-full`}
      style={{
        ...getBorderStyle({ isProfit, isLoss }),
      }}
    >
      <div className="flex flex-col justify-center items-start gap-0 w-full">
        <div className="flex flex-row justify-center items-center gap-2 w-full">
          <Group gap="xs" align="center">
            <ActionIcon
              size="sm"
              radius="sm"
              variant="light"
              color={pnlColor}
              className="flex-shrink-0 hover:scale-150 transition-transform duration-220 cursor-pointer"
              onClick={onPnLClick}
            >
              <PnLIcon size={14} />
            </ActionIcon>
            <div className="flex flex-col">
              <Text size="lg" fw={700} c={pnlColor} className="leading-none">
                {formatAmount(totalPnL, balance?.currency)}
              </Text>
            </div>
          </Group>
        </div>

        {progressData && (
          <div className="w-full px-1 py-1">
            <div className="flex flex-row justify-between items-center w-full mt-1">
              <Text size="xs" c="red.6" fw={500}>
                {formatAmount(dailyLossLimit || 0, balance?.currency)}
              </Text>
              <Text size="xs" c="green.6" fw={500}>
                {formatAmount(dailyProfitTarget || 0, balance?.currency)}
              </Text>
            </div>
            <div className="relative w-full h-5 bg-gray-200 rounded-sm overflow-hidden">
              {/* Center line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-400 z-10" />
              {/* Loss bar (grows left from center) */}
              {totalPnL < 0 && (
                <div
                  className="absolute top-0 bottom-0 right-1/2 transition-all duration-300"
                  style={{
                    width: `${progressData.percentage / 2}%`,
                    background:
                      progressData.percentage < 100
                        ? "repeating-linear-gradient(45deg, rgba(239, 68, 68, 0.8), rgba(239, 68, 68, 0.8) 10px, rgba(239, 68, 68, 0.6) 10px, rgba(239, 68, 68, 0.6) 20px)"
                        : "rgb(239, 68, 68)",
                  }}
                />
              )}
              {/* Profit bar (grows right from center) */}
              {totalPnL > 0 && (
                <div
                  className="absolute top-0 bottom-0 left-1/2 transition-all duration-300"
                  style={{
                    width: `${progressData.percentage / 2}%`,
                    background:
                      progressData.percentage < 100
                        ? "repeating-linear-gradient(45deg, rgba(34, 197, 94, 0.8), rgba(34, 197, 94, 0.8) 10px, rgba(34, 197, 94, 0.6) 10px, rgba(34, 197, 94, 0.6) 20px)"
                        : "rgb(34, 197, 94)",
                  }}
                />
              )}

              {totalPnL === 0 && (
                <div className="absolute top-0 bottom-0 left-1/2 transition-all duration-300" />
              )}
              {/* Percentage badge inside the bar */}
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <Badge
                  size="sm"
                  variant="filled"
                  color={totalPnL > 0 ? "green" : totalPnL < 0 ? "red" : "gray"}
                  className="px-2"
                >
                  <Text size="xs" fw={600} c="gray.1">
                    {progressData.percentage.toFixed(0)}%
                  </Text>
                </Badge>
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-row justify-between items-center gap-2 w-full">
          <Badge size="sm" variant="light" color="green" className="px-2 py-1">
            <div className="flex flex-row justify-start items-center gap-2">
              <Text
                size="xs"
                fw={600}
                c="green"
                style={{ textTransform: "none" }}
              >
                {t("Wins")}
              </Text>
              <Text size="xs" fw={600} c="green">
                {winCount}
              </Text>
            </div>
          </Badge>
          <Badge size="sm" variant="light" color="red" className="px-2 py-1">
            <div className="flex flex-row justify-start items-center gap-2">
              <Text
                size="xs"
                fw={600}
                c="red"
                style={{ textTransform: "none" }}
              >
                {t("Losses")}
              </Text>
              <Text size="xs" fw={600} c="red">
                {lossCount}
              </Text>
            </div>
          </Badge>

          <Badge
            size="sm"
            variant="light"
            color={winRate >= 50 ? "green" : winRate >= 30 ? "orange" : "red"}
            className="px-2 py-1"
            style={{ textTransform: "none" }}
          >
            <div className="flex flex-row justify-start items-center gap-2">
              <Text size="xs">{t("Win Rate")}</Text>
              <Text size="xs" fw={600}>
                {winRate.toFixed(0)}%
              </Text>
            </div>
          </Badge>
        </div>
      </div>
    </Card>
  );
}

// Determine background color and border based on PnL
const getBackgroundClass = ({
  isProfit,
  isLoss,
}: {
  isProfit: boolean;
  isLoss: boolean;
}) => {
  if (isProfit) {
    return "bg-gradient-to-r from-green-50 to-emerald-50";
  } else if (isLoss) {
    return "bg-gradient-to-r from-red-50 to-rose-50";
  } else {
    return "bg-gradient-to-r from-slate-50 to-blue-50";
  }
};

const getBorderStyle = ({
  isProfit,
  isLoss,
}: {
  isProfit: boolean;
  isLoss: boolean;
}) => {
  if (isProfit) {
    return {
      border: "1px solid rgba(34, 197, 94, 0.15)",
      boxShadow:
        "0 0 12px rgba(34, 197, 94, 0.08), inset 0 0 12px rgba(34, 197, 94, 0.03)",
    };
  } else if (isLoss) {
    return {
      border: "1px solid rgba(239, 68, 68, 0.15)",
      boxShadow:
        "0 0 12px rgba(239, 68, 68, 0.08), inset 0 0 12px rgba(239, 68, 68, 0.03)",
    };
  } else {
    return {
      border: "1px solid rgba(100, 116, 139, 0.15)",
      boxShadow:
        "0 0 12px rgba(100, 116, 139, 0.08), inset 0 0 12px rgba(100, 116, 139, 0.03)",
    };
  }
};

const calculateProgress = ({
  totalPnL,
  dailyProfitTarget,
  dailyLossLimit,
  profitTargetLabel,
  lossLimitLabel,
}: {
  totalPnL: number;
  dailyProfitTarget: number;
  dailyLossLimit: number;
  profitTargetLabel: string;
  lossLimitLabel: string;
}) => {
  if (totalPnL > 0 && dailyProfitTarget) {
    const percentage = (totalPnL / dailyProfitTarget) * 100;
    return {
      percentage: Math.min(percentage, 100),
      label: `${percentage.toFixed(0)}% ${profitTargetLabel}`,
      color: "green",
    };
  } else if (totalPnL < 0 && dailyLossLimit) {
    const percentage = (Math.abs(totalPnL) / dailyLossLimit) * 100;
    return {
      percentage: Math.min(percentage, 100),
      label: `${percentage.toFixed(0)}% ${lossLimitLabel}`,
      color: "red",
    };
  }
  return {
    percentage: 0,
    label: "0%",
    color: "gray",
  };
};
