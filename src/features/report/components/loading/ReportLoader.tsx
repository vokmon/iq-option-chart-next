"use client";

import { useTranslations } from "next-intl";
import { ThemeIcon, Text, Group, Skeleton } from "@mantine/core";
import { IconLoader } from "@tabler/icons-react";

export default function ReportLoader() {
  const t = useTranslations();

  return (
    <div className="py-10 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-slate-900/40 dark:via-blue-900/10 dark:to-indigo-900/15 flex items-center justify-center">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header with Loading Icon */}
        <div className="text-center mb-8">
          <ThemeIcon
            size={80}
            radius="xl"
            variant="light"
            color="blue"
            className="mx-auto mb-4"
          >
            <IconLoader size={40} className="animate-spin" />
          </ThemeIcon>
          <Text
            size="lg"
            fw={600}
            className="text-slate-700 dark:text-slate-300"
          >
            {t("Loading Trading Data")}
          </Text>
          <Text
            size="sm"
            c="dimmed"
            className="text-slate-600 dark:text-slate-400 mt-2"
          >
            {t("Please wait while we fetch your performance data")}
          </Text>
        </div>

        {/* Loading Skeletons */}
        <div className="space-y-6">
          {/* Summary Metrics Skeleton */}
          <div className="bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Skeleton height={24} width={24} radius="xl" />
              <Skeleton height={20} width={120} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="text-center">
                  <Skeleton height={16} width={80} className="mx-auto mb-2" />
                  <Skeleton height={24} width={100} className="mx-auto" />
                </div>
              ))}
            </div>
          </div>

          {/* Chart Skeleton */}
          <div className="bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Skeleton height={24} width={24} radius="xl" />
              <Skeleton height={20} width={150} />
            </div>
            <Skeleton height={150} width="100%" radius="md" />
          </div>

          {/* Table Skeleton */}
        </div>

        {/* Loading Progress Indicator */}
        <div className="text-center mt-8">
          <Group justify="center" gap="xs">
            <div
              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </Group>
          <Text size="xs" c="dimmed" className="mt-2">
            {t("This may take a few moments")}
          </Text>
        </div>
      </div>
    </div>
  );
}
