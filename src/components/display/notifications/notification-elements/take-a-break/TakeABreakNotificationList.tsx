import { BreakWarningEvent } from "@/stores/notifications/breakWarningStore";
import TakeABreakNotificationItem from "./TakeABreakNotificationItem";

type TakeABreakNotificationListProps = {
  warnings: BreakWarningEvent[];
};
export default function TakeABreakNotificationList({
  warnings,
}: TakeABreakNotificationListProps) {
  return (
    <>
      {warnings.map((warning) => (
        <TakeABreakNotificationItem key={warning.id} warning={warning} />
      ))}
    </>
  );
}
