"use client";

import { useState, useCallback } from "react";
import { useSettingsStore } from "@/stores/settingsStore";
import { notifications } from "@mantine/notifications";
import { useTranslations } from "next-intl";
import {
  RiskManagementSettings,
  TradingLimitsSettings,
  DEFAULT_RISK_MANAGEMENT,
  DEFAULT_TRADING_LIMITS,
} from "@/stores/settingsStore";

export function useSettingsUI() {
  const t = useTranslations();
  const {
    riskManagement,
    tradingLimits,
    updateRiskManagement,
    updateTradingLimits,
  } = useSettingsStore();

  const [draftRiskManagement, setDraftRiskManagement] =
    useState<RiskManagementSettings>(riskManagement);
  const [draftTradingLimits, setDraftTradingLimits] =
    useState<TradingLimitsSettings>(tradingLimits);

  // Simple comparison - no useEffect needed!
  const hasUnsavedChanges =
    JSON.stringify(riskManagement) !== JSON.stringify(draftRiskManagement) ||
    JSON.stringify(tradingLimits) !== JSON.stringify(draftTradingLimits);

  const updateDraftRiskManagement = useCallback(
    (settings: Partial<RiskManagementSettings>) => {
      setDraftRiskManagement((prev) => ({
        ...prev,
        ...settings,
        dailyProfitTarget: Math.max(
          0,
          settings.dailyProfitTarget ?? prev.dailyProfitTarget
        ),
        dailyLossLimit: Math.max(
          0,
          settings.dailyLossLimit ?? prev.dailyLossLimit
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

      updateRiskManagement(draftRiskManagement);
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
    draftRiskManagement,
    draftTradingLimits,
    updateRiskManagement,
    updateTradingLimits,
    t,
  ]);

  const handleCancel = useCallback(() => {
    setDraftRiskManagement(riskManagement);
    setDraftTradingLimits(tradingLimits);

    notifications.show({
      title: t("Changes Cancelled"),
      message: t("All changes have been reverted"),
      color: "blue",
      position: "bottom-right",
    });
  }, [riskManagement, tradingLimits, t]);

  const handleReset = useCallback(async () => {
    try {
      // Reset draft state to defaults
      setDraftRiskManagement(DEFAULT_RISK_MANAGEMENT);
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
    draftRiskManagement,
    draftTradingLimits,
    hasUnsavedChanges,

    // Actions
    updateDraftRiskManagement,
    updateDraftTradingLimits,
    handleSave,
    handleCancel,
    handleReset,
  };
}
