"use client";

import { Paper, Text, ThemeIcon } from "@mantine/core";
import { useTranslations } from "next-intl";
import { IconClockPause } from "@tabler/icons-react";
import BreakWarningSettings from "./BreakWarningSettings";
import { TradingLimitsSettings } from "@/stores/settingsStore";

interface TradingLimitsSectionProps {
  draftTradingLimits: TradingLimitsSettings;
  updateDraftTradingLimits: (settings: Partial<TradingLimitsSettings>) => void;
}

export default function TradingLimitsSection({
  draftTradingLimits,
  updateDraftTradingLimits,
}: TradingLimitsSectionProps) {
  const t = useTranslations();

  return (
    <Paper p="xl" withBorder>
      <fieldset className="border border-violet-200 dark:border-violet-700 rounded-xl p-4 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20">
        <legend className="px-4 text-lg font-semibold text-violet-900 dark:text-violet-100 flex items-center gap-2">
          <ThemeIcon size="md" radius="xl" variant="light" color="violet">
            <IconClockPause size={18} />
          </ThemeIcon>
          {t("Smart Trading Controls")}
        </legend>
        <div className="space-y-4 -mt-2">
          <div className="p-3 bg-violet-100 dark:bg-violet-900/30 rounded-lg border border-violet-200 dark:border-violet-700">
            <Text size="sm" c="violet.8" fw={500}>
              {t("Take a breather when things get rough")}
            </Text>
          </div>
          <BreakWarningSettings
            draftTradingLimits={draftTradingLimits}
            updateDraftTradingLimits={updateDraftTradingLimits}
          />
        </div>
      </fieldset>
    </Paper>
  );
}
