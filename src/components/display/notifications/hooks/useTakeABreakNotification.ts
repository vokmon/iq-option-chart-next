import { useBreakWarningStore } from "@/stores/notifications/breakWarningStore";

export function useTakeABreakNotification() {
  const { getActiveWarnings } = useBreakWarningStore();
  const activeWarnings = getActiveWarnings();
  const hasActiveWarnings = activeWarnings.length > 0;

  return { activeWarnings, hasActiveWarnings };
}
