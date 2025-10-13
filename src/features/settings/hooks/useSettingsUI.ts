"use client";

import { useState, useCallback } from "react";
import { useSettingsStore } from "@/stores/settingsStore";
import { notifications } from "@mantine/notifications";
import { useTranslations } from "next-intl";
import {
  TradingGoalsSettings,
  TradingLimitsSettings,
  DEFAULT_TRADING_GOALS,
  DEFAULT_TRADING_LIMITS,
} from "@/stores/settingsStore";

export function useSettingsUI() {
  const t = useTranslations();
  const {
    tradingGoals,
    tradingLimits,
    updateTradingGoals,
    updateTradingLimits,
  } = useSettingsStore();

  const [draftTradingGoals, setDraftTradingGoals] =
    useState<TradingGoalsSettings>(tradingGoals);
  const [draftTradingLimits, setDraftTradingLimits] =
    useState<TradingLimitsSettings>(tradingLimits);

  // Simple comparison - no useEffect needed!
  const hasUnsavedChanges =
    JSON.stringify(tradingGoals) !== JSON.stringify(draftTradingGoals) ||
    JSON.stringify(tradingLimits) !== JSON.stringify(draftTradingLimits);

  const updateDraftTradingGoals = useCallback(
    (settings: Partial<TradingGoalsSettings>) => {
      setDraftTradingGoals((prev) => ({
        ...prev,
        ...settings,
        profitTargetPercentage: Math.max(
          0,
          settings.profitTargetPercentage ?? prev.profitTargetPercentage
        ),
        lossLimitPercentage: Math.max(
          0,
          settings.lossLimitPercentage ?? prev.lossLimitPercentage
        ),
      }));
    },
    []
  );

  const updateDraftTradingLimits = useCallback(
    (settings: Partial<TradingLimitsSettings>) => {
      setDraftTradingLimits((prev) => ({
        ...prev,
        ...settings,
      }));
    },
    []
  );

  const handleSave = useCallback(async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      updateTradingGoals(draftTradingGoals);
      updateTradingLimits(draftTradingLimits);

      notifications.show({
        title: t("Settings Saved"),
        message: t("Your settings have been saved successfully"),
        color: "green",
        position: "bottom-right",
      });
    } catch (e) {
      console.error(e);
      notifications.show({
        title: t("Save Failed"),
        message: t("Failed to save settings"),
        color: "red",
        position: "bottom-right",
      });
    }
  }, [
    draftTradingGoals,
    draftTradingLimits,
    updateTradingGoals,
    updateTradingLimits,
    t,
  ]);

  const handleCancel = useCallback(() => {
    setDraftTradingGoals(tradingGoals);
    setDraftTradingLimits(tradingLimits);

    notifications.show({
      title: t("Changes Cancelled"),
      message: t("All changes have been reverted"),
      color: "blue",
      position: "bottom-right",
    });
  }, [tradingGoals, tradingLimits, t]);

  const handleReset = useCallback(async () => {
    try {
      // Reset draft state to defaults
      setDraftTradingGoals(DEFAULT_TRADING_GOALS);
      setDraftTradingLimits(DEFAULT_TRADING_LIMITS);

      notifications.show({
        title: t("Settings Reset"),
        message: t("All settings have been reset to defaults"),
        color: "blue",
        position: "bottom-right",
      });
    } catch (e) {
      console.error(e);
      notifications.show({
        title: t("Reset Failed"),
        message: t("Failed to reset settings"),
        color: "red",
        position: "bottom-right",
      });
    }
  }, [t]);

  return {
    // State
    draftTradingGoals,
    draftTradingLimits,
    hasUnsavedChanges,

    // Actions
    updateDraftTradingGoals,
    updateDraftTradingLimits,
    handleSave,
    handleCancel,
    handleReset,
  };
}
