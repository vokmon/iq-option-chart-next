import { useBreakWarningStore } from "@/stores/notifications/breakWarningStore";

export function useTakeABreakNotification() {
  const { getActiveWarnings, removeWarning } = useBreakWarningStore();
  const activeWarnings = getActiveWarnings();
  const hasActiveWarnings = activeWarnings.length > 0;

  return { activeWarnings, hasActiveWarnings, removeWarning };
}
