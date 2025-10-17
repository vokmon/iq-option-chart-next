"use client";

import {
  NumberInput,
  Text,
  Group,
  Card,
  ThemeIcon,
  Paper,
  Grid,
  Switch,
  Select,
} from "@mantine/core";
import { useTranslations } from "next-intl";
import { IconCalculator, IconTrendingUp } from "@tabler/icons-react";
import { MartingaleSettings } from "@/stores/settingsStore";

interface MartingaleSectionProps {
  draftMartingale: MartingaleSettings;
  updateDraftMartingale: (settings: Partial<MartingaleSettings>) => void;
}

const MAX_MULTIPLIER = 3;
const MIN_MULTIPLIER = 1;

export default function MartingaleSection({
  draftMartingale,
  updateDraftMartingale,
}: MartingaleSectionProps) {
  const t = useTranslations();

  const handleLevelChange = (value: string | null) => {
    if (value) {
      const newLevel = Number(value);
      const currentLevel = draftMartingale.numberOfMartingales;

      if (newLevel > currentLevel) {
        // Add new levels with default multiplier
        const newMultipliers = [
          ...draftMartingale.multipliers,
          ...Array(newLevel - currentLevel).fill(2.5),
        ];
        updateDraftMartingale({
          numberOfMartingales: newLevel,
          multipliers: newMultipliers,
        });
      } else if (newLevel < currentLevel) {
        // Remove excess levels
        const newMultipliers = draftMartingale.multipliers.slice(0, newLevel);
        updateDraftMartingale({
          numberOfMartingales: newLevel,
          multipliers: newMultipliers,
        });
      }
    }
  };

  const updateMultiplier = (index: number, value: number) => {
    const newMultipliers = [...draftMartingale.multipliers];
    newMultipliers[index] = Math.max(1, value);
    updateDraftMartingale({
      multipliers: newMultipliers,
    });
  };

  const toggleMartingale = () => {
    updateDraftMartingale({
      enabled: !draftMartingale.enabled,
    });
  };

  const levelOptions = [
    { value: "1", label: t("1 Level") },
    { value: "2", label: t("levels Levels", { levels: 2 }) },
    { value: "3", label: t("levels Levels", { levels: 3 }) },
    { value: "4", label: t("levels Levels", { levels: 4 }) },
  ];

  return (
    <Paper p="xl" withBorder>
      <fieldset className="border border-purple-200 dark:border-purple-700 rounded-xl p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <legend className="px-4 text-lg font-semibold text-purple-900 dark:text-purple-100 flex items-center gap-2">
          <ThemeIcon size="md" radius="xl" variant="light" color="purple">
            <IconCalculator size={18} />
          </ThemeIcon>
          {t("Martingale Strategy")}
        </legend>
        <div className="space-y-4 -mt-2">
          {/* Toggle Switch */}
          <Group justify="space-between" align="center">
            <div>
              <Text size="md" fw={500}>
                {t("Enable Martingale Strategy")}
              </Text>
              <Text size="sm" c="dimmed">
                {t("Turn on/off the martingale strategy")}
              </Text>
            </div>
            <Switch
              checked={draftMartingale.enabled}
              onChange={toggleMartingale}
              size="md"
              color="purple"
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

          {draftMartingale.enabled && (
            <>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-700">
                <Text size="sm" c="purple.8" fw={500}>
                  {t("Configure your martingale levels and multipliers")}
                </Text>
              </div>

              {/* Number of Martingales Control */}
              <Card
                padding="md"
                radius="lg"
                className="border border-blue-200 dark:border-blue-700 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20"
              >
                <Group gap="sm" mb="md">
                  <ThemeIcon size="lg" radius="xl" variant="light" color="blue">
                    <IconTrendingUp size={20} />
                  </ThemeIcon>
                  <div className="flex-1">
                    <Text size="md" fw={600} c="blue.8">
                      {t("Number of Martingale Levels")}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {t("Set how many martingale levels you want")}
                    </Text>
                  </div>
                </Group>
                <Select
                  value={draftMartingale.numberOfMartingales.toString()}
                  onChange={handleLevelChange}
                  data={levelOptions}
                  size="md"
                  radius="md"
                  styles={{
                    input: {
                      borderColor: "var(--mantine-color-blue-3)",
                      "&:focus": {
                        borderColor: "var(--mantine-color-blue-5)",
                      },
                    },
                  }}
                />
              </Card>

              {/* Multipliers Configuration */}
              <Card
                padding="md"
                radius="lg"
                className="border border-green-200 dark:border-green-700 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
              >
                <Group gap="sm" mb="md">
                  <ThemeIcon
                    size="lg"
                    radius="xl"
                    variant="light"
                    color="green"
                  >
                    <IconCalculator size={20} />
                  </ThemeIcon>
                  <div>
                    <Text size="md" fw={600} c="green.8">
                      {t("Multiplier Configuration")}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {t(
                        "Set individual multipliers for each martingale level",
                        {
                          min: MIN_MULTIPLIER.toFixed(1),
                          max: MAX_MULTIPLIER.toFixed(1),
                        }
                      )}
                    </Text>
                  </div>
                </Group>

                <Grid gutter="md">
                  {draftMartingale.multipliers.map((multiplier, index) => (
                    <Grid.Col key={index} span={{ base: 12, sm: 6, md: 3 }}>
                      <div className="space-y-2">
                        <Text size="sm" fw={500} c="dimmed">
                          {t("M Multiplier", { level: index + 1 })}
                        </Text>
                        <NumberInput
                          value={multiplier}
                          onChange={(value) =>
                            updateMultiplier(index, Number(value) || 1)
                          }
                          min={MIN_MULTIPLIER}
                          max={MAX_MULTIPLIER}
                          step={0.1}
                          decimalScale={1}
                          size="md"
                          radius="md"
                          rightSection="x"
                          styles={{
                            input: {
                              borderColor: "var(--mantine-color-green-3)",
                              "&:focus": {
                                borderColor: "var(--mantine-color-green-5)",
                              },
                            },
                          }}
                        />
                      </div>
                    </Grid.Col>
                  ))}
                </Grid>

                {/* Summary */}
                <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-700">
                  <Text size="sm" c="green.8" fw={500}>
                    {t("Strategy Summary")}:{" "}
                    {draftMartingale.numberOfMartingales} {t("levels")} -{" "}
                    {t("Multipliers")}: [
                    {draftMartingale.multipliers.map((m, i) => (
                      <span key={i}>
                        {m}x
                        {i < draftMartingale.multipliers.length - 1 ? ", " : ""}
                      </span>
                    ))}
                    ]
                  </Text>
                </div>
              </Card>
            </>
          )}
        </div>
      </fieldset>
    </Paper>
  );
}
