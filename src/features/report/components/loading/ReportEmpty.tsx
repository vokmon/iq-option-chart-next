"use client";

import { useTranslations } from "next-intl";
import { ThemeIcon, Text, Button, Stack, Group } from "@mantine/core";
import {
  IconChartBar,
  IconTrendingUp,
  IconTarget,
  IconRocket,
  IconArrowRight,
} from "@tabler/icons-react";

export default function ReportEmpty() {
  const t = useTranslations();

  return (
    <div className="rounded-xl py-10 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-slate-900/40 dark:via-blue-900/10 dark:to-indigo-900/15 flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center">
        {/* Main Icon */}
        <div className="mb-8">
          <ThemeIcon
            size={120}
            radius="xl"
            variant="light"
            color="blue"
            className="mx-auto"
          >
            <IconChartBar size={60} />
          </ThemeIcon>
        </div>

        {/* Title */}
        <Text
          size="xl"
          fw={700}
          className="text-slate-700 dark:text-slate-300 mb-4"
        >
          {t("No Trading Data Yet")}
        </Text>

        {/* Description */}
        <Text
          size="lg"
          c="dimmed"
          className="text-slate-600 dark:text-slate-400 mb-8"
        >
          {t(
            "Start your trading journey to see detailed performance reports, charts, and analytics"
          )}
        </Text>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <ThemeIcon
              size="lg"
              radius="xl"
              variant="light"
              color="green"
              className="mb-3"
            >
              <IconTrendingUp size={24} />
            </ThemeIcon>
            <Text
              fw={600}
              size="sm"
              className="text-slate-700 dark:text-slate-300 mb-2"
            >
              {t("Performance Tracking")}
            </Text>
            <Text
              size="xs"
              c="dimmed"
              className="text-slate-600 dark:text-slate-400"
            >
              {t("Monitor your P&L progression with detailed charts")}
            </Text>
          </div>

          <div className="p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <ThemeIcon
              size="lg"
              radius="xl"
              variant="light"
              color="blue"
              className="mb-3"
            >
              <IconTarget size={24} />
            </ThemeIcon>
            <Text
              fw={600}
              size="sm"
              className="text-slate-700 dark:text-slate-300 mb-2"
            >
              {t("Asset Analytics")}
            </Text>
            <Text
              size="xs"
              c="dimmed"
              className="text-slate-600 dark:text-slate-400"
            >
              {t("Analyze performance by individual assets")}
            </Text>
          </div>

          <div className="p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <ThemeIcon
              size="lg"
              radius="xl"
              variant="light"
              color="orange"
              className="mb-3"
            >
              <IconRocket size={24} />
            </ThemeIcon>
            <Text
              fw={600}
              size="sm"
              className="text-slate-700 dark:text-slate-300 mb-2"
            >
              {t("Smart Insights")}
            </Text>
            <Text
              size="xs"
              c="dimmed"
              className="text-slate-600 dark:text-slate-400"
            >
              {t("Get actionable insights from your trading data")}
            </Text>
          </div>
        </div>

        {/* Call to Action */}
        <Stack gap="md" align="center" mb="md">
          <Text
            size="sm"
            c="dimmed"
            className="text-slate-600 dark:text-slate-400"
          >
            {t("Ready to start trading?")}
          </Text>

          <Group gap="sm">
            <Button
              size="lg"
              variant="filled"
              color="blue"
              rightSection={<IconArrowRight size={16} />}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {t("Start Trading")}
            </Button>

            <Button
              size="lg"
              variant="outline"
              color="blue"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              {t("Learn More")}
            </Button>
          </Group>
        </Stack>

        {/* Footer Note */}
        <Text
          size="xs"
          c="dimmed"
          className="mt-8 text-slate-500 dark:text-slate-500"
        >
          {t("Your trading data will appear here once you start making trades")}
        </Text>
      </div>
    </div>
  );
}
