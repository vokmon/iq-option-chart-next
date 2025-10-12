import { BreakWarningEvent } from "@/stores/notifications/breakWarningStore";
import TakeABreakNotificationItem from "./TakeABreakNotificationItem";

type TakeABreakNotificationListProps = {
  warnings: BreakWarningEvent[];
  onComplete?: (warning: BreakWarningEvent) => void;
};
export default function TakeABreakNotificationList({
  warnings,
  onComplete,
}: TakeABreakNotificationListProps) {
  return (
    <>
      {warnings.map((warning) => (
        <TakeABreakNotificationItem
          key={warning.id}
          warning={warning}
          onComplete={() => onComplete?.(warning)}
        />
      ))}
    </>
  );
}
