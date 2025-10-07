"use client";

import {
  Grid,
  Paper,
  Text,
  Group,
  Stack,
  Badge,
  ThemeIcon,
} from "@mantine/core";
import { Balance, Position } from "@quadcode-tech/client-sdk-js";
import {
  IconTrendingUp,
  IconTrendingDown,
  IconTarget,
  IconChartArea,
  IconTrophy,
  IconX,
  IconPercentage,
  IconFlame,
  IconTrendingDown as IconLoss,
} from "@tabler/icons-react";
import { formatAmount } from "@/utils/currency";
import { useTranslations } from "next-intl";

interface SummaryMetricsGridProps {
  closedPositions: Position[];
  balance: Balance | null;
}

export default function SummaryMetricsGrid({
  closedPositions,
  balance,
}: SummaryMetricsGridProps) {
  // Calculate metrics from closedPositions (same as TradeSummary)
  const totalPnL = closedPositions.reduce((sum, position) => {
    return sum + (position.pnl ?? 0);
  }, 0);

  // Calculate win/loss statistics (same as TradeSummary)
  const { winCount, lossCount, totalTrades, winRate } =
    calculateWinRate(closedPositions);
  const { winStreak, lossStreak } = calculateStreaks(closedPositions);

  // Determine PnL state and styling (same as TradeSummary)
  const { isProfit, isLoss, pnlColor, PnLIcon } = calculatePnL(
    closedPositions,
    totalPnL
  );
  const t = useTranslations();

  return (
    <fieldset className="mx-auto w-[900px] border border-slate-200 dark:border-slate-700 rounded-xl p-6 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-slate-900/40 dark:via-blue-900/10 dark:to-indigo-900/15 shadow-sm">
      <legend className="px-4 text-lg font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
        <ThemeIcon size="md" radius="xl" variant="light" color="blue">
          <IconTarget size={18} />
        </ThemeIcon>
        {t("Summary")}
      </legend>
      <div className="flex flex-col md:flex-row gap-4">
        {/* Total P&L Card - Left Side */}
        <div className="w-full md:w-1/3">
          <Paper
            p="xl"
            withBorder
            className={`h-full ${
              isProfit
                ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-[0_8px_32px_rgba(34,197,94,0.15)]"
                : isLoss
                ? "bg-gradient-to-br from-red-50 to-rose-50 border-red-200 shadow-[0_8px_32px_rgba(239,68,68,0.15)]"
                : "bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200 shadow-[0_8px_32px_rgba(100,116,139,0.15)]"
            }`}
          >
            <Stack gap="lg" align="center" justify="center" className="h-full">
              <div className="flex flex-row items-center gap-2">
                <ThemeIcon
                  size="xl"
                  radius="lg"
                  variant="light"
                  color={pnlColor}
                >
                  <PnLIcon size={28} />
                </ThemeIcon>

                <Stack gap="xs" align="center">
                  <Text
                    size="30px"
                    fw={900}
                    c={pnlColor}
                    className={`text-center leading-none ${
                      isProfit
                        ? "drop-shadow-[0_4px_8px_rgba(34,197,94,0.3)]"
                        : isLoss
                        ? "drop-shadow-[0_4px_8px_rgba(239,68,68,0.3)]"
                        : "drop-shadow-[0_4px_8px_rgba(100,116,139,0.3)]"
                    }`}
                  >
                    {formatAmount(totalPnL, balance?.currency)}
                  </Text>
                </Stack>
              </div>
              {/* Performance Indicator */}
              <Badge
                size="xl"
                variant="filled"
                color={pnlColor}
                className={`px-6 py-3 ${
                  isProfit
                    ? "shadow-[0_4px_12px_rgba(34,197,94,0.3)]"
                    : isLoss
                    ? "shadow-[0_4px_12px_rgba(239,68,68,0.3)]"
                    : "shadow-[0_4px_12px_rgba(100,116,139,0.3)]"
                }`}
              >
                <Group gap="xs">
                  <PnLIcon size={18} />
                  <Text size="md" fw={700} className="normal-case">
                    {isProfit ? "Profit" : isLoss ? "Loss" : "Even"}
                  </Text>
                </Group>
              </Badge>
            </Stack>
          </Paper>
        </div>

        {/* Trading Performance - Right Side */}
        <div className="w-full md:w-2/3">
          <Stack gap="md">
            {/* Metrics as Cards - 2x3 Layout */}
            <Grid>
              {/* Row 1: Win Rate, Wins, Losses */}
              <Grid.Col span={{ base: 6, md: 4 }}>
                <Paper
                  p="md"
                  withBorder
                  className={`h-full transition-all duration-200 hover:shadow-md ${
                    winRate >= 50
                      ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
                      : "bg-gradient-to-br from-red-50 to-rose-50 border-red-200"
                  }`}
                >
                  <Stack gap="md" align="center">
                    <Group gap="xs" align="center" justify="center">
                      <ThemeIcon
                        size="md"
                        radius="md"
                        variant="light"
                        color={winRate >= 50 ? "green" : "red"}
                      >
                        <IconPercentage size={16} />
                      </ThemeIcon>
                      <Text size="sm" fw={600} c="dimmed">
                        {t("Win Rate")}
                      </Text>
                    </Group>
                    <Text
                      size="2xl"
                      fw={800}
                      c={winRate >= 50 ? "green" : "red"}
                    >
                      {winRate.toFixed(0)}%
                    </Text>
                  </Stack>
                </Paper>
              </Grid.Col>

              <Grid.Col span={{ base: 6, md: 4 }}>
                <Paper
                  p="md"
                  withBorder
                  className="h-full bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 transition-all duration-200 hover:shadow-md"
                >
                  <Stack gap="md" align="center">
                    <Group gap="xs" align="center" justify="center">
                      <ThemeIcon
                        size="md"
                        radius="md"
                        variant="light"
                        color="green"
                      >
                        <IconTrophy size={16} />
                      </ThemeIcon>
                      <Text size="sm" fw={600} c="dimmed">
                        {t("Wins")}
                      </Text>
                    </Group>
                    <Text size="2xl" fw={800} c="green">
                      {winCount}
                    </Text>
                  </Stack>
                </Paper>
              </Grid.Col>

              <Grid.Col span={{ base: 6, md: 4 }}>
                <Paper
                  p="md"
                  withBorder
                  className="h-full bg-gradient-to-br from-red-50 to-rose-50 border-red-200 transition-all duration-200 hover:shadow-md"
                >
                  <Stack gap="md" align="center">
                    <Group gap="xs" align="center" justify="center">
                      <ThemeIcon
                        size="md"
                        radius="md"
                        variant="light"
                        color="red"
                      >
                        <IconX size={16} />
                      </ThemeIcon>
                      <Text size="sm" fw={600} c="dimmed">
                        {t("Losses")}
                      </Text>
                    </Group>
                    <Text size="2xl" fw={800} c="red">
                      {lossCount}
                    </Text>
                  </Stack>
                </Paper>
              </Grid.Col>

              {/* Row 2: Total Trades, Win Streak, Loss Streak */}
              <Grid.Col span={{ base: 6, md: 4 }}>
                <Paper
                  p="md"
                  withBorder
                  className="h-full bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 transition-all duration-200 hover:shadow-md"
                >
                  <Stack gap="md" align="center">
                    <Group gap="xs" align="center" justify="center">
                      <ThemeIcon
                        size="md"
                        radius="md"
                        variant="light"
                        color="blue"
                      >
                        <IconTarget size={16} />
                      </ThemeIcon>
                      <Text size="sm" fw={600} c="dimmed">
                        {t("Total Trades")}
                      </Text>
                    </Group>
                    <Text size="2xl" fw={800} c="blue">
                      {totalTrades}
                    </Text>
                  </Stack>
                </Paper>
              </Grid.Col>

              <Grid.Col span={{ base: 6, md: 4 }}>
                <Paper
                  p="md"
                  withBorder
                  className="h-full bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 transition-all duration-200 hover:shadow-md"
                >
                  <Stack gap="md" align="center">
                    <Group gap="xs" align="center" justify="center">
                      <ThemeIcon
                        size="md"
                        radius="md"
                        variant="light"
                        color="green"
                      >
                        <IconFlame size={16} />
                      </ThemeIcon>
                      <Text size="sm" fw={600} c="dimmed">
                        {t("Win Streak")}
                      </Text>
                    </Group>
                    <Text size="2xl" fw={800} c="green">
                      {winStreak}
                    </Text>
                  </Stack>
                </Paper>
              </Grid.Col>

              <Grid.Col span={{ base: 6, md: 4 }}>
                <Paper
                  p="md"
                  withBorder
                  className="h-full bg-gradient-to-br from-red-50 to-rose-50 border-red-200 transition-all duration-200 hover:shadow-md"
                >
                  <Stack gap="md" align="center">
                    <Group gap="xs" align="center" justify="center">
                      <ThemeIcon
                        size="md"
                        radius="md"
                        variant="light"
                        color="red"
                      >
                        <IconLoss size={16} />
                      </ThemeIcon>
                      <Text size="sm" fw={600} c="dimmed">
                        {t("Loss Streak")}
                      </Text>
                    </Group>
                    <Text size="2xl" fw={800} c="red">
                      {lossStreak}
                    </Text>
                  </Stack>
                </Paper>
              </Grid.Col>
            </Grid>
          </Stack>
        </div>
      </div>
    </fieldset>
  );
}

