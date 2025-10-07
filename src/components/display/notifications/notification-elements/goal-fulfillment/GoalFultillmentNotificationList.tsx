import GoalFulfillmentNotificationItem from "./GoalFulfillmentNotificationItem";
import { BalanceGoalFulfillment } from "@/stores/notifications/goalFulfillmentStore";

export default function GoalFultillmentNotificationList({
  notifications,
}: {
  notifications: (BalanceGoalFulfillment | null)[];
}) {
  return (
    <>
      {notifications.map((fulfillment) => (
        <GoalFulfillmentNotificationItem
          key={fulfillment?.id}
          fulfillment={fulfillment!}
        />
      ))}
    </>
  );
}
