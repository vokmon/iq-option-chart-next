import useCalculateBreakWarning from "./hooks/notification/take-a-break/useCalculateBreakWarning";
import { useTakeABreakWarningState } from "./hooks/notification/take-a-break/useTakeABreakWarningState";
import { useBreakWarningStore } from "@/stores/notifications/breakWarningStore";
import TakeABreakDialog from "@/components/display/notifications/dialog/take-a-break/TakeABreakDialog";

export default function TakeABreakNotificationComponent() {
  useCalculateBreakWarning();
  const {
    isBreakModalOpen,
    setIsBreakModalOpen,
    activeNonAcknowledgedWarnings,
  } = useTakeABreakWarningState();
  const { acknowledgeWarning } = useBreakWarningStore();

  const handleAcknowledge = () => {
    // Acknowledge all active warnings
    activeNonAcknowledgedWarnings.forEach((warning) => {
      acknowledgeWarning(warning.balance.balanceId, warning.id);
    });
    setIsBreakModalOpen(false);
  };

  return (
    <TakeABreakDialog
      isOpen={isBreakModalOpen}
      onClose={handleAcknowledge}
      onAcknowledge={handleAcknowledge}
      activeWarnings={activeNonAcknowledgedWarnings}
    />
  );
}