// Calculate win streak and loss streak
const calculateStreaks = (closedPositions: Position[]) => {
  if (closedPositions.length === 0) return { winStreak: 0, lossStreak: 0 };

  // Sort positions by close time (most recent first)
  const sortedPositions = [...closedPositions].sort((a, b) => {
    const timeA = a.closeTime?.getTime() || 0;
    const timeB = b.closeTime?.getTime() || 0;
    return timeB - timeA;
  });

  let currentWinStreak = 0;
  let currentLossStreak = 0;
  let maxWinStreak = 0;
  let maxLossStreak = 0;

  for (const position of sortedPositions) {
    const pnl = position.pnl ?? 0;

    if (pnl > 0) {
      // Win
      if (currentLossStreak > 0) {
        maxLossStreak = Math.max(maxLossStreak, currentLossStreak);
        currentLossStreak = 0;
      }
      currentWinStreak++;
    } else if (pnl < 0) {
      // Loss
      if (currentWinStreak > 0) {
        maxWinStreak = Math.max(maxWinStreak, currentWinStreak);
        currentWinStreak = 0;
      }
      currentLossStreak++;
    } else {
      // Break even - reset both streaks
      maxWinStreak = Math.max(maxWinStreak, currentWinStreak);
      maxLossStreak = Math.max(maxLossStreak, currentLossStreak);
      currentWinStreak = 0;
      currentLossStreak = 0;
    }
  }

  // Update max streaks with current streaks
  maxWinStreak = Math.max(maxWinStreak, currentWinStreak);
  maxLossStreak = Math.max(maxLossStreak, currentLossStreak);

  return { winStreak: maxWinStreak, lossStreak: maxLossStreak };
};

const calculateWinRate = (closedPositions: Position[]) => {
  const winCount = closedPositions.filter((p) => (p.pnl ?? 0) > 0).length;
  const lossCount = closedPositions.filter((p) => (p.pnl ?? 0) < 0).length;
  const totalTrades = closedPositions.length;
  const winRate = totalTrades > 0 ? (winCount / totalTrades) * 100 : 0;

  return { winCount, lossCount, totalTrades, winRate };
};

const calculatePnL = (closedPositions: Position[], totalPnL: number) => {
  const isProfit = totalPnL > 0;
  const isLoss = totalPnL < 0;
  const pnlColor = isProfit ? "green" : isLoss ? "red" : "gray";
  const pnlIcon = isProfit
    ? IconTrendingUp
    : isLoss
    ? IconTrendingDown
    : IconChartArea;
  const PnLIcon = pnlIcon;

  return { isProfit, isLoss, pnlColor, PnLIcon };
};
