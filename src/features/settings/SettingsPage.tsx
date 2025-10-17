"use client";

import { Text, Group, Box, Button, Stack } from "@mantine/core";
import { useTranslations } from "next-intl";
import { IconSettings, IconCheck, IconX } from "@tabler/icons-react";
import { useSettingsUI } from "./hooks/useSettingsUI";
import TradingGoalsSection from "./components/TradingGoalsSection";
import TradingLimitsSection from "./components/trade-limit/TradingLimitsSection";

export default function SettingsPage() {
  const t = useTranslations();
  const {
    draftTradingGoals,
    draftTradingLimits,
    hasUnsavedChanges,

    updateDraftTradingGoals,
    updateDraftTradingLimits,
    handleSave,
    handleCancel,
    handleReset,
  } = useSettingsUI();

  return (
    <div className="max-w-2xl mx-auto pb-10">
      {/* Header */}
      <Box className="mb-6">
        <Group justify="center" gap="md" className="mb-2">
          <Box className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/40">
            <IconSettings size={32} className="text-white" />
          </Box>
          <Text
            size="xl"
            fw={700}
            c="dark.1"
            className="drop-shadow-sm tracking-wide"
          >
            {t("Trade Settings")}
          </Text>
        </Group>
        <Text size="sm" ta="center" c="dimmed" className="mt-2">
          {t("Configure your trading preferences and settings")}
        </Text>
      </Box>

      {/* Unsaved Changes Alert */}
      {/* {hasUnsavedChanges && (
        <Alert
          color="yellow"
          title={t("Unsaved Changes")}
          icon={<IconX size={16} />}
          onClose={() => {}}
          withCloseButton
        >
          {t("You have unsaved changes")}
        </Alert>
      )} */}

      {/* Settings Sections */}
      <Stack gap="lg">
        <TradingGoalsSection
          draftTradingGoals={draftTradingGoals}
          updateDraftTradingGoals={updateDraftTradingGoals}
        />
        <TradingLimitsSection
          draftTradingLimits={draftTradingLimits}
          updateDraftTradingLimits={updateDraftTradingLimits}
        />
      </Stack>

      {/* Action Buttons */}
      <Box className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
        <Button
          onClick={handleSave}
          disabled={!hasUnsavedChanges}
          leftSection={<IconCheck size={16} />}
          size="md"
          radius="xl"
          className="flex-1 sm:flex-none"
        >
          {t("Save Settings")}
        </Button>

        <Button
          onClick={handleCancel}
          disabled={!hasUnsavedChanges}
          variant="outline"
          leftSection={<IconX size={16} />}
          size="md"
          radius="xl"
          className="flex-1 sm:flex-none"
        >
          {t("Cancel")}
        </Button>

        <Button
          onClick={handleReset}
          variant="light"
          color="blue"
          size="md"
          radius="xl"
          className="flex-1 sm:flex-none"
        >
          {t("Reset to Defaults")}
        </Button>
      </Box>
    </div>
  );
}
