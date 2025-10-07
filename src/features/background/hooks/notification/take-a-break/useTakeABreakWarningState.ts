import { useState, useEffect } from "react";
import { useBreakWarningStore } from "@/stores/notifications/breakWarningStore";

export function useTakeABreakWarningState() {
  const [isBreakModalOpen, setIsBreakModalOpen] = useState(false);
  const { getActiveWarnings } = useBreakWarningStore();
  const activeWarnings = getActiveWarnings();

  const activeNonAcknowledgedWarnings = activeWarnings.filter(
    (warning) => !warning.acknowledgedAt
  );

  useEffect(() => {
    if (activeNonAcknowledgedWarnings.length > 0) {
      setIsBreakModalOpen(true);
    }
  }, [activeNonAcknowledgedWarnings]);

  return {
    isBreakModalOpen,
    setIsBreakModalOpen,
    activeNonAcknowledgedWarnings,
  };
}
