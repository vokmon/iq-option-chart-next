"use client";

import { NumberInput, Text, Switch, Select, Group, Stack } from "@mantine/core";
import { useTranslations } from "next-intl";
import {
  TradingLimitsSettings,
  BreakWarningSettings as BreakWarningSettingsType,
} from "@/stores/settingsStore";

interface BreakWarningSettingsProps {
  draftTradingLimits: TradingLimitsSettings;
  updateDraftTradingLimits: (settings: Partial<TradingLimitsSettings>) => void;
}

export default function BreakWarningSettings({
  draftTradingLimits,
  updateDraftTradingLimits,
}: BreakWarningSettingsProps) {
  const t = useTranslations();

  const breakWarning = draftTradingLimits.breakWarning;

  const updateDraftBreakWarning = (
    settings: Partial<BreakWarningSettingsType>
  ) => {
    updateDraftTradingLimits({
      breakWarning: {
        ...breakWarning,
        ...settings,
        minOrdersRequired: Math.max(
          1,
          settings.minOrdersRequired ?? breakWarning.minOrdersRequired
        ),
        lossThreshold: Math.max(
          1,
          settings.lossThreshold ?? breakWarning.lossThreshold
        ),
      },
    });
  };

  const toggleDraftBreakWarning = () => {
    updateDraftTradingLimits({
      breakWarning: {
        ...breakWarning,
        enabled: !breakWarning.enabled,
      },
    });
  };

  const toggleDraftPauseAutoTrade = () => {
    updateDraftTradingLimits({
      breakWarning: {
        ...breakWarning,
        pauseAutoTrade: !breakWarning.pauseAutoTrade,
      },
    });
  };

  const timeWindowOptions = [
    { value: "15", label: t("15 minutes") },
    { value: "30", label: t("30 minutes") },
  ];

  const pauseDurationOptions = [
    { value: "15", label: t("15 minutes") },
    { value: "30", label: t("30 minutes") },
    { value: "60", label: t("60 minutes") },
  ];

  return (
    <div className="space-y-4">
      <Group justify="space-between" align="center">
        <div>
          <Text size="md" fw={500}>
            {t("Cool-Down Timer")}
          </Text>
          <Text size="sm" c="dimmed">
            {t("Take a break when you hit a losing streak")}
          </Text>
        </div>
        <Switch
          checked={breakWarning.enabled}
          onChange={toggleDraftBreakWarning}
          size="md"
          color="blue"
          className="cursor-pointer"
          styles={{
            track: {
              cursor: "pointer",
            },
            thumb: {
              cursor: "pointer",
            },
          }}
        />
      </Group>

      {breakWarning.enabled && (
        <Stack gap="md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Text size="sm" fw={500} c="dimmed">
                {t("Time Window")}
              </Text>
              <Select
                value={breakWarning.timeWindow.toString()}
                onChange={(value) =>
                  updateDraftBreakWarning({
                    timeWindow: Number(value) as 15 | 30,
                  })
                }
                data={timeWindowOptions}
                size="md"
                radius="md"
                description={t("How far back to look for losing trades")}
              />
            </div>

            <div className="space-y-2">
              <Text size="sm" fw={500} c="dimmed">
                {t("Pause Duration")}
              </Text>
              <Select
                value={breakWarning.pauseDuration.toString()}
                onChange={(value) =>
                  updateDraftBreakWarning({
                    pauseDuration: Number(value) as 15 | 30 | 60,
                  })
                }
                data={pauseDurationOptions}
                size="md"
                radius="md"
                description={t("Trading pause duration after loss threshold")}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Text size="sm" fw={500} c="dimmed">
                {t("Minimum Orders")}
              </Text>
              <NumberInput
                value={breakWarning.minOrdersRequired}
                onChange={(value) =>
                  updateDraftBreakWarning({
                    minOrdersRequired: Number(value) || 1,
                  })
                }
                min={1}
                step={1}
                size="md"
                radius="md"
                description={t("Minimum trades to check")}
              />
            </div>

            <div className="space-y-2">
              <Text size="sm" fw={500} c="dimmed">
                {t("Loss Threshold")}
              </Text>
              <NumberInput
                value={breakWarning.lossThreshold}
                onChange={(value) =>
                  updateDraftBreakWarning({
                    lossThreshold: Number(value) || 1,
                  })
                }
                min={1}
                step={1}
                size="md"
                radius="md"
                description={t("How many losses in a row triggers the break")}
              />
            </div>
          </div>

          <Group justify="space-between" align="center">
            <div>
              <Text size="sm" fw={500}>
                {t("Auto-pause trading")}
              </Text>
              <Text size="xs" c="dimmed">
                {t("Automatically pause auto-trading when the break triggers")}
              </Text>
            </div>
            <Switch
              checked={breakWarning.pauseAutoTrade}
              onChange={toggleDraftPauseAutoTrade}
              size="md"
              color="blue"
              className="cursor-pointer"
              styles={{
                track: {
                  cursor: "pointer",
                },
                thumb: {
                  cursor: "pointer",
                },
              }}
            />
          </Group>
        </Stack>
      )}
    </div>
  );
}
