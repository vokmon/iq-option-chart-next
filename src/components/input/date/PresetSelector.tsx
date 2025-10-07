"use client";

import { Button, Grid, Text, Stack } from "@mantine/core";
import { useTranslations } from "next-intl";

interface PresetOption {
  label: string;
  value: string;
  getDates: () => Date[];
}

interface PresetSelectorProps {
  presets: PresetOption[];
  selectedPreset: string;
  onPresetSelect: (preset: PresetOption) => void;
}

export default function PresetSelector({
  presets,
  selectedPreset,
  onPresetSelect,
}: PresetSelectorProps) {
  const t = useTranslations();
  return (
    <Stack gap="xs">
      <Text size="sm" fw={500} className="text-gray-800">
        Quick Select
      </Text>
      <Grid>
        {presets.map((preset) => (
          <Grid.Col key={preset.value} span={6}>
            <Button
              variant={selectedPreset === preset.value ? "filled" : "subtle"}
              color={selectedPreset === preset.value ? "blue" : "gray"}
              size="xs"
              onClick={() => onPresetSelect(preset)}
              fullWidth
              justify="flex-start"
              className={
                selectedPreset === preset.value ? "text-white" : "text-gray-800"
              }
              style={{
                color: selectedPreset === preset.value ? "white" : "#1f2937",
              }}
            >
              {t(preset.label)}
            </Button>
          </Grid.Col>
        ))}
      </Grid>
    </Stack>
  );
}
