import { Balance, Position } from "@quadcode-tech/client-sdk-js";
import { Card, Text, Group, Badge, ThemeIcon } from "@mantine/core";
import {
  IconTrendingUp,
  IconTrendingDown,
  IconChartArea,
} from "@tabler/icons-react";
import { formatAmount } from "@/utils/currency";
import { useTranslations } from "next-intl";
import EmptyTradingSummary from "./EmptyTradingSummary";

type TradeSummaryProps = {
  closedPositions: Position[];
  balance?: Balance;
};

export default function TradeSummary({
  closedPositions,
  balance,
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

  // Determine PnL state and styling
  const isProfit = totalPnL > 0;
  const isLoss = totalPnL < 0;

  const pnlColor = isProfit ? "green" : isLoss ? "red" : "gray";
  const pnlIcon = isProfit
    ? IconTrendingUp
    : isLoss
    ? IconTrendingDown
    : IconChartArea;
  const PnLIcon = pnlIcon;

  // Determine background color and border based on PnL
  const getBackgroundClass = () => {
    if (isProfit) {
      return "bg-gradient-to-r from-green-50 to-emerald-50";
    } else if (isLoss) {
      return "bg-gradient-to-r from-red-50 to-rose-50";
    } else {
      return "bg-gradient-to-r from-slate-50 to-blue-50";
    }
  };

  const getBorderStyle = () => {
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

  return (
    <Card
      shadow="xs"
      padding="6px"
      radius="sm"
      className={`${getBackgroundClass()} hover:shadow-sm transition-all duration-200`}
      style={{
        width: "388px",
        height: "60px",
        ...getBorderStyle(),
      }}
    >
      {totalTrades === 0 ? (
        <EmptyTradingSummary />
      ) : (
        <div className="flex flex-col justify-center items-start gap-0 w-full">
          <div className="flex flex-row justify-center items-center gap-2 w-full">
            <Group gap="xs" align="center">
              <ThemeIcon
                size="sm"
                radius="sm"
                variant="light"
                color={pnlColor}
                className="flex-shrink-0"
              >
                <PnLIcon size={14} />
              </ThemeIcon>
              <div className="flex flex-col">
                <Text size="lg" fw={700} c={pnlColor} className="leading-none">
                  {formatAmount(totalPnL, balance?.currency)}
                </Text>
              </div>
            </Group>
          </div>
          <div className="flex flex-row justify-between items-center gap-2 w-full">
            <Badge
              size="sm"
              variant="light"
              color="green"
              className="px-2 py-1"
            >
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
      )}
    </Card>
  );
}
