"use client";

import { NumberInput, Text, Group, Card, ThemeIcon } from "@mantine/core";
import { useTranslations } from "next-intl";
import { IconTrendingUp, IconShield, IconTarget } from "@tabler/icons-react";
import { RiskManagementSettings } from "@/stores/settingsStore";

interface RiskManagementSectionProps {
  draftRiskManagement: RiskManagementSettings;
  updateDraftRiskManagement: (
    settings: Partial<RiskManagementSettings>
  ) => void;
}

export default function RiskManagementSection({
  draftRiskManagement,
  updateDraftRiskManagement,
}: RiskManagementSectionProps) {
  const t = useTranslations();

  return (
    <fieldset className="border border-blue-200 dark:border-blue-700 rounded-xl p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
      <legend className="px-4 text-lg font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
        <ThemeIcon size="md" radius="xl" variant="light" color="blue">
          <IconTarget size={18} />
        </ThemeIcon>
        {t("Trading Goals & Protection")}
      </legend>
      <div className="space-y-4 -mt-2">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
          <Text size="sm" c="blue.8" fw={500}>
            {t("Hit your daily targets")}
          </Text>
        </div>
        <Card
          padding="md"
          radius="lg"
          className="border border-green-200 dark:border-green-700 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
        >
          <Group gap="sm" mb="sm">
            <ThemeIcon size="lg" radius="xl" variant="light" color="green">
              <IconTrendingUp size={20} />
            </ThemeIcon>
            <div>
              <Text size="md" fw={600} c="green.8">
                {t("Daily Profit Target")}
              </Text>
              <Text size="sm" c="dimmed">
                {t("Set your daily profit target")}
              </Text>
            </div>
          </Group>
          <NumberInput
            placeholder="0"
            value={draftRiskManagement.dailyProfitTarget}
            onChange={(value) =>
              updateDraftRiskManagement({
                dailyProfitTarget: Number(value) || 0,
              })
            }
            min={0}
            step={10}
            size="md"
            radius="md"
            leftSection="$"
            styles={{
              input: {
                borderColor: "var(--mantine-color-green-3)",
                "&:focus": {
                  borderColor: "var(--mantine-color-green-5)",
                },
              },
            }}
          />
        </Card>

        <Card
          padding="md"
          radius="lg"
          className="border border-red-200 dark:border-red-700 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20"
        >
          <Group gap="sm" mb="sm">
            <ThemeIcon size="lg" radius="xl" variant="light" color="red">
              <IconShield size={20} />
            </ThemeIcon>
            <div>
              <Text size="md" fw={600} c="red.8">
                {t("Daily Loss Limit")}
              </Text>
              <Text size="sm" c="dimmed">
                {t("Set your daily loss protection limit")}
              </Text>
            </div>
          </Group>
          <NumberInput
            placeholder="0"
            value={draftRiskManagement.dailyLossLimit}
            onChange={(value) =>
              updateDraftRiskManagement({ dailyLossLimit: Number(value) || 0 })
            }
            min={0}
            step={10}
            size="md"
            radius="md"
            leftSection="$"
            styles={{
              input: {
                borderColor: "var(--mantine-color-red-3)",
                "&:focus": {
                  borderColor: "var(--mantine-color-red-5)",
                },
              },
            }}
          />
        </Card>
      </div>
    </fieldset>
  );
}
